package com.shoplite.backend.e2e;

import com.shoplite.backend.model.*;
import com.shoplite.backend.repository.RoleRepository;
import com.shoplite.backend.repository.UserRepository;
import com.shoplite.backend.service.AuthService;
import com.shoplite.backend.service.CartService;
import com.shoplite.backend.service.OrderService;
import com.shoplite.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserFlowTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        // Ensure roles exist
        createRolesIfNotExist();

        // Create a test user
        testUser = createTestUser();

        // Create a test product
        testProduct = createTestProduct();
    }

    @Test
    void completeShoppingFlow() {
        // 1. User logs in
        Map<String, Object> loginResult = authService.login(testUser.getEmail(), "password123");
        assertThat(loginResult).containsKey("token");
        assertThat(loginResult).containsKey("user");

        // 2. User adds product to cart
        CartItem cartItem = cartService.addToCart(testUser, testProduct.getId(), 2);
        assertThat(cartItem).isNotNull();
        assertThat(cartItem.getQuantity()).isEqualTo(2);

        // 3. Get user's cart
        Optional<Cart> cartOpt = cartService.findCartByUserId(testUser.getId());
        assertThat(cartOpt).isPresent();
        Cart cart = cartOpt.get();
        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getTotalAmount()).isEqualByComparingTo(new BigDecimal("39.98")); // 19.99 * 2

        // 4. Update cart item quantity
        cartItem = cartService.updateCartItemQuantity(testUser, testProduct.getId(), 3);
        assertThat(cartItem).isNotNull();
        assertThat(cartItem.getQuantity()).isEqualTo(3);

        // 5. Create an order from cart items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtPurchase(item.getProduct().getPrice());
            orderItems.add(orderItem);
        }

        Order order = orderService.createOrder(
            testUser,
            orderItems,
            "123 Test Street, Test City, Test Country",
            "Credit Card",
            null // paymentIntentId (null for testing)
        );

        // 6. Verify order was created
        assertThat(order).isNotNull();
        assertThat(order.getStatus()).isEqualTo(Order.OrderStatus.PENDING);
        assertThat(order.getItems()).hasSize(1);
        assertThat(order.getTotalAmount()).isEqualByComparingTo(new BigDecimal("59.97")); // 19.99 * 3

        // 7. Verify cart was cleared
        cartOpt = cartService.findCartByUserId(testUser.getId());
        // At this point the cart should be empty but still exist
        assertThat(cartOpt).isPresent();
        cart = cartOpt.get();
        assertThat(cart.getItems()).isEmpty();

        // 8. Update order status
        order = orderService.updateOrderStatus(order.getId(), Order.OrderStatus.PROCESSING);
        assertThat(order.getStatus()).isEqualTo(Order.OrderStatus.PROCESSING);

        // 9. Check product stock decreased
        Optional<Product> updatedProductOpt = productService.findById(testProduct.getId());
        assertThat(updatedProductOpt).isPresent();
        Product updatedProduct = updatedProductOpt.get();
        assertThat(updatedProduct.getStockQuantity()).isEqualTo(7); // 10 - 3
    }

    private void createRolesIfNotExist() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(Role.ERole.ROLE_USER);
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName(Role.ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }
    }

    private User createTestUser() {
        // First clean up any existing user with the same email
        userRepository.findByEmail("test_e2e@example.com").ifPresent(u -> userRepository.delete(u));

        // Create a new user
        User user = new User();
        user.setEmail("test_e2e@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName("Test");
        user.setLastName("User");
        return userRepository.save(user);
    }

    private Product createTestProduct() {
        Product product = new Product();
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(new BigDecimal("19.99"));
        product.setStockQuantity(10);
        return productService.save(product);
    }
}