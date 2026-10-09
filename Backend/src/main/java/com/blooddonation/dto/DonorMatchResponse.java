package com.blooddonation.dto;

import java.math.BigDecimal;

import com.blooddonation.entity.BloodGroup;
import com.blooddonation.entity.BloodMatch;

public class DonorMatchResponse {

    private Integer matchId;
    private Integer requestId;
    private Integer donorId;

    private BloodGroup bloodGroup;
    private Integer unitsRequired;
    private String hospitalName;
    private String city;
    private String urgency;

    private Integer compatibilityScore;
    private BigDecimal distanceKm;
    private BigDecimal urgencyScore;
    private BigDecimal availabilityScore;
    private BigDecimal finalScore;

    private String matchReason;
    private String status;

    public DonorMatchResponse(
            BloodMatch match,
            BloodGroup bloodGroup,
            Integer unitsRequired,
            String hospitalName,
            String city,
            String urgency) {

        this.matchId = match.getMatchId();
        this.requestId = match.getRequestId();
        this.donorId = match.getDonorId();

        this.bloodGroup = bloodGroup;
        this.unitsRequired = unitsRequired;
        this.hospitalName = hospitalName;
        this.city = city;
        this.urgency = urgency;

        this.compatibilityScore = match.getCompatibilityScore();
        this.distanceKm = match.getDistanceKm();
        this.urgencyScore = match.getUrgencyScore();
        this.availabilityScore = match.getAvailabilityScore();
        this.finalScore = match.getFinalScore();

        this.matchReason = match.getMatchReason();
        this.status = match.getStatus().name();
    }

    public Integer getMatchId() {
        return matchId;
    }

    public Integer getRequestId() {
        return requestId;
    }

    public Integer getDonorId() {
        return donorId;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public Integer getUnitsRequired() {
        return unitsRequired;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public String getCity() {
        return city;
    }

    public String getUrgency() {
        return urgency;
    }

    public Integer getCompatibilityScore() {
        return compatibilityScore;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public BigDecimal getUrgencyScore() {
        return urgencyScore;
    }

    public BigDecimal getAvailabilityScore() {
        return availabilityScore;
    }

    public BigDecimal getFinalScore() {
        return finalScore;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public String getStatus() {
        return status;
    }
}