package com.blooddonation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.blooddonation.entity.DonationHistory;
import com.blooddonation.repository.DonationHistoryRepository;

@Service
public class DonationHistoryService {

    private final DonationHistoryRepository donationHistoryRepository;

    public DonationHistoryService(
            DonationHistoryRepository donationHistoryRepository) {
        this.donationHistoryRepository = donationHistoryRepository;
    }

    // Get donation history for a specific donor
    public List<DonationHistory> getDonationHistory(Integer donorId) {

        return donationHistoryRepository
                .findByDonorIdOrderByDonationDateDesc(donorId);
    }

    // Get total number of donations
    public long getDonationCount(Integer donorId) {

        return donationHistoryRepository
                .countByDonorId(donorId);
    }
}