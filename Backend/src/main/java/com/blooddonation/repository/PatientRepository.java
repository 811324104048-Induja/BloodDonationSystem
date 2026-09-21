package com.blooddonation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.entity.Patient;

public interface PatientRepository
        extends JpaRepository<Patient, Integer> {

    Optional<Patient> findByUser_UserId(Integer userId);
}