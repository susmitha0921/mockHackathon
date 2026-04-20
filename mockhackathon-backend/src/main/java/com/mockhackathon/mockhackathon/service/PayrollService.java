package com.mockhackathon.mockhackathon.service;

import com.mockhackathon.mockhackathon.entity.*;
import com.mockhackathon.mockhackathon.model.ComponentType;
import com.mockhackathon.mockhackathon.model.PayrollStatus;
import com.mockhackathon.mockhackathon.model.PayoutStatus;
import com.mockhackathon.mockhackathon.model.TaxStatus;
import com.mockhackathon.mockhackathon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollCycleRepository cycleRepository;
    private final EmployeePayrollRepository employeePayrollRepository;
    private final SalaryBreakupRepository breakupRepository;
    private final UserRepository userRepository;
    private final SalaryStructureRepository structureRepository;
    private final SalaryCalculationService calcService;
    private final TaxService taxService;
    private final TaxComputationRepository taxComputationRepository;

    @Transactional
    public PayrollCycle createCycle(String month, Integer year) {
        PayrollCycle cycle = PayrollCycle.builder()
                .month(month)
                .year(year)
                .status(PayrollStatus.DRAFT)
                .build();
        return cycleRepository.save(cycle);
    }

    @Transactional
    public void processCycle(Long cycleId) {
        PayrollCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        if (cycle.getStatus() != PayrollStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT cycles can be processed");
        }

        cycle.setStatus(PayrollStatus.PROCESSING);
        cycleRepository.save(cycle);

        List<User> employees = userRepository.findByRole(com.mockhackathon.mockhackathon.model.Role.EMPLOYEE);

        for (User employee : employees) {
            structureRepository.findByEmployee(employee).ifPresent(structure -> {
                generatePayrollForEmployee(cycle, employee, structure);
            });
        }

        cycle.setStatus(PayrollStatus.COMPLETED);
        cycle.setProcessedAt(LocalDateTime.now());
        cycleRepository.save(cycle);
    }

    private void generatePayrollForEmployee(PayrollCycle cycle, User employee, SalaryStructure structure) {
        BigDecimal gross = calcService.calculateGrossEarnings(structure);
        BigDecimal pf = calcService.calculatePF(structure.getBasicSalary(), structure.getDa());
        BigDecimal esi = calcService.calculateESI(gross);
        BigDecimal pt = calcService.calculatePT(gross);

        // Simple TDS estimation: Annualize current gross
        BigDecimal annualGross = gross.multiply(new BigDecimal("12"));
        // Deduct standard 80C (mocking 1.5L max for now)
        BigDecimal taxableIncome = annualGross.subtract(new BigDecimal("150000")).max(BigDecimal.ZERO);
        BigDecimal annualTax = taxService.calculateAnnualTax(taxableIncome);
        BigDecimal cess = taxService.calculateCess(annualTax);
        BigDecimal totalAnnualTax = annualTax.add(cess);
        BigDecimal monthlyTDS = totalAnnualTax.divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);

        BigDecimal totalDeductions = pf.add(esi).add(pt).add(monthlyTDS);
        BigDecimal netSalary = gross.subtract(totalDeductions).max(BigDecimal.ZERO);

        EmployeePayroll payroll = EmployeePayroll.builder()
                .payrollCycle(cycle)
                .employee(employee)
                .grossEarnings(gross)
                .totalDeductions(totalDeductions)
                .netSalary(netSalary)
                .payoutStatus(PayoutStatus.PENDING)
                .build();
        
        payroll = employeePayrollRepository.save(payroll);

        // Save Breakups
        saveBreakup(payroll, "BASIC", ComponentType.EARNING, structure.getBasicSalary());
        saveBreakup(payroll, "HRA", ComponentType.EARNING, structure.getHra());
        saveBreakup(payroll, "DA", ComponentType.EARNING, structure.getDa());
        saveBreakup(payroll, "PF", ComponentType.DEDUCTION, pf);
        saveBreakup(payroll, "TDS", ComponentType.DEDUCTION, monthlyTDS);
        saveBreakup(payroll, "ESI", ComponentType.DEDUCTION, esi);
        saveBreakup(payroll, "PT", ComponentType.DEDUCTION, pt);

        // Update Tax Computation
        TaxComputation tc = taxComputationRepository.findByEmployeeAndFinancialYear(employee, cycle.getYear().toString())
                .orElse(TaxComputation.builder()
                        .employee(employee)
                        .financialYear(cycle.getYear().toString())
                        .tdsDeducted(BigDecimal.ZERO)
                        .build());
        
        tc.setTotalIncome(annualGross);
        tc.setTaxableIncome(taxableIncome);
        tc.setTotalTax(totalAnnualTax);
        tc.setTdsDeducted(tc.getTdsDeducted().add(monthlyTDS));
        tc.setTaxStatus(TaxStatus.COMPUTED);
        taxComputationRepository.save(tc);
    }

    private void saveBreakup(EmployeePayroll payroll, String name, ComponentType type, BigDecimal amount) {
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            breakupRepository.save(SalaryBreakup.builder()
                    .employeePayroll(payroll)
                    .componentName(name)
                    .componentType(type)
                    .amount(amount)
                    .build());
        }
    }
}
