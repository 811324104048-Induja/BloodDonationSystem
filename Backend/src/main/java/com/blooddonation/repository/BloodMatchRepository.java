package com.blooddonation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.entity.BloodMatch;

public interface BloodMatchRepository
        extends JpaRepository<BloodMatch, Integer> {

    // Get matches for a request
    List<BloodMatch>
    findByRequestIdOrderByFinalScoreDesc(
            Integer requestId
    );

    // Get matches for a donor
    List<BloodMatch>
    findByDonorIdOrderByFinalScoreDesc(
            Integer donorId
    );

    // Check duplicate match
    boolean existsByRequestIdAndDonorId(
            Integer requestId,
            Integer donorId
    );
}