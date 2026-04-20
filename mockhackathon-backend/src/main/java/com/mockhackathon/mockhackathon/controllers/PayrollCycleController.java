import com.mockhackathon.mockhackathon.controllers;

import com.guvi.payroll.dto.PayrollCycleDTO;
import com.guvi.payroll.entity.PayrollCycle;
import com.guvi.payroll.model.PayrollStatus;
import com.guvi.payroll.repository.PayrollCycleRepository;
import com.guvi.payroll.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payroll-cycles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PayrollCycleController {

    private final PayrollService payrollService;
    private final PayrollCycleRepository cycleRepository;

    @PostMapping
    public ResponseEntity<PayrollCycleDTO> createCycle(@Valid @RequestBody PayrollCycleDTO dto) {
        PayrollCycle cycle = payrollService.createCycle(dto.getMonth(), dto.getYear());
        return ResponseEntity.ok(convertToDTO(cycle));
    }

    @PutMapping("/{id}/process")
    public ResponseEntity<Void> processCycle(@PathVariable Long id) {
        payrollService.processCycle(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<PayrollCycleDTO>> getAllCycles(@RequestParam(required = false) PayrollStatus status) {
        List<PayrollCycle> list = (status != null) ? cycleRepository.findByStatus(status) : cycleRepository.findAll();
        return ResponseEntity.ok(list.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayrollCycleDTO> getCycle(@PathVariable Long id) {
        return cycleRepository.findById(id)
                .map(c -> ResponseEntity.ok(convertToDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    private PayrollCycleDTO convertToDTO(PayrollCycle c) {
        return PayrollCycleDTO.builder()
                .id(c.getId())
                .month(c.getMonth())
                .year(c.getYear())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .paymentDate(c.getPaymentDate())
                .status(c.getStatus())
                .processedAt(c.getProcessedAt())
                .processedById(c.getProcessedBy() != null ? c.getProcessedBy().getId() : null)
                .processedByName(c.getProcessedBy() != null ? c.getProcessedBy().getName() : null)
                .build();
    }
}