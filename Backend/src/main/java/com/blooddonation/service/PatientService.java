package com.blooddonation.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blooddonation.dto.PatientProfileRequest;
import com.blooddonation.entity.Patient;
import com.blooddonation.entity.User;
import com.blooddonation.repository.PatientRepository;
import com.blooddonation.repository.UserRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(
            PatientRepository patientRepository,
            UserRepository userRepository) {

        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    // Get currently logged-in patient
    private User getCurrentUser() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found"));
    }

    // Get logged-in patient's profile
    public Patient getMyProfile() {

        User user = getCurrentUser();

        return patientRepository
                .findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));
    }

    // Update logged-in patient's complete profile
    public Patient updateMyProfile(
            PatientProfileRequest request) {

        User user = getCurrentUser();

        // =========================
        // UPDATE USER TABLE
        // =========================

        if (request.getName() != null &&
                !request.getName().isBlank()) {

            user.setName(request.getName());
        }

        if (request.getPhone() != null &&
                !request.getPhone().isBlank()) {

            user.setPhone(request.getPhone());
        }

        userRepository.save(user);


        // =========================
        // UPDATE PATIENT TABLE
        // =========================

        Patient patient = patientRepository
                .findByUser_UserId(user.getUserId())
                .orElseGet(Patient::new);

        patient.setUser(user);

        if (request.getHospitalName() != null) {
            patient.setHospitalName(
                    request.getHospitalName()
            );
        }

        if (request.getCity() != null) {
            patient.setCity(
                    request.getCity()
            );
        }

        if (request.getAddress() != null) {
            patient.setAddress(
                    request.getAddress()
            );
        }

        return patientRepository.save(patient);
    }
}