package com.skillswap.skillswap.controller;

import com.skillswap.skillswap.model.CreditLedger;
import com.skillswap.skillswap.service.CreditLedgerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ledger")
public class CreditLedgerController {

    private final CreditLedgerService creditLedgerService;

    public CreditLedgerController(CreditLedgerService creditLedgerService) {
        this.creditLedgerService = creditLedgerService;
    }

    @GetMapping
    public ResponseEntity<List<CreditLedger>> getAllTransactions() {
        return ResponseEntity.ok(
                creditLedgerService.getAllTransactions()
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<CreditLedger>> getLedgerByMember(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(
                creditLedgerService.getLedgerByMemberId(memberId)
        );
    }
}