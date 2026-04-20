import com.mockhackathon.mockhackathon.controllers;

import com.guvi.payroll.entity.*;
import com.guvi.payroll.model.*;
import com.guvi.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SeedController {

    private final UserRepository             userRepository;
    private final SalaryStructureRepository  structureRepository;
    private final DeductionRuleRepository    deductionRuleRepository;
    private final PayrollCycleRepository     cycleRepository;
    private final EmployeePayrollRepository  payrollRepository;
    private final SalaryBreakupRepository    breakupRepository;
    private final TaxComputationRepository   taxRepository;
    private final PasswordEncoder            passwordEncoder;

    @PostMapping
    public ResponseEntity<String> seedData() {

        breakupRepository.deleteAll();
        taxRepository.deleteAll();
        payrollRepository.deleteAll();
        cycleRepository.deleteAll();
        deductionRuleRepository.deleteAll();
        structureRepository.deleteAll();
        userRepository.deleteAll();

        String pass = passwordEncoder.encode("password123");

        User admin = userRepository.save(User.builder()
                .name("Super Admin").email("admin@corepayroll.in")
                .employeeCode("ADM001").password(pass)
                .role(Role.ADMIN).department("IT")
                .joiningDate(LocalDate.of(2022, 1, 1)).build());

        User hr = userRepository.save(User.builder()
                .name("Priya Sharma").email("priya@corepayroll.in")
                .employeeCode("HR001").password(pass)
                .role(Role.HR_MANAGER).department("Human Resources")
                .joiningDate(LocalDate.of(2022, 3, 15)).build());

        User finance = userRepository.save(User.builder()
                .name("Rajan Mehta").email("rajan@corepayroll.in")
                .employeeCode("FIN001").password(pass)
                .role(Role.FINANCE).department("Finance")
                .joiningDate(LocalDate.of(2022, 6, 1)).build());

        User emp1 = userRepository.save(User.builder()
                .name("John Doe").email("john.doe@corepayroll.in")
                .employeeCode("EMP001").password(pass)
                .role(Role.EMPLOYEE).department("Engineering")
                .joiningDate(LocalDate.of(2023, 1, 10)).build());

        User emp2 = userRepository.save(User.builder()
                .name("Sarah Smith").email("sarah.smith@corepayroll.in")
                .employeeCode("EMP002").password(pass)
                .role(Role.EMPLOYEE).department("Engineering")
                .joiningDate(LocalDate.of(2023, 4, 1)).build());

        User emp3 = userRepository.save(User.builder()
                .name("Arjun Nair").email("arjun.nair@corepayroll.in")
                .employeeCode("EMP003").password(pass)
                .role(Role.EMPLOYEE).department("Marketing")
                .joiningDate(LocalDate.of(2023, 7, 15)).build());

        User emp4 = userRepository.save(User.builder()
                .name("Meena Patel").email("meena.patel@corepayroll.in")
                .employeeCode("EMP004").password(pass)
                .role(Role.EMPLOYEE).department("Operations")
                .joiningDate(LocalDate.of(2023, 9, 1)).build());

        structureRepository.save(SalaryStructure.builder()
                .employee(emp1)
                .basicSalary(bd("45000")).hra(bd("22500")).da(bd("7000"))
                .specialAllowance(bd("15000")).bonus(bd("60000")).lta(bd("10000"))
                .effectiveFrom(LocalDate.of(2023, 1, 10)).build());

        structureRepository.save(SalaryStructure.builder()
                .employee(emp2)
                .basicSalary(bd("38000")).hra(bd("19000")).da(bd("6000"))
                .specialAllowance(bd("12000")).bonus(bd("45000")).lta(bd("8000"))
                .effectiveFrom(LocalDate.of(2023, 4, 1)).build());

        structureRepository.save(SalaryStructure.builder()
                .employee(emp3)
                .basicSalary(bd("30000")).hra(bd("15000")).da(bd("5000"))
                .specialAllowance(bd("10000")).bonus(bd("30000")).lta(bd("6000"))
                .effectiveFrom(LocalDate.of(2023, 7, 15)).build());

        structureRepository.save(SalaryStructure.builder()
                .employee(emp4)
                .basicSalary(bd("25000")).hra(bd("12500")).da(bd("4000"))
                .specialAllowance(bd("8000")).bonus(bd("20000")).lta(bd("4000"))
                .effectiveFrom(LocalDate.of(2023, 9, 1)).build());

        // ── 6. Deduction rules ──────────────────────────────────────────────
        deductionRuleRepository.save(DeductionRule.builder()
                .deductionType(DeductionType.PF)
                .percentage(bd("12")).maxAmount(bd("21600"))
                .applicableFrom(LocalDate.of(2023, 1, 1)).build());

        deductionRuleRepository.save(DeductionRule.builder()
                .deductionType(DeductionType.ESI)
                .percentage(bd("0.75")).maxAmount(bd("21000"))
                .applicableFrom(LocalDate.of(2023, 1, 1)).build());

        deductionRuleRepository.save(DeductionRule.builder()
                .deductionType(DeductionType.PROFESSIONAL_TAX)
                .fixedAmount(bd("200")).maxAmount(bd("2400"))
                .applicableFrom(LocalDate.of(2023, 1, 1)).build());

        deductionRuleRepository.save(DeductionRule.builder()
                .deductionType(DeductionType.TDS)
                .percentage(bd("10"))
                .applicableFrom(LocalDate.of(2023, 1, 1)).build());


        PayrollCycle jan = cycleRepository.save(PayrollCycle.builder()
                .month("January").year(2025)
                .startDate(LocalDate.of(2025, 1, 1))
                .endDate(LocalDate.of(2025, 1, 31))
                .paymentDate(LocalDate.of(2025, 2, 5))
                .status(PayrollStatus.DRAFT).build());
        processAndComplete(jan, List.of(emp1, emp2, emp3, emp4), finance);

        PayrollCycle feb = cycleRepository.save(PayrollCycle.builder()
                .month("February").year(2025)
                .startDate(LocalDate.of(2025, 2, 1))
                .endDate(LocalDate.of(2025, 2, 28))
                .paymentDate(LocalDate.of(2025, 3, 5))
                .status(PayrollStatus.DRAFT).build());
        processAndComplete(feb, List.of(emp1, emp2, emp3, emp4), finance);

        PayrollCycle mar = cycleRepository.save(PayrollCycle.builder()
                .month("March").year(2025)
                .startDate(LocalDate.of(2025, 3, 1))
                .endDate(LocalDate.of(2025, 3, 31))
                .paymentDate(LocalDate.of(2025, 4, 5))
                .status(PayrollStatus.DRAFT).build());
        processAndComplete(mar, List.of(emp1, emp2, emp3, emp4), finance);

        cycleRepository.save(PayrollCycle.builder()
                .month("April").year(2025)
                .startDate(LocalDate.of(2025, 4, 1))
                .endDate(LocalDate.of(2025, 4, 30))
                .paymentDate(LocalDate.of(2025, 5, 5))
                .status(PayrollStatus.DRAFT).build());

        return ResponseEntity.ok(
                "✓ Seeded: 7 users, 4 salary structures, 4 deduction rules, " +
                        "3 completed payroll cycles + 1 draft cycle, salary breakups & tax computations."
        );
    }


    private void processAndComplete(PayrollCycle cycle, List<User> employees, User processedBy) {
        cycle.setStatus(PayrollStatus.PROCESSING);
        cycleRepository.save(cycle);

        for (User employee : employees) {
            structureRepository.findByEmployee(employee).ifPresent(structure -> {
                BigDecimal monthly = structure.getBonus() != null
                        ? structure.getBonus().divide(bd("12"), 2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;
                BigDecimal gross = nullSafe(structure.getBasicSalary())
                        .add(nullSafe(structure.getHra()))
                        .add(nullSafe(structure.getDa()))
                        .add(nullSafe(structure.getSpecialAllowance()))
                        .add(monthly);

                BigDecimal pfBase = nullSafe(structure.getBasicSalary()).add(nullSafe(structure.getDa()));
                BigDecimal pf  = pfBase.multiply(bd("0.12")).setScale(2, RoundingMode.HALF_UP);
                BigDecimal esi = gross.compareTo(bd("21000")) <= 0
                        ? gross.multiply(bd("0.0075")).setScale(2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;
                BigDecimal pt  = bd("200");

                BigDecimal annual     = gross.multiply(bd("12"));
                BigDecimal deduct80C  = bd("150000");
                BigDecimal taxable    = annual.subtract(deduct80C).max(BigDecimal.ZERO);
                BigDecimal annualTax  = computeTax(taxable);
                BigDecimal cess       = annualTax.multiply(bd("0.04")).setScale(2, RoundingMode.HALF_UP);
                BigDecimal totalTax   = annualTax.add(cess);
                BigDecimal monthlyTDS = totalTax.divide(bd("12"), 2, RoundingMode.HALF_UP);

                BigDecimal totalDed = pf.add(esi).add(pt).add(monthlyTDS);
                BigDecimal net      = gross.subtract(totalDed).max(BigDecimal.ZERO);

                EmployeePayroll ep = payrollRepository.save(EmployeePayroll.builder()
                        .payrollCycle(cycle)
                        .employee(employee)
                        .grossEarnings(gross)
                        .totalDeductions(totalDed)
                        .netSalary(net)
                        .payoutStatus(PayoutStatus.PROCESSED)
                        .bankReference("REF-" + System.currentTimeMillis())
                        .paidAt(LocalDateTime.now())
                        .build());

                saveBreakup(ep, "BASIC",             ComponentType.EARNING,   structure.getBasicSalary(), "As per salary structure");
                saveBreakup(ep, "HRA",               ComponentType.EARNING,   structure.getHra(),         "50% of Basic");
                saveBreakup(ep, "DA",                ComponentType.EARNING,   structure.getDa(),          "Dearness Allowance");
                saveBreakup(ep, "SPECIAL ALLOWANCE", ComponentType.EARNING,   structure.getSpecialAllowance(), "Fixed");
                saveBreakup(ep, "BONUS",             ComponentType.EARNING,   monthly,                    "Annual Bonus / 12");
                saveBreakup(ep, "PF",                ComponentType.DEDUCTION, pf,                         "12% of (Basic + DA)");
                saveBreakup(ep, "ESI",               ComponentType.DEDUCTION, esi,                        "0.75% of Gross (if Gross ≤ ₹21,000)");
                saveBreakup(ep, "PROFESSIONAL TAX",  ComponentType.DEDUCTION, pt,                         "₹200/month fixed");
                saveBreakup(ep, "TDS",               ComponentType.DEDUCTION, monthlyTDS,                 "Monthly TDS as per income slab");

                TaxComputation tc = taxRepository
                        .findByEmployeeAndFinancialYear(employee, cycle.getYear().toString())
                        .orElse(TaxComputation.builder()
                                .employee(employee)
                                .financialYear(cycle.getYear().toString())
                                .tdsDeducted(BigDecimal.ZERO)
                                .totalDeductionsUnder80C(deduct80C)
                                .build());
                tc.setTotalIncome(annual);
                tc.setTaxableIncome(taxable);
                tc.setTaxPayable(annualTax);
                tc.setCess(cess);
                tc.setTotalTax(totalTax);
                tc.setTdsDeducted(tc.getTdsDeducted().add(monthlyTDS));
                tc.setTaxStatus(TaxStatus.COMPUTED);
                taxRepository.save(tc);
            });
        }

        cycle.setStatus(PayrollStatus.COMPLETED);
        cycle.setProcessedAt(LocalDateTime.now());
        cycle.setProcessedBy(processedBy);
        cycleRepository.save(cycle);
    }


    private void saveBreakup(EmployeePayroll ep, String name, ComponentType type, BigDecimal amount, String formula) {
        if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            breakupRepository.save(SalaryBreakup.builder()
                    .employeePayroll(ep)
                    .componentName(name)
                    .componentType(type)
                    .amount(amount)
                    .calculationFormula(formula)
                    .build());
        }
    }


    private BigDecimal computeTax(BigDecimal income) {
        BigDecimal tax = BigDecimal.ZERO;
        if (income.compareTo(bd("250000")) <= 0) return tax;

        if (income.compareTo(bd("500000")) <= 0) {
            return income.subtract(bd("250000")).multiply(bd("0.05")).setScale(2, RoundingMode.HALF_UP);
        }
        tax = bd("250000").multiply(bd("0.05"));          // 5% slab

        if (income.compareTo(bd("1000000")) <= 0) {
            return tax.add(income.subtract(bd("500000")).multiply(bd("0.20"))).setScale(2, RoundingMode.HALF_UP);
        }
        tax = tax.add(bd("500000").multiply(bd("0.20"))); // 20% slab

        return tax.add(income.subtract(bd("1000000")).multiply(bd("0.30"))).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal bd(String val) { return new BigDecimal(val); }
    private static BigDecimal nullSafe(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }
}