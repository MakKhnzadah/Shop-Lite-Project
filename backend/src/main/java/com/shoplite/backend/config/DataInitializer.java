package com.shoplite.backend.config;

import com.shoplite.backend.model.Role;
import com.shoplite.backend.model.User;
import com.shoplite.backend.repository.RoleRepository;
import com.shoplite.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initializeRoles();
        
        // Create admin user if it doesn't exist
        createAdminUser();
    }
    
    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            // Create user role
            Role userRole = new Role();
            userRole.setName(Role.ERole.ROLE_USER);
            roleRepository.save(userRole);
            
            // Create admin role
            Role adminRole = new Role();
            adminRole.setName(Role.ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
            
            System.out.println("Roles initialized");
        }
    }
    
    private void createAdminUser() {
        String adminEmail = "admin@shoplite.com";
        
        if (!userRepository.existsByEmail(adminEmail)) {
            // Get admin role
            Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            
            // Create admin user
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRoles(roles);
            
            userRepository.save(admin);
            
            System.out.println("Admin user created");
        }
    }
}