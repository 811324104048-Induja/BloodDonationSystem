package com.blooddonation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.dto.BloodRequestRequest;
import com.blooddonation.entity.BloodRequest;
import com.blooddonation.service.BloodRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    private final BloodRequestService service;

    public BloodRequestController(BloodRequestService service) {
        this.service = service;
    }

    // Create blood request for logged-in patient
    @PostMapping
    public ResponseEntity<?> createMyRequest(
            @Valid @RequestBody BloodRequestRequest request) {

        try {

            BloodRequest result =
                    service.createMyRequest(request);

            return ResponseEntity.ok(result);

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

    // Get requests of logged-in patient
    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests() {

        try {

            List<BloodRequest> requests =
                    service.getMyRequests();

            return ResponseEntity.ok(requests);

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

    // Get one request
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequest(
            @PathVariable Integer id) {

        try {

            return ResponseEntity.ok(
                    service.getRequest(id)
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

    // Cancel logged-in patient's request
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyRequest(
            @PathVariable Integer id) {

        try {

            return ResponseEntity.ok(
                    service.cancelMyRequest(id)
            );

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
}