package com.shoplite.backend.service;

import com.shoplite.backend.model.Cart;
import com.shoplite.backend.model.CartItem;
import com.shoplite.backend.model.Product;
import com.shoplite.backend.model.User;
import com.shoplite.backend.repository.CartItemRepository;
import com.shoplite.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductService productService;
    
    /**
     * Get or create a user's shopping cart
     */
    @Transactional
    public Cart getOrCreateCart(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        if (cartOpt.isPresent()) {
            return cartOpt.get();
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        }
    }
    
    /**
     * Get a user's cart by user ID
     */
    public Optional<Cart> findCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }
    
    /**
     * Add an item to the cart
     */
    @Transactional
    public CartItem addToCart(User user, Long productId, Integer quantity) {
        // Get the product
        Product product = productService.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Check if there is enough stock
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available for: " + product.getName());
        }
        
        // Get or create the user's cart
        Cart cart = getOrCreateCart(user);
        
        // Check if the product is already in the cart
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);
        
        if (existingItemOpt.isPresent()) {
            // Update existing item quantity
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            CartItem savedItem = cartItemRepository.save(existingItem);
            
            // Recalculate cart total
            cart.calculateTotalAmount();
            cartRepository.save(cart);
            
            return savedItem;
        } else {
            // Create new cart item
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            CartItem savedItem = cartItemRepository.save(newItem);
            
            // Add to cart's items and recalculate total
            if (cart.getItems() == null) {
                cart.setItems(new ArrayList<>());
            }
            cart.getItems().add(savedItem);
            cart.calculateTotalAmount();
            cartRepository.save(cart);
            
            return savedItem;
        }
    }
    
    /**
     * Update cart item quantity
     */
    @Transactional
    public CartItem updateCartItemQuantity(User user, Long productId, Integer quantity) {
        if (quantity <= 0) {
            removeFromCart(user, productId);
            return null;
        }
        
        // Get the cart and product
        Cart cart = getOrCreateCart(user);
        Product product = productService.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Check if there is enough stock
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available for: " + product.getName());
        }
        
        // Find the cart item
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
            .orElseThrow(() -> new RuntimeException("Product not found in cart"));
        
        // Update quantity
        cartItem.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(cartItem);
        
        // Recalculate cart total
        cart.calculateTotalAmount();
        cartRepository.save(cart);
        
        return savedItem;
    }
    
    /**
     * Remove an item from the cart
     */
    @Transactional
    public void removeFromCart(User user, Long productId) {
        // Get the cart and product
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        if (!cartOpt.isPresent()) {
            return; // Cart doesn't exist, nothing to remove
        }
        
        Cart cart = cartOpt.get();
        Product product = productService.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Remove the item from the cart
        cartItemRepository.deleteByCartAndProduct(cart, product);
        
        // Refresh cart items and recalculate total
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cart.calculateTotalAmount();
        cartRepository.save(cart);
    }
    
    /**
     * Clear the cart
     */
    @Transactional
    public void clearCart(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cart.getItems().clear();
            cart.setTotalAmount(BigDecimal.ZERO);
            cartRepository.save(cart);
        }
    }
}