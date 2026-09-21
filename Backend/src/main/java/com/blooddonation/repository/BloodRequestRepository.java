package com.blooddonation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.entity.BloodRequest;

public interface BloodRequestRepository
        extends JpaRepository<BloodRequest, Integer> {

    List<BloodRequest> findByPatientIdOrderByCreatedAtDesc(
            Integer patientId
    );

    List<BloodRequest> findByStatusAndCityOrderByCreatedAtDesc(
            String status,
            String city
    );

    long countByPatientIdAndStatus(
            Integer patientId,
            String status
    );
}