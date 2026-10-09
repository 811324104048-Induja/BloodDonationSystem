package com.blooddonation.service;

import com.blooddonation.entity.OtpVerification;
import com.blooddonation.repository.OtpVerificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final EmailService emailService;

    public OtpService(
            OtpVerificationRepository otpRepository,
            EmailService emailService) {

        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public void generateAndSendOtp(String email) {

        String otp = String.format(
                "%06d",
                new Random().nextInt(1000000)
        );

        otpRepository.deleteByEmail(email);

        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(5);

        OtpVerification otpVerification =
                new OtpVerification(
                        email,
                        otp,
                        expiryTime
                );

        otpRepository.save(otpVerification);

        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {

        Optional<OtpVerification> result =
                otpRepository.findTopByEmailOrderByIdDesc(email);

        if (result.isEmpty()) {
            return false;
        }

        OtpVerification savedOtp = result.get();

        if (savedOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            otpRepository.delete(savedOtp);
            return false;
        }

        if (!savedOtp.getOtp().equals(otp)) {
            return false;
        }

        otpRepository.delete(savedOtp);

        return true;
    }
}