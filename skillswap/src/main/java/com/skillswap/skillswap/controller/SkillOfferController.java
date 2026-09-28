package com.skillswap.skillswap.controller;

import com.skillswap.skillswap.model.SkillOffer;
import com.skillswap.skillswap.service.SkillOfferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillOfferController {

    private final SkillOfferService skillOfferService;

    public SkillOfferController(SkillOfferService skillOfferService) {
        this.skillOfferService = skillOfferService;
    }

    // Create skill offer
    @PostMapping("/member/{memberId}")
    public ResponseEntity<SkillOffer> createSkillOffer(
            @PathVariable Long memberId,
            @RequestBody SkillOffer skillOffer) {

        return new ResponseEntity<>(
                skillOfferService.createSkillOffer(memberId, skillOffer),
                HttpStatus.CREATED
        );
    }

    // Get all skill offers
    @GetMapping
    public ResponseEntity<List<SkillOffer>> getAllSkillOffers() {

        return ResponseEntity.ok(
                skillOfferService.getAllSkillOffers()
        );
    }

    // Get skill offer by ID
    @GetMapping("/{id}")
    public ResponseEntity<SkillOffer> getSkillOfferById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                skillOfferService.getSkillOfferById(id)
        );
    }

    // Update skill offer
    @PutMapping("/{id}")
    public ResponseEntity<SkillOffer> updateSkillOffer(
            @PathVariable Long id,
            @RequestBody SkillOffer skillOffer) {

        return ResponseEntity.ok(
                skillOfferService.updateSkillOffer(id, skillOffer)
        );
    }

    // Delete skill offer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillOffer(
            @PathVariable Long id) {

        skillOfferService.deleteSkillOffer(id);

        return ResponseEntity.noContent().build();
    }
}