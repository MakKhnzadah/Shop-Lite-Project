package com.shoplite.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
    @Column(nullable = false)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
    
    // Timestamps
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = createdAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
    
    // Helper method to calculate total amount
    public void calculateTotalAmount() {
        this.totalAmount = BigDecimal.ZERO;
        for (CartItem item : items) {
            this.totalAmount = this.totalAmount.add(
                item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity()))
            );
        }
    }
}