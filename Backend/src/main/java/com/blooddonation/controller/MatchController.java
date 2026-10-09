
package com.blooddonation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.dto.DonorMatchResponse;
import com.blooddonation.dto.MatchedDonorResponse;
import com.blooddonation.entity.BloodMatch;
import com.blooddonation.service.MatchingService;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchingService matchingService;

    public MatchController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    // =====================================================
    // GENERATE MATCHES FOR A BLOOD REQUEST
    // POST /api/matches/generate/{requestId}
    // =====================================================

    @PostMapping("/generate/{requestId}")
    public ResponseEntity<?> generateMatches(
            @PathVariable Integer requestId) {

        try {
            List<BloodMatch> matches =
                    matchingService.generateMatches(requestId);

            return ResponseEntity.ok(matches);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================================
    // GET MATCHES FOR A PATIENT'S REQUEST
    // GET /api/matches/request/{requestId}
    // =====================================================

    @GetMapping("/request/{requestId}")
    public ResponseEntity<?> getMatchesForRequest(
            @PathVariable Integer requestId) {

        try {
            List<MatchedDonorResponse> matches =
                    matchingService.getMatchesForRequest(requestId);

            return ResponseEntity.ok(matches);

        } catch (RuntimeException e) {

            String message = e.getMessage() != null
                    ? e.getMessage()
                    : "Unable to retrieve matches";

            if (message.contains("not allowed")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", message));
            }

            if (message.contains("Please log in")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", message));
            }

            if (message.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", message));
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("message", message));
        }
    }

    // =====================================================
    // GET MATCHES FOR A DONOR ID
    // GET /api/matches/donor/{donorId}
    // =====================================================

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<?> getDonorMatches(
            @PathVariable Integer donorId) {

        try {
            List<BloodMatch> matches =
                    matchingService.getDonorMatches(donorId);

            return ResponseEntity.ok(matches);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================================
    // GET MATCHES FOR THE CURRENT LOGGED-IN DONOR
    // GET /api/matches/my-matches
    // =====================================================

    @GetMapping("/my-matches")
    public ResponseEntity<?> getMyDonorMatches() {

        try {
            List<DonorMatchResponse> matches =
                    matchingService.getMyDonorMatches();

            return ResponseEntity.ok(matches);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================================
    // ACCEPT A MATCH
    // PATCH /api/matches/{matchId}/accept
    // =====================================================

    @PatchMapping("/{matchId}/accept")
    public ResponseEntity<?> acceptMatch(
            @PathVariable Integer matchId) {

        try {
            BloodMatch match =
                    matchingService.acceptMatch(matchId);

            return ResponseEntity.ok(match);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================================
    // REJECT A MATCH
    // PATCH /api/matches/{matchId}/reject
    // =====================================================

    @PatchMapping("/{matchId}/reject")
    public ResponseEntity<?> rejectMatch(
            @PathVariable Integer matchId) {

        try {
            BloodMatch match =
                    matchingService.rejectMatch(matchId);

            return ResponseEntity.ok(match);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}