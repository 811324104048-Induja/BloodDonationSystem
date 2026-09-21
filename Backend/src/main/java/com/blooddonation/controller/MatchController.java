package com.blooddonation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.entity.BloodMatch;
import com.blooddonation.service.MatchingService;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchingService matchingService;

    public MatchController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    // Generate matches for a blood request
    @PostMapping("/generate/{requestId}")
    public ResponseEntity<?> generateMatches(
            @PathVariable Integer requestId) {

        try {

            List<BloodMatch> matches =
                    matchingService.generateMatches(requestId);

            return ResponseEntity.ok(matches);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // Get all matches for a particular blood request
    @GetMapping("/request/{requestId}")
    public ResponseEntity<?> getMatchesForRequest(
            @PathVariable Integer requestId) {

        try {

            List<BloodMatch> matches =
                    matchingService.getMatchesForRequest(requestId);

            return ResponseEntity.ok(matches);

        } catch (RuntimeException e) {

            return ResponseEntity.status(404)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }

    // Get all matches for a donor
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<?> getDonorMatches(
            @PathVariable Integer donorId) {

        try {

            return ResponseEntity.ok(
                    matchingService.getDonorMatches(donorId)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}