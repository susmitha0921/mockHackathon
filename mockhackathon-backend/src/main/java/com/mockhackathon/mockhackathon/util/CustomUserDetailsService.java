package com.mockhackathon.mockhackathon.util;

import com.guvi.payroll.entity.User;
import com.guvi.payroll.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String employeeCode) throws UsernameNotFoundException {
        User user = userRepository.findByEmployeeCode(employeeCode)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with employee code: " + employeeCode));

        return new org.springframework.security.core.userdetails.User(
                user.getEmployeeCode(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}