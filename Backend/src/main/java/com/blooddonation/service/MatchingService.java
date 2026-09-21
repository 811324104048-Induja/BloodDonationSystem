package com.blooddonation.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.blooddonation.entity.BloodMatch;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.Donor;
import com.blooddonation.repository.BloodMatchRepository;
import com.blooddonation.repository.BloodRequestRepository;
import com.blooddonation.repository.DonorRepository;

@Service
public class MatchingService {

    private final BloodRequestRepository requestRepository;
    private final DonorRepository donorRepository;
    private final BloodMatchRepository matchRepository;

    public MatchingService(
            BloodRequestRepository requestRepository,
            DonorRepository donorRepository,
            BloodMatchRepository matchRepository) {

        this.requestRepository = requestRepository;
        this.donorRepository = donorRepository;
        this.matchRepository = matchRepository;
    }

    // --------------------------------------------------
    // GENERATE MATCHES
    // --------------------------------------------------

    public List<BloodMatch> generateMatches(Integer requestId) {

        BloodRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blood request not found"));

        // Find donors having the same blood group
        // and currently available
        List<Donor> donors =
                donorRepository.findByBloodGroupAndAvailableTrue(
                        request.getBloodGroup()
                );

        for (Donor donor : donors) {

            // ------------------------------------------
            // 1. BLOOD GROUP COMPATIBILITY
            // ------------------------------------------

            int compatibilityScore = 40;

            // ------------------------------------------
            // 2. LOCATION SCORE
            // ------------------------------------------

            int locationScore = 0;

            if (donor.getCity() != null
                    && request.getCity() != null
                    && donor.getCity()
                            .equalsIgnoreCase(request.getCity())) {

                locationScore = 25;
            }

            // ------------------------------------------
            // 3. URGENCY SCORE
            // ------------------------------------------

            int urgencyScore;

            String urgency =
                    request.getUrgency() != null
                            ? request.getUrgency()
                                    .trim()
                                    .toUpperCase()
                            : "NORMAL";

            switch (urgency) {

                case "CRITICAL":
                case "EMERGENCY":
                    urgencyScore = 15;
                    break;

                case "URGENT":
                case "HIGH":
                    urgencyScore = 10;
                    break;

                default:
                    urgencyScore = 5;
                    break;
            }

            // ------------------------------------------
            // 4. AVAILABILITY SCORE
            // ------------------------------------------

            int availabilityScore = 20;

            // ------------------------------------------
            // 5. FINAL SCORE
            // ------------------------------------------

            int finalScore =
                    compatibilityScore
                    + locationScore
                    + urgencyScore
                    + availabilityScore;

            // ------------------------------------------
            // CHECK DUPLICATE MATCH
            // ------------------------------------------

            boolean alreadyExists =
                    matchRepository
                            .existsByRequestIdAndDonorId(
                                    requestId,
                                    donor.getDonorId()
                            );

            if (alreadyExists) {
                continue;
            }

            // ------------------------------------------
            // CREATE MATCH
            // ------------------------------------------

            BloodMatch match = new BloodMatch();

            match.setRequestId(requestId);

            match.setDonorId(
                    donor.getDonorId()
            );

            match.setCompatibilityScore(
                    compatibilityScore
            );

            match.setDistanceKm(
                    BigDecimal.ZERO
            );

            match.setUrgencyScore(
                    BigDecimal.valueOf(urgencyScore)
            );

            match.setAvailabilityScore(
                    BigDecimal.valueOf(
                            availabilityScore
                    )
            );

            match.setFinalScore(
                    BigDecimal.valueOf(
                            finalScore
                    )
            );

            match.setMatchReason(
                    "Blood group compatible, "
                    + (
                        locationScore > 0
                            ? "same city, "
                            : "different city, "
                    )
                    + "urgency and donor availability considered"
            );

            matchRepository.save(match);
        }

        // Return matches sorted by highest score
        return matchRepository
                .findByRequestIdOrderByFinalScoreDesc(
                        requestId
                );
    }

    // --------------------------------------------------
    // GET MATCHES FOR REQUEST
    // --------------------------------------------------

    public List<BloodMatch> getMatchesForRequest(
            Integer requestId) {

        // First make sure request exists
        if (!requestRepository.existsById(requestId)) {

            throw new RuntimeException(
                    "Blood request not found"
            );
        }

        return matchRepository
                .findByRequestIdOrderByFinalScoreDesc(
                        requestId
                );
    }

    // --------------------------------------------------
    // GET MATCHES FOR DONOR
    // --------------------------------------------------

    public List<BloodMatch> getDonorMatches(
            Integer donorId) {

        if (!donorRepository.existsById(donorId)) {

            throw new RuntimeException(
                    "Donor not found"
            );
        }

        return matchRepository
                .findByDonorIdOrderByFinalScoreDesc(
                        donorId
                );
    }
}