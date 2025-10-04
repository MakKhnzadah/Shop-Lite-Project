package com.shoplite.backend.service;

import com.shoplite.backend.model.Role;
import com.shoplite.backend.model.User;
import com.shoplite.backend.repository.UserRepository;
import com.shoplite.backend.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Create a test role
        testRole = new Role();
        testRole.setId(1);
        testRole.setName(Role.ERole.ROLE_USER);
        
        // Create a test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("encoded_password");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        
        Set<Role> roles = new HashSet<>();
        roles.add(testRole);
        testUser.setRoles(roles);
    }

    @Test
    void loginSuccess() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        
        String token = "test_jwt_token";
        when(jwtUtil.generateToken(anyString())).thenReturn(token);
        
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        
        // Act
        Map<String, Object> result = authService.login("test@example.com", "password");
        
        // Assert
        assertThat(result).containsKey("token");
        assertThat(result).containsKey("user");
        assertThat(result.get("token")).isEqualTo(token);
        assertThat(result.get("user")).isEqualTo(testUser);
    }

    @Test
    void loginUserNotFound() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        
        String token = "test_jwt_token";
        when(jwtUtil.generateToken(anyString())).thenReturn(token);
        
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> authService.login("nonexistent@example.com", "password"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("User not found");
    }

    @Test
    void registerSuccess() {
        // Arrange
        User newUser = new User();
        newUser.setEmail("new@example.com");
        newUser.setPassword("password");
        
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded_password");
        when(roleService.findByName(Role.ERole.ROLE_USER)).thenReturn(Optional.of(testRole));
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        
        // Act
        User registeredUser = authService.register(newUser, "USER");
        
        // Assert
        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.getEmail()).isEqualTo("new@example.com");
        assertThat(registeredUser.getPassword()).isEqualTo("encoded_password");
    }

    @Test
    void registerEmailAlreadyTaken() {
        // Arrange
        User newUser = new User();
        newUser.setEmail("existing@example.com");
        newUser.setPassword("password");
        
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);
        
        // Act & Assert
        assertThatThrownBy(() -> authService.register(newUser, "USER"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Email is already taken");
    }

    @Test
    void registerRoleNotFound() {
        // Arrange
        User newUser = new User();
        newUser.setEmail("new@example.com");
        newUser.setPassword("password");
        
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded_password");
        when(roleService.findByName(any(Role.ERole.class))).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> authService.register(newUser, "INVALID_ROLE"))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Role not found");
    }
}