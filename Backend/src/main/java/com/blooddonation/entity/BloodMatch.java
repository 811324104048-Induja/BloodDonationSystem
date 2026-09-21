package com.blooddonation.entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "blood_matches",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"request_id", "donor_id"}
        )
    }
)
public class BloodMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Integer matchId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "donor_id", nullable = false)
    private Integer donorId;

    @Column(name = "compatibility_score")
    private Integer compatibilityScore = 0;

    @Column(name = "distance_km")
    private BigDecimal distanceKm = BigDecimal.ZERO;

    @Column(name = "urgency_score")
    private BigDecimal urgencyScore = BigDecimal.ZERO;

    @Column(name = "availability_score")
    private BigDecimal availabilityScore = BigDecimal.ZERO;

    @Column(name = "final_score")
    private BigDecimal finalScore = BigDecimal.ZERO;

    @Column(name = "match_reason")
    private String matchReason;

    @Enumerated(EnumType.STRING)
@Column(name = "status")
private MatchStatus status = MatchStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    public Integer getMatchId() {
        return matchId;
    }

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }

    public Integer getDonorId() {
        return donorId;
    }

    public void setDonorId(Integer donorId) {
        this.donorId = donorId;
    }

    public Integer getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(Integer compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(BigDecimal distanceKm) {
        this.distanceKm = distanceKm;
    }

    public BigDecimal getUrgencyScore() {
        return urgencyScore;
    }

    public void setUrgencyScore(BigDecimal urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public BigDecimal getAvailabilityScore() {
        return availabilityScore;
    }

    public void setAvailabilityScore(BigDecimal availabilityScore) {
        this.availabilityScore = availabilityScore;
    }

    public BigDecimal getFinalScore() {
        return finalScore;
    }

    public void setFinalScore(BigDecimal finalScore) {
        this.finalScore = finalScore;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }

    public MatchStatus getStatus() {
    return status;
}

public void setStatus(MatchStatus status) {
    this.status = status;
}

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}