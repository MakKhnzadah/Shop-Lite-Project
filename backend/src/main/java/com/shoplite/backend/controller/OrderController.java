package com.shoplite.backend.controller;

import com.shoplite.backend.model.Order;
import com.shoplite.backend.model.OrderItem;
import com.shoplite.backend.model.Product;
import com.shoplite.backend.model.User;
import com.shoplite.backend.service.OrderService;
import com.shoplite.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Order> orders = orderService.findByUser(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Order> orderOpt = orderService.findById(id);
        
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Check if user owns the order or is an admin
            if (order.getUser().getId().equals(user.getId()) || 
                user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"))) {
                return ResponseEntity.ok(order);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderRequest, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            
            // Extract order information
            String shippingAddress = (String) orderRequest.get("shippingAddress");
            String paymentMethod = (String) orderRequest.get("paymentMethod");
            String paymentIntentId = (String) orderRequest.get("paymentIntentId"); // May be null for non-credit payments
            BigDecimal totalAmount = new BigDecimal(orderRequest.get("totalAmount").toString());
            
            // Extract order items
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderRequest.get("items");
            List<OrderItem> items = new ArrayList<>();
            
            for (Map<String, Object> itemData : itemsData) {
                Map<String, Object> productData = (Map<String, Object>) itemData.get("product");
                Long productId = Long.valueOf(productData.get("id").toString());
                int quantity = Integer.parseInt(itemData.get("quantity").toString());
                
                Optional<Product> productOpt = productService.findById(productId);
                if (productOpt.isPresent()) {
                    Product product = productOpt.get();
                    
                    OrderItem item = new OrderItem();
                    item.setProduct(product);
                    item.setQuantity(quantity);
                    items.add(item);
                } else {
                    return ResponseEntity.badRequest().body("Product not found with id: " + productId);
                }
            }
            
            // Create the order
            Order order = orderService.createOrder(user, items, shippingAddress, paymentMethod, paymentIntentId);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        try {
            String statusStr = statusRequest.get("status");
            Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr);
            
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating order: " + e.getMessage());
        }
    }
}