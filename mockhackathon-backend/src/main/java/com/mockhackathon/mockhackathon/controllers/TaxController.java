import com.mockhackathon.mockhackathon.controllers;

import com.guvi.payroll.dto.TaxComputationDTO;
import com.guvi.payroll.entity.TaxComputation;
import com.guvi.payroll.entity.User;
import com.guvi.payroll.repository.TaxComputationRepository;
import com.guvi.payroll.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tax")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaxController {

    private final TaxComputationRepository taxComputationRepository;
    private final UserRepository userRepository;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<TaxComputationDTO> getByEmployee(@PathVariable Long employeeId, @RequestParam String financialYear) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return taxComputationRepository.findByEmployeeAndFinancialYear(employee, financialYear)
                .map(tc -> ResponseEntity.ok(convertToDTO(tc)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/financial-year")
    public ResponseEntity<List<TaxComputationDTO>> getByYear(@RequestParam String year) {
        // Simple list all for now
        return ResponseEntity.ok(taxComputationRepository.findAll().stream()
                .filter(tc -> tc.getFinancialYear().equals(year))
                .map(this::convertToDTO)
                .collect(Collectors.toList()));
    }

    private TaxComputationDTO convertToDTO(TaxComputation tc) {
        return TaxComputationDTO.builder()
                .id(tc.getId())
                .employeeId(tc.getEmployee().getId())
                .employeeName(tc.getEmployee().getName())
                .employeeCode(tc.getEmployee().getEmployeeCode())
                .financialYear(tc.getFinancialYear())
                .totalIncome(tc.getTotalIncome())
                .totalDeductionsUnder80C(tc.getTotalDeductionsUnder80C())
                .taxableIncome(tc.getTaxableIncome())
                .taxPayable(tc.getTaxPayable())
                .cess(tc.getCess())
                .totalTax(tc.getTotalTax())
                .tdsDeducted(tc.getTdsDeducted())
                .taxStatus(tc.getTaxStatus())
                .build();
    }
}