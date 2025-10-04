package com.shoplite.backend.service;

import com.shoplite.backend.model.Product;
import com.shoplite.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Create a test product
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setPrice(new BigDecimal("19.99"));
        testProduct.setStockQuantity(10);
    }

    @Test
    void findAllProducts() {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        when(productRepository.findAll()).thenReturn(products);
        
        // Act
        List<Product> result = productService.findAll();
        
        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Product");
    }

    @Test
    void findAllProductsPaginated() {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        Page<Product> page = new PageImpl<>(products);
        Pageable pageable = PageRequest.of(0, 10);
        when(productRepository.findAll(pageable)).thenReturn(page);
        
        // Act
        Page<Product> result = productService.findAll(pageable);
        
        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Test Product");
    }

    @Test
    void findProductById() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        
        // Act
        Optional<Product> result = productService.findById(1L);
        
        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Product");
    }

    @Test
    void findProductByIdNotFound() {
        // Arrange
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        
        // Act
        Optional<Product> result = productService.findById(99L);
        
        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    void findProductsByCategoryId() {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        when(productRepository.findByCategoryId(1L)).thenReturn(products);
        
        // Act
        List<Product> result = productService.findByCategoryId(1L);
        
        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
    }

    @Test
    void searchProductsByName() {
        // Arrange
        List<Product> products = new ArrayList<>();
        products.add(testProduct);
        when(productRepository.findByNameContainingIgnoreCase("Test")).thenReturn(products);
        
        // Act
        List<Product> result = productService.searchByName("Test");
        
        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Product");
    }

    @Test
    void saveProduct() {
        // Arrange
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);
        
        // Act
        Product savedProduct = productService.save(testProduct);
        
        // Assert
        assertThat(savedProduct).isNotNull();
        assertThat(savedProduct.getName()).isEqualTo("Test Product");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProductStock() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);
        
        // Act
        productService.updateStock(1L, 5);
        
        // Assert
        assertThat(testProduct.getStockQuantity()).isEqualTo(15); // 10 + 5
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProductStockNotFound() {
        // Arrange
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> productService.updateStock(99L, 5))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("Product not found");
    }

    @Test
    void deleteProductById() {
        // Arrange
        doNothing().when(productRepository).deleteById(1L);
        
        // Act
        productService.deleteById(1L);
        
        // Assert
        verify(productRepository, times(1)).deleteById(1L);
    }
}