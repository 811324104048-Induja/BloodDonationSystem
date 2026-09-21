package com.blooddonation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.blooddonation.entity.DonationHistory;
import com.blooddonation.repository.DonationHistoryRepository;

@Service
public class DonationService {

    private final DonationHistoryRepository repository;

    public DonationService(
            DonationHistoryRepository repository) {

        this.repository = repository;
    }

    public List<DonationHistory> getDonorHistory(
            Integer donorId) {

        return repository
                .findByDonorIdOrderByDonationDateDesc(
                        donorId
                );
    }

    public long getDonationCount(
            Integer donorId) {

        return repository.countByDonorId(
                donorId
        );
    }
}