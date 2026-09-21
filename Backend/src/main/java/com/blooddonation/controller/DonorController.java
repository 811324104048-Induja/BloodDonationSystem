package com.blooddonation.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.dto.DonorProfileRequest;
import com.blooddonation.service.DonorService;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    // Get logged-in donor's own profile (uses JWT, no ID needed in URL)
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {

        try {
            return ResponseEntity.ok(donorService.getMyProfile());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    // Create or update logged-in donor's own profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(@RequestBody DonorProfileRequest request) {

        try {
            return ResponseEntity.ok(donorService.createOrUpdateMyProfile(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Update logged-in donor's own availability
    @PutMapping("/availability")
    public ResponseEntity<?> updateMyAvailability(@RequestBody Map<String, Boolean> body) {

        try {
            Boolean available = body.get("available");

            if (available == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "available field is required"));
            }

            return ResponseEntity.ok(donorService.updateMyAvailability(available));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Public: view any donor's profile by donor_id (used later for search/matching results)
    @GetMapping("/{donorId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer donorId) {

        try {
            return ResponseEntity.ok(donorService.getProfile(donorId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }
}