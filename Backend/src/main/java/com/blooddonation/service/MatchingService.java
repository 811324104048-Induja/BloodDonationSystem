
package com.blooddonation.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.blooddonation.dto.DonorMatchResponse;
import com.blooddonation.dto.MatchedDonorResponse;
import com.blooddonation.entity.BloodGroup;
import com.blooddonation.entity.BloodMatch;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.entity.Donor;
import com.blooddonation.entity.MatchStatus;
import com.blooddonation.entity.Patient;
import com.blooddonation.entity.User;
import com.blooddonation.repository.BloodMatchRepository;
import com.blooddonation.repository.BloodRequestRepository;
import com.blooddonation.repository.DonorRepository;
import com.blooddonation.repository.PatientRepository;
import com.blooddonation.repository.UserRepository;

@Service
public class MatchingService {

    private final BloodRequestRepository requestRepository;
    private final DonorRepository donorRepository;
    private final BloodMatchRepository matchRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    public MatchingService(
            BloodRequestRepository requestRepository,
            DonorRepository donorRepository,
            BloodMatchRepository matchRepository,
            UserRepository userRepository,
            PatientRepository patientRepository) {

        this.requestRepository = requestRepository;
        this.donorRepository = donorRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }

    // =====================================================
    // GENERATE MATCHES
    // =====================================================

