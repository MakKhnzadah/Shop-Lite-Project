# Shop Lite Database ER Diagram

This document describes the database schema for the Shop Lite e-commerce application, including tables, fields, constraints, and relationships between entities.

## USERS

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| string | email | UNIQUE, NOT NULL |
| string | password | NOT NULL |
| string | firstName | |
| string | lastName | |
| datetime | createdAt | NOT NULL |
| datetime | updatedAt | NOT NULL |

## ROLES

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| string | name | UNIQUE, NOT NULL |

## USER_ROLES

| Type | Field | Constraints |
|------|-------|-------------|
| long | user_id | PK, FK → USERS.id |
| long | role_id | PK, FK → ROLES.id |

## PRODUCTS

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| string | name | NOT NULL |
| string | description | |
| decimal | price | NOT NULL |
| string | imageUrl | |
| integer | stockQuantity | NOT NULL, DEFAULT 0 |
| long | category_id | FK → CATEGORIES.id |
| datetime | createdAt | NOT NULL |
| datetime | updatedAt | NOT NULL |

## CATEGORIES

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| string | name | NOT NULL, UNIQUE |
| string | description | |

## CARTS

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| long | user_id | FK → USERS.id, UNIQUE |
| decimal | totalAmount | NOT NULL, DEFAULT 0.00 |
| datetime | createdAt | NOT NULL |
| datetime | updatedAt | NOT NULL |

## CART_ITEMS

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| long | cart_id | FK → CARTS.id, NOT NULL |
| long | product_id | FK → PRODUCTS.id, NOT NULL |
| integer | quantity | NOT NULL, DEFAULT 1 |

## ORDERS

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| long | user_id | FK → USERS.id, NOT NULL |
| string | status | ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'), NOT NULL |
| decimal | totalAmount | NOT NULL |
| string | shippingAddress | NOT NULL |
| string | paymentMethod | NOT NULL |
| datetime | createdAt | NOT NULL |
| datetime | updatedAt | NOT NULL |

## ORDER_ITEMS

| Type | Field | Constraints |
|------|-------|-------------|
| long | id | PK, AUTO_INCREMENT |
| long | order_id | FK → ORDERS.id, NOT NULL |
| long | product_id | FK → PRODUCTS.id, NOT NULL |
| integer | quantity | NOT NULL, DEFAULT 1 |
| decimal | priceAtPurchase | NOT NULL |

## Table Relationships

This section describes the relationships between tables in the Shop Lite database:

1. **USERS and ROLES (Many-to-Many)**
   - Relationship Type: Many-to-Many
   - Join Table: USER_ROLES
   - Description: Users can have multiple roles, and roles can be assigned to multiple users.

2. **USERS and CARTS (One-to-One)**
   - Relationship Type: One-to-One
   - Foreign Key: CARTS.userId references USERS.id
   - Description: Each user can have only one active cart.

3. **USERS and ORDERS (One-to-Many)**
   - Relationship Type: One-to-Many
   - Foreign Key: ORDERS.userId references USERS.id
   - Description: A user can place multiple orders, but each order belongs to only one user.

4. **CATEGORIES and PRODUCTS (One-to-Many)**
   - Relationship Type: One-to-Many
   - Foreign Key: PRODUCTS.categoryId references CATEGORIES.id
   - Description: A category can have multiple products, but each product belongs to only one category.

5. **CARTS and CART_ITEMS (One-to-Many)**
   - Relationship Type: One-to-Many
   - Foreign Key: CART_ITEMS.cartId references CARTS.id
   - Description: A cart can contain multiple cart items, but each cart item belongs to only one cart.

6. **PRODUCTS and CART_ITEMS (One-to-Many)**
   - Relationship Type: One-to-Many
   - Foreign Key: CART_ITEMS.productId references PRODUCTS.id
   - Description: A product can be in multiple cart items (in different carts), but each cart item references only one product.

7. **ORDERS and ORDER_ITEMS (One-to-Many)**
   - Relationship Type: One-to-Many
   - Foreign Key: ORDER_ITEMS.orderId references ORDERS.id
   - Description: An order can contain multiple order items, but each order item belongs to only one order.

8. **PRODUCTS and ORDER_ITEMS (One-to-Many)**
   - Relationship Type: One-to-Many
   - Foreign Key: ORDER_ITEMS.productId references PRODUCTS.id
   - Description: A product can be in multiple order items (in different orders), but each order item references only one product.

## ER Diagram Visualization

The diagram below visually represents the entity relationships similar to the example provided. The tables are connected with relationship lines indicating cardinality and relationship types:

```
                  +--------------+
                  |    ROLES     |
                  +--------------+
                  | long | id  | PK
                  | string | name|
                  +--------------+
                          ▲
                          |
                          | has
                          |
+------------+     +--------------+     +---------------+
|   USERS    |     |  USER_ROLES  |     |    ORDERS     |
+------------+     +--------------+     +---------------+
| long | id | PK   | long | user_id | FK | long | id  | PK
| string | email |  | long | role_id | FK | long | user_id | FK
| string | password |+--------------+     | string | status | ENUM
| string | firstName|        ▲             | decimal | totalAmount |
| string | lastName |        |             | string | shippingAddress |
| datetime| createdAt|       |             | string | paymentMethod |
| datetime| updatedAt|       |             | datetime | createdAt |
+------------+       |             | datetime | updatedAt |
      |              |             +---------------+
      |              |                     |
      | owns         | has                 | places
      |              |                     |
      ▼              |                     ▼
+------------+       |             +---------------+
|   CARTS    |       |             |  ORDER_ITEMS  |
+------------+       |             +---------------+
| long | id | PK     |             | long | id  | PK
| long | user_id | FK|             | long | order_id | FK
| decimal | totalAmount |          | long | product_id | FK
| datetime | createdAt |           | integer | quantity |
| datetime | updatedAt |           | decimal | priceAtPurchase |
+------------+                     +---------------+
      |                                   ▲
      | contains                          |
      |                                   |
      ▼                                   |
+------------+                     +---------------+
| CART_ITEMS |                     |   PRODUCTS    |
+------------+                     +---------------+
| long | id | PK                   | long | id  | PK
| long | cart_id | FK              | string | name |
| long | product_id | FK-----------| string | description |
| integer | quantity |             | decimal | price |
+------------+                     | string | imageUrl |
                                  | integer | stockQuantity |
                                  | long | category_id | FK
                                  | datetime | createdAt |
                                  | datetime | updatedAt |
                                  +---------------+
                                         ▲
                                         |
                                         | belongs to
                                         |
                                  +---------------+
                                  |  CATEGORIES   |
                                  +---------------+
                                  | long | id  | PK
                                  | string | name |
                                  | string | description |
                                  +---------------+
```

Legend:
- PK: Primary Key
- FK: Foreign Key
- |: Connection line
- ▲: Points to parent table in the relationship
- →: Relationship direction
- Relationship labels: "has", "contains", "places", etc. indicate the nature of relationship