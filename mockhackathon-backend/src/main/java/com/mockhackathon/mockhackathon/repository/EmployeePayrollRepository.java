package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.EmployeePayroll;
import com.mockhackathon.mockhackathon.entity.PayrollCycle;
import com.mockhackathon.mockhackathon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeePayrollRepository extends JpaRepository<EmployeePayroll, Long> {
    List<EmployeePayroll> findByPayrollCycle(PayrollCycle payrollCycle);
    List<EmployeePayroll> findByEmployee(User employee);
    Optional<EmployeePayroll> findByEmployeeAndPayrollCycle(User employee, PayrollCycle payrollCycle);
    
    // Aggregates
    @Query("SELECT SUM(ep.netSalary) FROM EmployeePayroll ep WHERE ep.payrollCycle.id = :cycleId AND ep.payoutStatus = 'PROCESSED'")
    BigDecimal sumNetSalaryByCycleId(@Param("cycleId") Long cycleId);
    
    @Query("SELECT ep.employee.department, SUM(ep.grossEarnings) FROM EmployeePayroll ep WHERE ep.payrollCycle.id = :cycleId GROUP BY ep.employee.department")
    List<Object[]> sumGrossEarningsByDepartment(@Param("cycleId") Long cycleId);
}
