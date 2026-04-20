package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.PayrollCycle;
import com.mockhackathon.mockhackathon.model.PayrollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollCycleRepository extends JpaRepository<PayrollCycle, Long> {
    List<PayrollCycle> findByStatus(PayrollStatus status);
    Optional<PayrollCycle> findByMonthAndYear(String month, Integer year);
}
