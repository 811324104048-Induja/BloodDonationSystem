
package com.blooddonation.dto;

import java.math.BigDecimal;

import com.blooddonation.entity.MatchStatus;

public class MatchedDonorResponse {

    private Integer matchId;
    private Integer donorId;
    private String donorName;
    private String phoneNumber;
    private BigDecimal matchScore;
    private MatchStatus status;

    public MatchedDonorResponse(
            Integer matchId,
            Integer donorId,
            String donorName,
            String phoneNumber,
            BigDecimal matchScore,
            MatchStatus status) {

        this.matchId = matchId;
        this.donorId = donorId;
        this.donorName = donorName;
        this.phoneNumber = phoneNumber;
        this.matchScore = matchScore;
        this.status = status;
    }

    public Integer getMatchId() {
        return matchId;
    }

    public Integer getDonorId() {
        return donorId;
    }

    public String getDonorName() {
        return donorName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public BigDecimal getMatchScore() {
        return matchScore;
    }

    public MatchStatus getStatus() {
        return status;
    }
}