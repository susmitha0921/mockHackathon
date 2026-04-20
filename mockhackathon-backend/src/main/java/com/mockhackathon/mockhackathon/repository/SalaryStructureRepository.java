package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.SalaryStructure;
import com.mockhackathon.mockhackathon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {
    Optional<SalaryStructure> findByEmployee(User employee);
    List<SalaryStructure> findByEmployeeDepartment(String department);
    
    // Find active salary structure for an employee as of date
    Optional<SalaryStructure> findByEmployeeAndEffectiveFromLessThanEqualAndEffectiveToGreaterThanEqual(
            User employee, LocalDate date1, LocalDate date2);
}
