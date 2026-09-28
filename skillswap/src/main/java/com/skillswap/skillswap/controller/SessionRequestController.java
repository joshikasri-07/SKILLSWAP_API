package com.skillswap.skillswap.controller;

import com.skillswap.skillswap.model.SessionRequest;
import com.skillswap.skillswap.service.SessionRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class SessionRequestController {

    private final SessionRequestService sessionRequestService;

    public SessionRequestController(SessionRequestService sessionRequestService) {
        this.sessionRequestService = sessionRequestService;
    }

    // Create session request
    @PostMapping
    public ResponseEntity<SessionRequest> createRequest(
            @RequestParam Long requesterId,
            @RequestParam Long skillOfferId,
            @RequestParam Integer hours) {

        return new ResponseEntity<>(
                sessionRequestService.createRequest(
                        requesterId,
                        skillOfferId,
                        hours
                ),
                HttpStatus.CREATED
        );
    }

    // Get all requests
    @GetMapping
    public ResponseEntity<List<SessionRequest>> getAllRequests() {

        return ResponseEntity.ok(
                sessionRequestService.getAllRequests()
        );
    }

    // Get request by ID
    @GetMapping("/{id}")
    public ResponseEntity<SessionRequest> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionRequestService.getRequestById(id)
        );
    }

    // Confirm request
    @PutMapping("/{id}/confirm")
    public ResponseEntity<SessionRequest> confirmRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionRequestService.confirmRequest(id)
        );
    }

    // Complete request
    @PutMapping("/{id}/complete")
    public ResponseEntity<SessionRequest> completeRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionRequestService.completeRequest(id)
        );
    }

    // Cancel request
    @PutMapping("/{id}/cancel")
    public ResponseEntity<SessionRequest> cancelRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionRequestService.cancelRequest(id)
        );
    }

    // Delete request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(
            @PathVariable Long id) {

        sessionRequestService.deleteRequest(id);

        return ResponseEntity.noContent().build();
    }
}