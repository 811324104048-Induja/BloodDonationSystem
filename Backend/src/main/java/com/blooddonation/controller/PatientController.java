package com.blooddonation.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.dto.PatientProfileRequest;
import com.blooddonation.service.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(
            PatientService patientService) {

        this.patientService = patientService;
    }


    // ==========================================
    // GET LOGGED-IN PATIENT PROFILE
    // ==========================================

    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {

        try {

            return ResponseEntity.ok(
                    patientService.getMyProfile()
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==========================================
    // UPDATE LOGGED-IN PATIENT PROFILE
    // ==========================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(
            @RequestBody PatientProfileRequest request) {

        try {

            return ResponseEntity.ok(
                    patientService.updateMyProfile(
                            request
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}