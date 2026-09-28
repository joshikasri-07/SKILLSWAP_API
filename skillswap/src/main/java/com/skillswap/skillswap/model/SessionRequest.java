package com.skillswap.skillswap.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_requests")
public class SessionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "skill_offer_id", nullable = false)
    private SkillOffer skillOffer;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Member requester;

    @Column(nullable = false)
    private Integer requestedHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    public SessionRequest() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SkillOffer getSkillOffer() {
        return skillOffer;
    }

    public void setSkillOffer(SkillOffer skillOffer) {
        this.skillOffer = skillOffer;
    }

    public Member getRequester() {
        return requester;
    }

    public void setRequester(Member requester) {
        this.requester = requester;
    }

    public Integer getRequestedHours() {
        return requestedHours;
    }

    public void setRequestedHours(Integer requestedHours) {
        this.requestedHours = requestedHours;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}