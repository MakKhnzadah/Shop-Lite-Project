-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Apparel and fashion items'),
('Home & Kitchen', 'Items for home and kitchen use'),
('Books', 'Books across various genres')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category_id, created_at, updated_at)
SELECT
    'Smartphone X',
    'Latest smartphone with advanced features',
    699.99,
    50,
    id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM categories WHERE name = 'Electronics'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, category_id, created_at, updated_at)
SELECT
    'Laptop Pro',
    'High-performance laptop for professionals',
    1299.99,
    30,
    id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM categories WHERE name = 'Electronics'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, category_id, created_at, updated_at)
SELECT
    'T-Shirt Basic',
    'Comfortable cotton t-shirt',
    19.99,
    100,
    id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM categories WHERE name = 'Clothing'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, category_id, created_at, updated_at)
SELECT
    'Coffee Maker',
    'Automatic coffee maker for home use',
    89.99,
    25,
    id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM categories WHERE name = 'Home & Kitchen'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, category_id, created_at, updated_at)
SELECT
    'Programming Guide',
    'Comprehensive guide to modern programming',
    34.99,
    75,
    id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM categories WHERE name = 'Books'
ON CONFLICT DO NOTHING;