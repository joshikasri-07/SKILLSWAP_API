package com.skillswap.skillswap.service;

import com.skillswap.skillswap.model.CreditLedger;
import com.skillswap.skillswap.model.Member;
import com.skillswap.skillswap.model.SessionRequest;
import com.skillswap.skillswap.model.TransactionType;
import com.skillswap.skillswap.repository.CreditLedgerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditLedgerService {

    private final CreditLedgerRepository creditLedgerRepository;

    public CreditLedgerService(CreditLedgerRepository creditLedgerRepository) {
        this.creditLedgerRepository = creditLedgerRepository;
    }

    public CreditLedger createTransaction(
            Member member,
            SessionRequest sessionRequest,
            TransactionType transactionType,
            Integer hours,
            Integer balanceAfter) {

        CreditLedger ledger = new CreditLedger();

        ledger.setMember(member);
        ledger.setSessionRequest(sessionRequest);
        ledger.setTransactionType(transactionType);
        ledger.setHours(hours);
        ledger.setBalanceAfter(balanceAfter);

        return creditLedgerRepository.save(ledger);
    }

    public List<CreditLedger> getLedgerByMemberId(Long memberId) {
        return creditLedgerRepository.findByMemberId(memberId);
    }

    public List<CreditLedger> getAllTransactions() {
        return creditLedgerRepository.findAll();
    }
}