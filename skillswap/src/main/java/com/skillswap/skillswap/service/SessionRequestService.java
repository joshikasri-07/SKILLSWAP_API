package com.skillswap.skillswap.service;

import com.skillswap.skillswap.model.Member;
import com.skillswap.skillswap.model.RequestStatus;
import com.skillswap.skillswap.model.SessionRequest;
import com.skillswap.skillswap.model.SkillOffer;
import com.skillswap.skillswap.model.TransactionType;
import com.skillswap.skillswap.repository.MemberRepository;
import com.skillswap.skillswap.repository.SessionRequestRepository;
import com.skillswap.skillswap.repository.SkillOfferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionRequestService {

    private final SessionRequestRepository sessionRequestRepository;
    private final MemberRepository memberRepository;
    private final SkillOfferRepository skillOfferRepository;
    private final CreditLedgerService creditLedgerService;

    public SessionRequestService(
            SessionRequestRepository sessionRequestRepository,
            MemberRepository memberRepository,
            SkillOfferRepository skillOfferRepository,
            CreditLedgerService creditLedgerService) {

        this.sessionRequestRepository = sessionRequestRepository;
        this.memberRepository = memberRepository;
        this.skillOfferRepository = skillOfferRepository;
        this.creditLedgerService = creditLedgerService;
    }

    public SessionRequest createRequest(
            Long requesterId,
            Long skillOfferId,
            Integer hours) {

        Member requester = memberRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException(
                        "Requester not found with id: " + requesterId));

        SkillOffer skillOffer = skillOfferRepository.findById(skillOfferId)
                .orElseThrow(() -> new RuntimeException(
                        "Skill offer not found with id: " + skillOfferId));

        if (hours <= 0) {
            throw new RuntimeException(
                    "Requested hours must be greater than 0");
        }

        if (hours > skillOffer.getAvailableHours()) {
            throw new RuntimeException(
                    "Requested hours exceed available skill hours");
        }

        if (requester.getId().equals(skillOffer.getProvider().getId())) {
            throw new RuntimeException(
                    "A member cannot request their own skill");
        }

        SessionRequest request = new SessionRequest();

        request.setRequester(requester);
        request.setSkillOffer(skillOffer);
        request.setRequestedHours(hours);
        request.setStatus(RequestStatus.PENDING);
        request.setRequestedAt(LocalDateTime.now());

        return sessionRequestRepository.save(request);
    }

    public List<SessionRequest> getAllRequests() {
        return sessionRequestRepository.findAll();
    }

    public SessionRequest getRequestById(Long id) {
        return sessionRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Session request not found with id: " + id));
    }

    public SessionRequest confirmRequest(Long id) {

        SessionRequest request = getRequestById(id);

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be confirmed");
        }

        request.setStatus(RequestStatus.CONFIRMED);

        return sessionRequestRepository.save(request);
    }

    @Transactional
    public SessionRequest completeRequest(Long id) {

        SessionRequest request = getRequestById(id);

        if (request.getStatus() != RequestStatus.CONFIRMED) {
            throw new RuntimeException(
                    "Only confirmed requests can be completed");
        }

        Member requester = request.getRequester();

        Member provider = request.getSkillOffer().getProvider();

        int hours = request.getRequestedHours();

        // Check requester has enough credits
        if (requester.getCreditBalance() < hours) {
            throw new RuntimeException(
                    "Requester does not have enough credits");
        }

        // Check skill has enough available hours
        if (request.getSkillOffer().getAvailableHours() < hours) {
            throw new RuntimeException(
                    "Not enough skill hours available");
        }

        // Deduct credits from requester
        requester.setCreditBalance(
                requester.getCreditBalance() - hours
        );

        // Add credits to provider
        provider.setCreditBalance(
                provider.getCreditBalance() + hours
        );

        // Reduce available skill hours
        request.getSkillOffer().setAvailableHours(
                request.getSkillOffer().getAvailableHours() - hours
        );

        // Mark request as completed
        request.setStatus(RequestStatus.COMPLETED);

        request.setCompletedAt(LocalDateTime.now());

        // Save updated members
        memberRepository.save(requester);
        memberRepository.save(provider);

        // Save updated skill offer
        skillOfferRepository.save(request.getSkillOffer());

        // Create DEBIT transaction for requester
        creditLedgerService.createTransaction(
                requester,
                request,
                TransactionType.DEBIT,
                hours,
                requester.getCreditBalance()
        );

        // Create CREDIT transaction for provider
        creditLedgerService.createTransaction(
                provider,
                request,
                TransactionType.CREDIT,
                hours,
                provider.getCreditBalance()
        );

        // Save completed request
        return sessionRequestRepository.save(request);
    }

    public SessionRequest cancelRequest(Long id) {

        SessionRequest request = getRequestById(id);

        if (request.getStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed requests cannot be cancelled");
        }

        request.setStatus(RequestStatus.CANCELLED);

        return sessionRequestRepository.save(request);
    }

    public void deleteRequest(Long id) {

        SessionRequest request = getRequestById(id);

        sessionRequestRepository.delete(request);
    }
}