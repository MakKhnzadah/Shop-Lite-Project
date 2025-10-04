package com.shoplite.backend.service;

import com.shoplite.backend.model.Role;
import com.shoplite.backend.model.User;
import com.shoplite.backend.repository.UserRepository;
import com.shoplite.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RoleService roleService;

    public Map<String, Object> login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(email);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user);
        
        return response;
    }

    public User register(User user, String role) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set user role
        Role.ERole roleEnum;
        try {
            roleEnum = Role.ERole.valueOf("ROLE_" + role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
        
        Role userRole = roleService.findByName(roleEnum)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(Collections.singleton(userRole));

        return userRepository.save(user);
    }
}