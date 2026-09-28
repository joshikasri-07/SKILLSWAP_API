package com.skillswap.skillswap.repository;

import com.skillswap.skillswap.model.CreditLedger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreditLedgerRepository extends JpaRepository<CreditLedger, Long> {

    List<CreditLedger> findByMemberId(Long memberId);
}