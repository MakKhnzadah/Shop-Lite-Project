package com.shoplite.backend.service;

import com.shoplite.backend.model.Order;
import com.shoplite.backend.model.OrderItem;
import com.shoplite.backend.model.Product;
import com.shoplite.backend.model.User;
import com.shoplite.backend.repository.OrderItemRepository;
import com.shoplite.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ProductService productService;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }
    
    public List<Order> findByUser(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    @Transactional
    public Order createOrder(User user, List<OrderItem> items, String shippingAddress, String paymentMethod, String paymentIntentId) {
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentIntentId(paymentIntentId);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : items) {
            Optional<Product> productOpt = productService.findById(item.getProduct().getId());
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                
                // Check if enough stock is available
                if (product.getStockQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Not enough stock for product: " + product.getName());
                }
                
                // Update product stock
                productService.updateStock(product.getId(), -item.getQuantity());
                
                // Set price at purchase time
                item.setPriceAtPurchase(product.getPrice());
                
                // Add to total amount
                totalAmount = totalAmount.add(product.getPrice().multiply(new BigDecimal(item.getQuantity())));
            } else {
                throw new RuntimeException("Product not found with id: " + item.getProduct().getId());
            }
        }
        
        order.setTotalAmount(totalAmount);
        
        // Save the order first to get an ID
        Order savedOrder = orderRepository.save(order);
        
        // Set the order reference in each item and save them
        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }
        
        return savedOrder;
    }
    
    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // If the order is being cancelled and it was previously pending or processing,
            // we need to return the products to inventory
            if (status == Order.OrderStatus.CANCELLED && 
                (order.getStatus() == Order.OrderStatus.PENDING || 
                 order.getStatus() == Order.OrderStatus.PROCESSING)) {
                
                List<OrderItem> items = orderItemRepository.findByOrder(order);
                for (OrderItem item : items) {
                    productService.updateStock(item.getProduct().getId(), item.getQuantity());
                }
            }
            
            order.setStatus(status);
            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found with id: " + orderId);
        }
    }

    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }
}