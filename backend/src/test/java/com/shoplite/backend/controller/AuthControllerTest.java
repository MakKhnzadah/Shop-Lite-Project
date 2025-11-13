package com.shoplite.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shoplite.backend.model.User;
import com.shoplite.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    public void testLoginSuccess() throws Exception {
        // Arrange
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "password");
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", "test_jwt_token");
        
        User user = new User();
        user.setEmail("test@example.com");
        response.put("user", user);
        
        when(authService.login("test@example.com", "password")).thenReturn(response);
        
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test_jwt_token"))
                .andExpect(jsonPath("$.user").exists());
    }

    @Test
    public void testLoginFailure() throws Exception {
        // Arrange
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "wrong_password");
        
        when(authService.login("test@example.com", "wrong_password"))
            .thenThrow(new BadCredentialsException("Invalid credentials"));
        
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testRegisterSuccess() throws Exception {
        // Arrange
        Map<String, Object> registerRequest = new HashMap<>();
        registerRequest.put("email", "new@example.com");
        registerRequest.put("password", "password");
        registerRequest.put("firstName", "New");
        registerRequest.put("lastName", "User");
        registerRequest.put("role", "USER");
        
        User registeredUser = new User();
        registeredUser.setEmail("new@example.com");
        registeredUser.setFirstName("New");
        registeredUser.setLastName("User");
        
        when(authService.register(any(User.class), anyString())).thenReturn(registeredUser);
        
        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("new@example.com"))
                .andExpect(jsonPath("$.firstName").value("New"))
                .andExpect(jsonPath("$.lastName").value("New"));
    }

    @Test
    public void testRegisterDuplicateEmail() throws Exception {
        // Arrange
        Map<String, Object> registerRequest = new HashMap<>();
        registerRequest.put("email", "existing@example.com");
        registerRequest.put("password", "password");
        registerRequest.put("firstName", "Existing");
        registerRequest.put("lastName", "User");
        registerRequest.put("role", "USER");
        
        when(authService.register(any(User.class), anyString()))
            .thenThrow(new RuntimeException("Email is already taken!"));
        
        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }
}