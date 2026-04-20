package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.EmployeePayroll;
import com.mockhackathon.mockhackathon.entity.SalaryBreakup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryBreakupRepository extends JpaRepository<SalaryBreakup, Long> {
    List<SalaryBreakup> findByEmployeePayroll(EmployeePayroll employeePayroll);
}
