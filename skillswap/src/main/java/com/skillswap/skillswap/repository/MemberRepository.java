package com.skillswap.skillswap.repository;

import com.skillswap.skillswap.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

}