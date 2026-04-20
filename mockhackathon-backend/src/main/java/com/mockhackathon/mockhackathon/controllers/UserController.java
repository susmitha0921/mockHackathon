import com.mockhackathon.mockhackathon.controllers;

import com.mockhackathon.mockhackathon.dto.UserDTO;
import com.mockhackathon.mockhackathon.entity.User;
import com.mockhackathon.mockhackathon.model.Role;
import com.mockhackathon.mockhackathon.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
    private final com.mockhackathon.mockhackathon.util.JwtUtils jwtUtils;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getEmployeeCode());
        org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        loginRequest.getEmployeeCode(), loginRequest.getPassword()));

        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmployeeCode(loginRequest.getEmployeeCode()).get();

        return ResponseEntity.ok(UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .employeeCode(user.getEmployeeCode())
                .role(user.getRole())
                .department(user.getDepartment())
                .token(jwt)
                .build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        log.info("Registering new user: email={}, code={}", userDTO.getEmail(), userDTO.getEmployeeCode());
        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .employeeCode(userDTO.getEmployeeCode())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .role(userDTO.getRole())
                .department(userDTO.getDepartment())
                .joiningDate(userDTO.getJoiningDate())
                .build();

        user = userRepository.save(user);
        userDTO.setId(user.getId());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setPassword(null); // Don't return password
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) Role role) {
        List<User> users = (role != null) ? userRepository.findByRole(role) : userRepository.findAll();

        List<UserDTO> dtos = users.stream().map(u -> UserDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .employeeCode(u.getEmployeeCode())
                .role(u.getRole())
                .department(u.getDepartment())
                .joiningDate(u.getJoiningDate())
                .createdAt(u.getCreatedAt())
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(UserDTO.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .employeeCode(u.getEmployeeCode())
                        .role(u.getRole())
                        .department(u.getDepartment())
                        .joiningDate(u.getJoiningDate())
                        .createdAt(u.getCreatedAt())
                        .build()))
                .orElse(ResponseEntity.notFound().build());
    }
}