package com.blooddonation.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(toEmail);
        message.setSubject("BloodConnect Login OTP");

        message.setText(
            "Hello,\n\n" +
            "Your BloodConnect login OTP is: " + otp + "\n\n" +
            "This OTP is valid for 5 minutes.\n\n" +
            "Please do not share this OTP with anyone.\n\n" +
            "Thank you,\n" +
            "BloodConnect Team"
        );

        mailSender.send(message);
    }
}