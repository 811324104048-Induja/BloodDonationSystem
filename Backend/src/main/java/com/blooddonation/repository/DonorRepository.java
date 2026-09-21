package com.blooddonation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.entity.BloodGroup;
import com.blooddonation.entity.Donor;

public interface DonorRepository
        extends JpaRepository<Donor, Integer> {

    Optional<Donor> findByUser_UserId(Integer userId);

    List<Donor> findByBloodGroupAndCityAndAvailableTrue(
            BloodGroup bloodGroup,
            String city
    );

    List<Donor> findByBloodGroupAndAvailableTrue(
            BloodGroup bloodGroup
    );

    long countByAvailableTrue();
}