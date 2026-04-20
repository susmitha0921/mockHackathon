import com.mockhackathon.mockhackathon.controllers;

import com.guvi.payroll.dto.EmployeePayrollDTO;
import com.guvi.payroll.dto.SalaryBreakupDTO;
import com.guvi.payroll.entity.EmployeePayroll;
import com.guvi.payroll.entity.PayrollCycle;
import com.guvi.payroll.entity.User;
import com.guvi.payroll.repository.EmployeePayrollRepository;
import com.guvi.payroll.repository.PayrollCycleRepository;
import com.guvi.payroll.repository.SalaryBreakupRepository;
import com.guvi.payroll.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee-payrolls")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeePayrollController {

    private final EmployeePayrollRepository employeePayrollRepository;
    private final PayrollCycleRepository cycleRepository;
    private final UserRepository userRepository;
    private final SalaryBreakupRepository breakupRepository;

    @GetMapping("/cycle/{cycleId}")
    public ResponseEntity<List<EmployeePayrollDTO>> getByCycle(@PathVariable Long cycleId) {
        PayrollCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        return ResponseEntity.ok(employeePayrollRepository.findByPayrollCycle(cycle)
                .stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeePayrollDTO>> getByEmployee(@PathVariable Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return ResponseEntity.ok(employeePayrollRepository.findByEmployee(employee)
                .stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}/breakup")
    public ResponseEntity<List<SalaryBreakupDTO>> getBreakup(@PathVariable Long id) {
        EmployeePayroll payroll = employeePayrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll record not found"));

        return ResponseEntity.ok(breakupRepository.findByEmployeePayroll(payroll).stream()
                .map(b -> SalaryBreakupDTO.builder()
                        .id(b.getId())
                        .employeePayrollId(payroll.getId())
                        .componentName(b.getComponentName())
                        .componentType(b.getComponentType())
                        .amount(b.getAmount())
                        .calculationFormula(b.getCalculationFormula())
                        .build())
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<EmployeePayrollDTO> markAsPaid(@PathVariable Long id) {
        EmployeePayroll payroll = employeePayrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll record not found"));

        payroll.setPayoutStatus(com.guvi.payroll.model.PayoutStatus.PROCESSED);
        payroll.setPaidAt(java.time.LocalDateTime.now());
        payroll.setBankReference("REF-" + System.currentTimeMillis());

        return ResponseEntity.ok(convertToDTO(employeePayrollRepository.save(payroll)));
    }

    @PutMapping("/cycle/{cycleId}/pay-all")
    public ResponseEntity<String> payAllInCycle(@PathVariable Long cycleId) {
        PayrollCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Cycle not found"));

        List<EmployeePayroll> payrolls = employeePayrollRepository.findByPayrollCycle(cycle);
        int count = 0;
        for (EmployeePayroll payroll : payrolls) {
            if (payroll.getPayoutStatus() == com.guvi.payroll.model.PayoutStatus.PENDING) {
                payroll.setPayoutStatus(com.guvi.payroll.model.PayoutStatus.PROCESSED);
                payroll.setPaidAt(java.time.LocalDateTime.now());
                payroll.setBankReference("REF-" + System.currentTimeMillis());
                count++;
            }
        }
        employeePayrollRepository.saveAll(payrolls);
        return ResponseEntity.ok(count + " payrolls marked as paid");
    }

    private EmployeePayrollDTO convertToDTO(EmployeePayroll ep) {
        return EmployeePayrollDTO.builder()
                .id(ep.getId())
                .payrollCycleId(ep.getPayrollCycle().getId())
                .payrollMonth(ep.getPayrollCycle().getMonth())
                .payrollYear(ep.getPayrollCycle().getYear())
                .employeeId(ep.getEmployee().getId())
                .employeeName(ep.getEmployee().getName())
                .employeeCode(ep.getEmployee().getEmployeeCode())
                .department(ep.getEmployee().getDepartment())
                .grossEarnings(ep.getGrossEarnings())
                .totalDeductions(ep.getTotalDeductions())
                .netSalary(ep.getNetSalary())
                .payoutStatus(ep.getPayoutStatus())
                .bankReference(ep.getBankReference())
                .paidAt(ep.getPaidAt())
                .build();
    }
}