# Shop Lite E-commerce Project Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Database Structure](#database-structure)
  - [Class Diagram](#class-diagram)
  - [Entity Descriptions](#entity-descriptions)
- [Functional Requirements](#functional-requirements)
  - [Use Case Diagram](#use-case-diagram)
  - [User Roles](#user-roles)
  - [Use Case Descriptions](#use-case-descriptions)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)

## Project Overview

Shop Lite is an e-commerce application that provides essential shopping functionality with a clean, modern interface. The system supports product browsing, shopping cart management, order processing, and user authentication.

## System Architecture

The Shop Lite application follows a modern client-server architecture:

- **Backend**: Spring Boot application with RESTful API endpoints
- **Frontend**: React application with TypeScript and Redux for state management
- **Database**: H2 (development) / PostgreSQL (production)
- **Authentication**: JWT-based authentication and role-based authorization

## Database Structure

### Class Diagram

The database structure is represented by the following class diagram:

![Class Diagram](./class-diagram.png)

*Note: If the image is not visible, please generate it from the class-diagram.puml file using PlantUML.*

### Entity Descriptions

#### User
- Central entity for authentication and user management
- Stores personal information and credentials
- Associated with roles for authorization
- Has one-to-many relationship with orders
- Has one-to-one relationship with shopping cart

#### Role
- Defines user permissions within the application
- Two primary roles: ROLE_USER and ROLE_ADMIN

#### Product
- Core entity for merchandise
- Contains details like name, description, price, and stock quantity
- Belongs to a category
- Referenced in cart items and order items

#### Category
- Grouping mechanism for products
- Contains a name and description
- Has a one-to-many relationship with products

#### Cart
- Shopping basket for users
- Contains multiple cart items
- Calculates total amount
- Associated with a single user

#### CartItem
- Links products to a cart
- Stores the quantity of each product
- Many-to-one relationship with both cart and product

#### Order
- Represents a completed purchase
- Contains shipping and payment information
- Tracks order status through its lifecycle
- Associated with a user and contains multiple order items

#### OrderItem
- Links products to an order
- Stores the quantity and price at purchase
- Preserves the price at time of purchase for historical accuracy

## Functional Requirements

### Use Case Diagram

The system functionality is represented by the following use case diagram:

![Use Case Diagram](./use-case-diagram.png)

*Note: If the image is not visible, please generate it from the use-case-diagram.puml file using PlantUML.*

### User Roles

#### Customer
- Regular user of the application
- Can browse products, manage cart, and place orders
- Can register, login, and view order history

#### Admin
- Administrative user with elevated privileges
- Can manage products, categories, and orders
- Can update order statuses and manage inventory

### Use Case Descriptions

#### Authentication

1. **Register Account**
   - Allows new users to create an account
   - Collects email, password, and personal information
   - Validates input and creates a new user record

2. **Login**
   - Authenticates users with email and password
   - Returns a JWT token for subsequent authorized requests

3. **Logout**
   - Invalidates the current session
   - Removes authentication token

#### Product Management

4. **Browse Products**
   - Displays a paginated list of available products
   - Includes basic product information and thumbnails

5. **View Product Details**
   - Shows comprehensive information about a specific product
   - Includes images, description, price, and availability

6. **Search Products**
   - Allows users to find products using keywords
   - Filters results based on search criteria

7. **Browse Categories**
   - Shows all product categories
   - Enables navigation by category

8. **Filter Products by Category**
   - Displays products belonging to a selected category
   - Narrows browsing to relevant products

#### Shopping Cart

9. **Add to Cart**
   - Allows users to add products to their shopping cart
   - Specifies quantity and validates against inventory

10. **Remove from Cart**
    - Lets users remove items from their cart
    - Can remove individual items or clear the entire cart

11. **View Cart**
    - Shows all items in the user's shopping cart
    - Displays subtotal and total amounts

12. **Update Cart Quantity**
    - Allows users to change the quantity of items in cart
    - Updates totals automatically

#### Order Management

13. **Checkout**
    - Converts cart to an order
    - Collects shipping and payment information
    - Creates order record and clears cart

14. **View Order History**
    - Shows a list of all orders placed by the user
    - Includes basic order information and status

15. **View Order Details**
    - Displays comprehensive information about a specific order
    - Shows order items, amounts, shipping details, and status

#### Admin Functions

16. **Manage Products**
    - Allows admins to add, update, or delete products
    - Controls inventory and product information

17. **Manage Categories**
    - Enables creation and management of product categories
    - Controls category structure and organization

18. **Manage Orders**
    - Provides overview of all orders in the system
    - Allows status updates and order management

19. **Update Order Status**
    - Changes the status of orders through their lifecycle
    - Updates customers on order progress

## API Endpoints

The Shop Lite backend provides the following API endpoints:

### Authentication Endpoints
- `POST /api/auth/login`: Authenticate user and get token
- `POST /api/auth/register`: Register a new user

### Product Endpoints
- `GET /api/products`: Get all products
- `GET /api/products/{id}`: Get a specific product
- `GET /api/products/category/{categoryId}`: Get products by category

### Category Endpoints
- `GET /api/categories`: Get all categories
- `GET /api/categories/{id}`: Get a specific category

### Order Endpoints
- `GET /api/orders/user`: Get current user's orders
- `GET /api/orders/{id}`: Get a specific order
- `POST /api/orders`: Create a new order

### Cart Endpoints
- `GET /api/cart`: Get current user's cart
- `POST /api/cart/items`: Add item to cart
- `PUT /api/cart/items/{id}`: Update cart item quantity
- `DELETE /api/cart/items/{id}`: Remove item from cart

### Admin Endpoints
- `POST /api/products`: Create a new product (Admin only)
- `PUT /api/products/{id}`: Update a product (Admin only)
- `DELETE /api/products/{id}`: Delete a product (Admin only)
- `GET /api/orders`: Get all orders (Admin only)
- `PUT /api/orders/{id}/status`: Update order status (Admin only)

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Security with JWT
- Spring Data JPA
- Hibernate
- PostgreSQL/H2 Database
- Lombok
- JUnit for testing

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- RTK Query for API integration
- React Router
- CSS modules or styled-components

### DevOps & Tools
- Docker for containerization
- Maven for build automation
- Git for version control
- Swagger/OpenAPI for API documentation