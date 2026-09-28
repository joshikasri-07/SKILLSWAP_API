package com.skillswap.skillswap.controller;

import com.skillswap.skillswap.model.Member;
import com.skillswap.skillswap.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<Member> createMember(
            @RequestBody Member member) {

        return new ResponseEntity<>(
                memberService.createMember(member),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {

        return ResponseEntity.ok(
                memberService.getAllMembers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                memberService.getMemberById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(
            @PathVariable Long id,
            @RequestBody Member member) {

        return ResponseEntity.ok(
                memberService.updateMember(id, member)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable Long id) {

        memberService.deleteMember(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<Integer> getCreditBalance(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                memberService.getCreditBalance(id)
        );
    }

    @PutMapping("/{id}/credits")
    public ResponseEntity<Member> addCredits(
            @PathVariable Long id,
            @RequestParam Integer credits) {

        return ResponseEntity.ok(
                memberService.addCredits(id, credits)
        );
    }
}