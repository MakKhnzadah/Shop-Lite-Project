package com.shoplite.backend.service;

import com.shoplite.backend.model.Product;
import com.shoplite.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }
    
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
    
    public List<Product> searchByName(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }
    
    public void updateStock(Long productId, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStockQuantity(product.getStockQuantity() + quantity);
            productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + productId);
        }
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}