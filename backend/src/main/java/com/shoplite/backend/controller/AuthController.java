package com.shoplite.backend.controller;

import com.shoplite.backend.model.User;
import com.shoplite.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            Map<String, Object> response = authService.login(
                loginRequest.get("email"), 
                loginRequest.get("password")
            );
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("Invalid credentials", HttpStatus.UNAUTHORIZED));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> registerRequest) {
        try {
            // Create user object from request
            User newUser = new User();
            newUser.setEmail(registerRequest.get("email"));
            newUser.setPassword(registerRequest.get("password"));
            newUser.setFirstName(registerRequest.get("firstName"));
            newUser.setLastName(registerRequest.get("lastName"));
            
            String role = registerRequest.getOrDefault("role", "USER");
            
            User registeredUser = authService.register(newUser, role);
            
            // Login the user after successful registration
            Map<String, Object> loginResponse = authService.login(
                registerRequest.get("email"), 
                registerRequest.get("password")
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(loginResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("Registration failed: " + e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }
    
    private Map<String, Object> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        errorResponse.put("status", status.value());
        errorResponse.put("timestamp", System.currentTimeMillis());
        errorResponse.put("path", "/api/auth");
        return errorResponse;
    }
}