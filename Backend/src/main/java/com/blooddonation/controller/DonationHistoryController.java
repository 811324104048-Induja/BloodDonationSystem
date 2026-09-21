package com.blooddonation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.entity.DonationHistory;
import com.blooddonation.service.DonationHistoryService;

@RestController
@RequestMapping("/api/donors")
public class DonationHistoryController {

    private final DonationHistoryService donationHistoryService;

    public DonationHistoryController(
            DonationHistoryService donationHistoryService) {

        this.donationHistoryService = donationHistoryService;
    }

    // Get donation history of a donor
    @GetMapping("/{donorId}/donations")
    public ResponseEntity<?> getDonationHistory(
            @PathVariable Integer donorId) {

        try {

            List<DonationHistory> history =
                    donationHistoryService
                            .getDonationHistory(donorId);

            return ResponseEntity.ok(history);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Failed to fetch donation history: "
                            + e.getMessage());
        }
    }

    // Get total donation count
    @GetMapping("/{donorId}/donations/count")
    public ResponseEntity<?> getDonationCount(
            @PathVariable Integer donorId) {

        try {

            long count =
                    donationHistoryService
                            .getDonationCount(donorId);

            return ResponseEntity.ok(count);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Failed to fetch donation count: "
                            + e.getMessage());
        }
    }
}