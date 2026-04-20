import com.mockhackathon.mockhackathon.controllers;

import com.mockhackathon.mockhackathon.dto.SalaryStructureDTO;
import com.mockhackathon.mockhackathon.entity.SalaryStructure;
import com.mockhackathon.mockhackathon.entity.User;
import com.mockhackathon.mockhackathon.repository.SalaryStructureRepository;
import com.mockhackathon.mockhackathon.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/salary-structures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalaryStructureController {

    private final SalaryStructureRepository structureRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<SalaryStructureDTO> createStructure(@Valid @RequestBody SalaryStructureDTO dto) {
        User employee = userRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Upsert: update existing structure if one already exists for this employee
        SalaryStructure structure = structureRepository.findByEmployee(employee)
                .orElse(SalaryStructure.builder().employee(employee).build());

        structure.setBasicSalary(dto.getBasicSalary());
        structure.setHra(dto.getHra());
        structure.setDa(dto.getDa());
        structure.setSpecialAllowance(dto.getSpecialAllowance());
        structure.setBonus(dto.getBonus());
        structure.setLta(dto.getLta());
        structure.setEffectiveFrom(dto.getEffectiveFrom());
        structure.setEffectiveTo(dto.getEffectiveTo());

        structure = structureRepository.save(structure);
        dto.setId(structure.getId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<SalaryStructureDTO> getByEmployee(@PathVariable Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return structureRepository.findByEmployee(employee)
                .map(s -> ResponseEntity.ok(convertToDTO(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<SalaryStructureDTO>> getAllStructures(@RequestParam(required = false) String department) {
        List<SalaryStructure> list = (department != null)
                ? structureRepository.findByEmployeeDepartment(department)
                : structureRepository.findAll();

        return ResponseEntity.ok(list.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    private SalaryStructureDTO convertToDTO(SalaryStructure s) {
        return SalaryStructureDTO.builder()
                .id(s.getId())
                .employeeId(s.getEmployee().getId())
                .employeeName(s.getEmployee().getName())
                .employeeCode(s.getEmployee().getEmployeeCode())
                .basicSalary(s.getBasicSalary())
                .hra(s.getHra())
                .da(s.getDa())
                .specialAllowance(s.getSpecialAllowance())
                .bonus(s.getBonus())
                .lta(s.getLta())
                .effectiveFrom(s.getEffectiveFrom())
                .effectiveTo(s.getEffectiveTo())
                .build();
    }
}