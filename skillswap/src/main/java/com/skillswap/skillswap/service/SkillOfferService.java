package com.skillswap.skillswap.service;

import com.skillswap.skillswap.model.Member;
import com.skillswap.skillswap.model.SkillOffer;
import com.skillswap.skillswap.repository.MemberRepository;
import com.skillswap.skillswap.repository.SkillOfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillOfferService {

    private final SkillOfferRepository skillOfferRepository;
    private final MemberRepository memberRepository;

    public SkillOfferService(
            SkillOfferRepository skillOfferRepository,
            MemberRepository memberRepository) {

        this.skillOfferRepository = skillOfferRepository;
        this.memberRepository = memberRepository;
    }

    // Create skill offer
    public SkillOffer createSkillOffer(Long memberId, SkillOffer skillOffer) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException("Member not found with id: " + memberId));

        skillOffer.setProvider(member);

        return skillOfferRepository.save(skillOffer);
    }

    // Get all skill offers
    public List<SkillOffer> getAllSkillOffers() {
        return skillOfferRepository.findAll();
    }

    // Get skill offer by ID
    public SkillOffer getSkillOfferById(Long id) {

        return skillOfferRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Skill offer not found with id: " + id));
    }

    // Update skill offer
    public SkillOffer updateSkillOffer(
            Long id,
            SkillOffer updatedSkillOffer) {

        SkillOffer existingSkillOffer = getSkillOfferById(id);

        existingSkillOffer.setSkillName(updatedSkillOffer.getSkillName());
        existingSkillOffer.setDescription(updatedSkillOffer.getDescription());
        existingSkillOffer.setAvailableHours(
                updatedSkillOffer.getAvailableHours()
        );

        return skillOfferRepository.save(existingSkillOffer);
    }

    // Delete skill offer
    public void deleteSkillOffer(Long id) {

        SkillOffer existingSkillOffer = getSkillOfferById(id);

        skillOfferRepository.delete(existingSkillOffer);
    }
}