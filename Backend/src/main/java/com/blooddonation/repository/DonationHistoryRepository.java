package com.blooddonation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.entity.DonationHistory;

public interface DonationHistoryRepository
        extends JpaRepository<DonationHistory, Integer> {

    List<DonationHistory> findByDonorIdOrderByDonationDateDesc(
            Integer donorId
    );

    long countByDonorId(Integer donorId);
}