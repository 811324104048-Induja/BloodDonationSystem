package com.blooddonation.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blooddonation.dto.LoginRequest;
import com.blooddonation.dto.SignupRequest;
import com.blooddonation.entity.BloodGroup;
import com.blooddonation.entity.Donor;
import com.blooddonation.entity.Patient;
import com.blooddonation.entity.User;
import com.blooddonation.repository.DonorRepository;
import com.blooddonation.repository.PatientRepository;
import com.blooddonation.repository.UserRepository;
import com.blooddonation.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    public AuthService(
            UserRepository userRepository,
            DonorRepository donorRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpService otpService) {

        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    public Map<String, Object> signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User.Role role;

        try {
            role = User.Role.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException(
                    "Invalid role. Must be DONOR or PATIENT"
            );
        }

        // Validate donor-specific required fields
        if (role == User.Role.DONOR) {

            if (request.getAge() == null) {
                throw new RuntimeException(
                        "Age is required for donor signup"
                );
            }

            if (request.getCity() == null ||
                    request.getCity().isBlank()) {

                throw new RuntimeException(
                        "City is required for donor signup"
                );
            }

            if (request.getBloodGroup() == null ||
                    request.getBloodGroup().isBlank()) {

                throw new RuntimeException(
                        "Blood group is required for donor signup"
                );
            }
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Password is still required during signup
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setPhone(request.getPhone());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        // Create donor record
        if (role == User.Role.DONOR) {

            Donor donor = new Donor();

            donor.setUser(savedUser);
            donor.setAge(request.getAge());
            donor.setGender(request.getGender());
            donor.setBloodGroup(
                    mapBloodGroup(request.getBloodGroup())
            );
            donor.setCity(request.getCity());
            donor.setAddress(request.getAddress());

            donor.setAvailable(
                    request.getAvailable() != null
                            ? request.getAvailable()
                            : true
            );

            donorRepository.save(donor);
        }

        // Create patient record
        if (role == User.Role.PATIENT) {

            Patient patient = new Patient();

            patient.setUser(savedUser);
            patient.setHospitalName(
                    request.getHospitalName()
            );
            patient.setCity(request.getCity());
            patient.setAddress(request.getAddress());

            patientRepository.save(patient);
        }

        /*
         * Signup is still considered successful.
         *
         * We are keeping your existing behavior of
         * generating a JWT after signup.
         */
        String token = jwtService.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("token", token);
        response.put("user", savedUser);

        return response;
    }

    /*
     * STEP 1 OF LOGIN
     *
     * Email + Password
     *
     * If password is correct:
     *     Generate and send OTP
     *
     * JWT is NOT generated here.
     */
    public Map<String, Object> login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!user.getIsActive()) {
            throw new RuntimeException(
                    "Account is disabled"
            );
        }

        // Verify password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        /*
         * Password is correct.
         *
         * Now send OTP.
         */
        otpService.generateAndSendOtp(
                user.getEmail()
        );

        Map<String, Object> response = new HashMap<>();

        response.put(
                "message",
                "Password verified. OTP sent to your email."
        );

        response.put(
                "otpRequired",
                true
        );

        response.put(
                "email",
                user.getEmail()
        );

        return response;
    }

    /*
     * STEP 2 OF LOGIN
     *
     * Email + OTP
     *
     * If OTP is correct:
     *     Generate JWT
     */
    public Map<String, Object> verifyOtp(
            String email,
            String otp) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (!user.getIsActive()) {
            throw new RuntimeException(
                    "Account is disabled"
            );
        }

        boolean valid =
                otpService.verifyOtp(email, otp);

        if (!valid) {
            throw new RuntimeException(
                    "Invalid or expired OTP"
            );
        }

        // OTP verified successfully.
        // Now generate JWT.
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        Map<String, Object> response = new HashMap<>();

        response.put("token", token);
        response.put("user", user);

        return response;
    }

    // Converts frontend format ("A+", "O-")
    // to enum format
    private BloodGroup mapBloodGroup(String input) {

        String normalized =
                input.trim().toUpperCase();

        switch (normalized) {

            case "A+":
                return BloodGroup.A_POSITIVE;

            case "A-":
                return BloodGroup.A_NEGATIVE;

            case "B+":
                return BloodGroup.B_POSITIVE;

            case "B-":
                return BloodGroup.B_NEGATIVE;

            case "AB+":
                return BloodGroup.AB_POSITIVE;

            case "AB-":
                return BloodGroup.AB_NEGATIVE;

            case "O+":
                return BloodGroup.O_POSITIVE;

            case "O-":
                return BloodGroup.O_NEGATIVE;

            default:

                try {
                    return BloodGroup.valueOf(normalized);

                } catch (Exception e) {

                    throw new RuntimeException(
                            "Invalid blood group: " + input
                    );
                }
        }
    }
}