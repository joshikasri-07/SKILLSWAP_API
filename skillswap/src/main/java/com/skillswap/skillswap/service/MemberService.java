package com.skillswap.skillswap.service;

import com.skillswap.skillswap.model.Member;
import com.skillswap.skillswap.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Member not found with id: " + id));
    }

    public Member updateMember(Long id, Member updatedMember) {

        Member existingMember = getMemberById(id);

        existingMember.setName(updatedMember.getName());
        existingMember.setEmail(updatedMember.getEmail());

        return memberRepository.save(existingMember);
    }

    public void deleteMember(Long id) {

        Member existingMember = getMemberById(id);

        memberRepository.delete(existingMember);
    }

    public Integer getCreditBalance(Long id) {

        Member member = getMemberById(id);

        return member.getCreditBalance();
    }

    public Member addCredits(Long id, Integer credits) {

        if (credits == null || credits <= 0) {
            throw new RuntimeException(
                    "Credits must be greater than 0");
        }

        Member member = getMemberById(id);

        member.setCreditBalance(
                member.getCreditBalance() + credits
        );

        return memberRepository.save(member);
    }
}