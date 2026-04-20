package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.DeductionRule;
import com.mockhackathon.mockhackathon.model.DeductionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeductionRuleRepository extends JpaRepository<DeductionRule, Long> {
    Optional<DeductionRule> findByDeductionTypeAndApplicableFromLessThanEqual(
            DeductionType deductionType, LocalDate date);
    
    List<DeductionRule> findByApplicableFromLessThanEqual(LocalDate date);
}
