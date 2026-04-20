package com.mockhackathon.mockhackathon.repository;

import com.mockhackathon.mockhackathon.entity.User;
import com.mockhackathon.mockhackathon.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeCode(String employeeCode);
    List<User> findByRole(Role role);
    List<User> findByDepartment(String department);
    List<User> findByRoleAndDepartment(Role role, String department);
}
