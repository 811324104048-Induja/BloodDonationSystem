package com.blooddonation.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.blooddonation.dto.BloodRequestRequest;
import com.blooddonation.entity.BloodGroup;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.Patient;
import com.blooddonation.entity.User;
import com.blooddonation.repository.BloodRequestRepository;
import com.blooddonation.repository.PatientRepository;
import com.blooddonation.repository.UserRepository;

@Service
public class BloodRequestService {

    private final BloodRequestRepository repository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    public BloodRequestService(
            BloodRequestRepository repository,
            UserRepository userRepository,
            PatientRepository patientRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }

    // Get currently logged-in user
    private User getCurrentUser() {

        String email = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );
    }

    // Get patient profile of currently logged-in user
    private Patient getCurrentPatient() {

        User user = getCurrentUser();

        return patientRepository
                .findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient profile not found"
                        )
                );
    }

    // Create blood request
    public BloodRequest createMyRequest(
            BloodRequestRequest request) {

        Patient patient = getCurrentPatient();

        BloodRequest bloodRequest =
                new BloodRequest();

        // IMPORTANT:
        // Use patient_id, NOT user_id
        bloodRequest.setPatientId(
                patient.getPatientId()
        );

        if (request.getBloodGroup() != null) {

            bloodRequest.setBloodGroup(
                    convertBloodGroup(
                            request.getBloodGroup()
                    )
            );
        }

        bloodRequest.setUnitsRequired(
                request.getUnitsRequired()
        );

        bloodRequest.setHospitalName(
                request.getHospitalName()
        );

        bloodRequest.setCity(
                request.getCity()
        );

        bloodRequest.setAddress(
                request.getAddress()
        );

        bloodRequest.setUrgency(
                request.getUrgency()
        );

        bloodRequest.setRequiredDate(
                request.getRequiredDate()
        );

        bloodRequest.setDescription(
                request.getDescription()
        );

        return repository.save(bloodRequest);
    }

    // Get logged-in patient's requests
    public List<BloodRequest> getMyRequests() {

        Patient patient = getCurrentPatient();

        return repository
                .findByPatientIdOrderByCreatedAtDesc(
                        patient.getPatientId()
                );
    }

    // Get one request
    public BloodRequest getRequest(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Blood request not found"
                        )
                );
    }

    // Cancel logged-in patient's request
    public BloodRequest cancelMyRequest(
            Integer requestId) {

        Patient patient = getCurrentPatient();

        BloodRequest request =
                getRequest(requestId);

        if (!request.getPatientId()
                .equals(patient.getPatientId())) {

            throw new RuntimeException(
                    "You are not allowed to modify this request"
            );
        }

        request.setStatus("CANCELLED");

        return repository.save(request);
    }

    // Convert frontend blood group to Java enum
    private BloodGroup convertBloodGroup(
            String bloodGroup) {

        if (bloodGroup == null ||
                bloodGroup.isBlank()) {

            throw new RuntimeException(
                    "Blood group is required"
            );
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
                                    + bloodGroup
                    );
        };
    }
}