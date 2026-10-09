package com.blooddonation.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.dto.AuthResponse;
import com.blooddonation.dto.LoginRequest;
import com.blooddonation.dto.OtpRequest;
import com.blooddonation.dto.SignupRequest;
import com.blooddonation.entity.User;
import com.blooddonation.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // SIGNUP
    // =========================

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequest request) {

        try {

            Map<String, Object> result =
                    authService.signup(request);

            User user =
                    (User) result.get("user");

            AuthResponse.UserResponse userResponse =
                    new AuthResponse.UserResponse(
                            user.getUserId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole().name()
                    );

            AuthResponse response =
                    new AuthResponse(
                            "Signup successful",
                            (String) result.get("token"),
                            userResponse
                    );

            return ResponseEntity.ok(response);

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

    // =========================
    // LOGIN - STEP 1
    // EMAIL + PASSWORD
    // =========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {

            /*
             * Password is verified here.
             *
             * If correct:
             * OTP is sent.
             *
             * JWT is NOT returned yet.
             */

            Map<String, Object> result =
                    authService.login(request);

            return ResponseEntity.ok(result);

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

    // =========================
    // LOGIN - STEP 2
    // VERIFY OTP
    // =========================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody OtpRequest request) {

        try {

            Map<String, Object> result =
                    authService.verifyOtp(
                            request.getEmail(),
                            request.getOtp()
                    );

            User user =
                    (User) result.get("user");

            AuthResponse.UserResponse userResponse =
                    new AuthResponse.UserResponse(
                            user.getUserId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole().name()
                    );

            AuthResponse response =
                    new AuthResponse(
                            "Login successful",
                            (String) result.get("token"),
                            userResponse
                    );

            return ResponseEntity.ok(response);

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