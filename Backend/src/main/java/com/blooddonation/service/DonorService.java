package com.blooddonation.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blooddonation.dto.DonorProfileRequest;
import com.blooddonation.entity.BloodGroup;
import com.blooddonation.entity.Donor;
import com.blooddonation.entity.User;
import com.blooddonation.repository.DonorRepository;
import com.blooddonation.repository.UserRepository;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public DonorService(
            DonorRepository donorRepository,
            UserRepository userRepository) {

        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found"));
    }

    public Donor getMyProfile() {

        User user = getCurrentUser();

        return donorRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Donor profile not found"));
    }

    public Donor createOrUpdateMyProfile(
            DonorProfileRequest request) {

        User user = getCurrentUser();

        // =========================
        // UPDATE USER DETAILS
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
        // FIND OR CREATE DONOR
        // =========================

        Donor donor = donorRepository
                .findByUser_UserId(user.getUserId())
                .orElseGet(Donor::new);

        donor.setUser(user);

        // =========================
        // UPDATE DONOR DETAILS
        // =========================

        donor.setAge(request.getAge());

        donor.setGender(request.getGender());

        donor.setBloodGroup(
                convertBloodGroup(request.getBloodGroup())
        );

        donor.setCity(request.getCity());

        donor.setAddress(request.getAddress());

        donor.setLastDonationDate(
                request.getLastDonationDate()
        );

        // =========================
        // UPDATE AVAILABILITY
        // =========================

        if (request.getAvailable() != null) {

            donor.setAvailable(
                    request.getAvailable()
            );
        }

        return donorRepository.save(donor);
    }

    public Donor updateMyAvailability(
            Boolean available) {

        Donor donor = getMyProfile();

        donor.setAvailable(available);

        return donorRepository.save(donor);
    }

    public Donor getProfile(Integer donorId) {

        return donorRepository.findById(donorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donor profile not found"));
    }

    private BloodGroup convertBloodGroup(
            String bloodGroup) {

        if (bloodGroup == null ||
                bloodGroup.isBlank()) {

            throw new RuntimeException(
                    "Blood group is required");
        }

        return switch (
                bloodGroup.trim().toUpperCase()) {

            case "A+" ->
                    BloodGroup.A_POSITIVE;

            case "A-" ->
                    BloodGroup.A_NEGATIVE;

            case "B+" ->
                    BloodGroup.B_POSITIVE;

            case "B-" ->
                    BloodGroup.B_NEGATIVE;

            case "AB+" ->
                    BloodGroup.AB_POSITIVE;

            case "AB-" ->
                    BloodGroup.AB_NEGATIVE;

            case "O+" ->
                    BloodGroup.O_POSITIVE;

            case "O-" ->
                    BloodGroup.O_NEGATIVE;

            default ->
                    throw new RuntimeException(
                            "Invalid blood group: "
                                    + bloodGroup);
        };
    }
}