    @Transactional
    public List<BloodMatch> generateMatches(Integer requestId) {

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Blood request not found"));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException(
                    "This blood request is not active");
        }

        List<Donor> donors = donorRepository.findByAvailableTrue();

        for (Donor donor : donors) {

            if (!isCompatible(
                    request.getBloodGroup(),
                    donor.getBloodGroup())) {
                continue;
            }

            int compatibilityScore = calculateCompatibilityScore(
                    request.getBloodGroup(),
                    donor.getBloodGroup());

            int locationScore = 0;

            if (donor.getCity() != null
                    && request.getCity() != null
                    && donor.getCity().equalsIgnoreCase(request.getCity())) {
                locationScore = 25;
            }

            int urgencyScore;
            String urgency = request.getUrgency() != null
                    ? request.getUrgency().trim().toUpperCase()
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

            int availabilityScore = 20;

            int finalScore = compatibilityScore
                    + locationScore
                    + urgencyScore
                    + availabilityScore;

            boolean alreadyExists =
                    matchRepository.existsByRequestIdAndDonorId(
                            requestId,
                            donor.getDonorId());

            if (alreadyExists) {
                continue;
            }

            BloodMatch match = new BloodMatch();

            match.setRequestId(requestId);
            match.setDonorId(donor.getDonorId());
            match.setCompatibilityScore(compatibilityScore);

            // Kept for compatibility with the existing entity/schema.
            // Distance is not returned in the patient-facing response.
            match.setDistanceKm(BigDecimal.ZERO);

            match.setUrgencyScore(BigDecimal.valueOf(urgencyScore));
            match.setAvailabilityScore(
                    BigDecimal.valueOf(availabilityScore));
            match.setFinalScore(BigDecimal.valueOf(finalScore));
            match.setStatus(MatchStatus.PENDING);

            match.setMatchReason(buildMatchReason(
                    request,
                    donor,
                    compatibilityScore,
                    locationScore));

            matchRepository.save(match);
        }

        return matchRepository
                .findByRequestIdOrderByFinalScoreDesc(requestId);
    }

    // =====================================================
    // BLOOD GROUP COMPATIBILITY
    // =====================================================

    private boolean isCompatible(
            BloodGroup patientBloodGroup,
            BloodGroup donorBloodGroup) {

        if (patientBloodGroup == null || donorBloodGroup == null) {
            return false;
        }

        switch (patientBloodGroup) {
            case O_NEGATIVE:
                return donorBloodGroup == BloodGroup.O_NEGATIVE;

            case O_POSITIVE:
                return donorBloodGroup == BloodGroup.O_POSITIVE
                        || donorBloodGroup == BloodGroup.O_NEGATIVE;

            case A_NEGATIVE:
                return donorBloodGroup == BloodGroup.A_NEGATIVE
                        || donorBloodGroup == BloodGroup.O_NEGATIVE;

            case A_POSITIVE:
                return donorBloodGroup == BloodGroup.A_POSITIVE
                        || donorBloodGroup == BloodGroup.A_NEGATIVE
                        || donorBloodGroup == BloodGroup.O_POSITIVE
                        || donorBloodGroup == BloodGroup.O_NEGATIVE;

            case B_NEGATIVE:
                return donorBloodGroup == BloodGroup.B_NEGATIVE
                        || donorBloodGroup == BloodGroup.O_NEGATIVE;

            case B_POSITIVE:
                return donorBloodGroup == BloodGroup.B_POSITIVE
                        || donorBloodGroup == BloodGroup.B_NEGATIVE
                        || donorBloodGroup == BloodGroup.O_POSITIVE
                        || donorBloodGroup == BloodGroup.O_NEGATIVE;

            case AB_NEGATIVE:
                return donorBloodGroup == BloodGroup.AB_NEGATIVE
                        || donorBloodGroup == BloodGroup.A_NEGATIVE
                        || donorBloodGroup == BloodGroup.B_NEGATIVE
                        || donorBloodGroup == BloodGroup.O_NEGATIVE;

            case AB_POSITIVE:
                return true;

            default:
                return false;
        }
    }

    // =====================================================
    // COMPATIBILITY SCORE
    // =====================================================

    private int calculateCompatibilityScore(
            BloodGroup patientBloodGroup,
            BloodGroup donorBloodGroup) {

        return patientBloodGroup == donorBloodGroup ? 40 : 35;
    }

    // =====================================================
    // MATCH REASON
    // =====================================================

    private String buildMatchReason(
            BloodRequest request,
            Donor donor,
            int compatibilityScore,
            int locationScore) {

        StringBuilder reason = new StringBuilder();
        reason.append("Compatible blood group");

        if (request.getBloodGroup() == donor.getBloodGroup()) {
            reason.append(" (exact blood group)");
        } else {
            reason.append(" (compatible blood group)");
        }

        if (locationScore > 0) {
            reason.append(", same city");
        } else {
            reason.append(", different city");
        }

        reason.append(", donor available");

        return reason.toString();
    }

    // =====================================================
    // CURRENT LOGGED-IN USER
    // =====================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null) {
            throw new RuntimeException("Please log in first");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found"));
    }

    // =====================================================
    // CURRENT LOGGED-IN DONOR
    // =====================================================

    private Donor getCurrentDonor() {

        User user = getCurrentUser();

        return donorRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Donor profile not found"));
    }

    // =====================================================
    // CURRENT LOGGED-IN PATIENT
    // =====================================================

    private Patient getCurrentPatient() {

        User user = getCurrentUser();

        return patientRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));
    }

    // =====================================================
    // GET MATCHES FOR A PATIENT REQUEST
    // Returns donor name, phone, score and status only.
    // =====================================================

    @Transactional(readOnly = true)
    public List<MatchedDonorResponse> getMatchesForRequest(
            Integer requestId) {

        Patient patient = getCurrentPatient();

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Blood request not found"));

        // A patient must only see matches for their own request.
        if (!request.getPatientId().equals(patient.getPatientId())) {
            throw new RuntimeException(
                    "You are not allowed to view this request's matches");
        }

        List<BloodMatch> matches =
                matchRepository.findByRequestIdOrderByFinalScoreDesc(
                        requestId);

        return matches.stream()
                .map(match -> {

                    Donor donor = donorRepository.findById(match.getDonorId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Donor not found for match: "
                                                    + match.getMatchId()));

                    User donorUser = donor.getUser();

                    String donorName = donorUser != null
                            ? donorUser.getName()
                            : "Name unavailable";

                    String phoneNumber = donorUser != null
                            ? donorUser.getPhone()
                            : null;

                    return new MatchedDonorResponse(
                            match.getMatchId(),
                            match.getDonorId(),
                            donorName,
                            phoneNumber,
                            match.getFinalScore(),
                            match.getStatus());
                })
                .toList();
    }

    // =====================================================
    // GET MATCHES FOR A SPECIFIC DONOR
    // =====================================================

    public List<BloodMatch> getDonorMatches(Integer donorId) {

        if (!donorRepository.existsById(donorId)) {
            throw new RuntimeException("Donor not found");
        }

        return matchRepository
                .findByDonorIdOrderByFinalScoreDesc(donorId);
    }

    // =====================================================
    // GET MATCHES FOR CURRENT LOGGED-IN DONOR
    // =====================================================

    public List<DonorMatchResponse> getMyDonorMatches() {

        Donor donor = getCurrentDonor();

        List<BloodMatch> matches =
                matchRepository.findByDonorIdOrderByFinalScoreDesc(
                        donor.getDonorId());

        return matches.stream()
                .map(match -> {

                    BloodRequest request =
                            requestRepository.findById(match.getRequestId())
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Blood request not found for match: "
                                                            + match.getMatchId()));

                    return new DonorMatchResponse(
                            match,
                            request.getBloodGroup(),
                            request.getUnitsRequired(),
                            request.getHospitalName(),
                            request.getCity(),
                            request.getUrgency());
                })
                .toList();
    }

    // =====================================================
    // ACCEPT MATCH
    // =====================================================

    @Transactional
    public BloodMatch acceptMatch(Integer matchId) {

        Donor donor = getCurrentDonor();

        BloodMatch match = matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new RuntimeException("Match not found"));

        if (!match.getDonorId().equals(donor.getDonorId())) {
            throw new RuntimeException(
                    "You are not allowed to accept this match");
        }

        if (match.getStatus() != MatchStatus.PENDING) {
            throw new RuntimeException(
                    "This match is no longer pending");
        }

        match.setStatus(MatchStatus.ACCEPTED);
        return matchRepository.save(match);
    }

    // =====================================================
    // REJECT MATCH
    // =====================================================

    @Transactional
    public BloodMatch rejectMatch(Integer matchId) {

        Donor donor = getCurrentDonor();

        BloodMatch match = matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new RuntimeException("Match not found"));

        if (!match.getDonorId().equals(donor.getDonorId())) {
            throw new RuntimeException(
                    "You are not allowed to reject this match");
        }

        if (match.getStatus() != MatchStatus.PENDING) {
            throw new RuntimeException(
                    "This match is no longer pending");
        }

        match.setStatus(MatchStatus.REJECTED);
        return matchRepository.save(match);
    }
}