package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.TaxComputation;
import com.mockhackathon.mockhackathon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface TaxComputationRepository extends JpaRepository<TaxComputation, Long> {
    Optional<TaxComputation> findByEmployeeAndFinancialYear(User employee, String financialYear);
    
    @Query("SELECT SUM(tc.tdsDeducted) FROM TaxComputation tc WHERE tc.financialYear = :financialYear")
    BigDecimal sumTotalTdsByFinancialYear(@Param("financialYear") String financialYear);
}
