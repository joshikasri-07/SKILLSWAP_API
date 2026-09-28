package com.skillswap.skillswap.repository;

import com.skillswap.skillswap.model.SessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRequestRepository extends JpaRepository<SessionRequest, Long> {

}