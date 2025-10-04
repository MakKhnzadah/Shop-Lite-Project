# Shop Lite Database ER Diagram

## USERS

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | email | |
| string | password | |
| string | firstName | |
| string | lastName | |
| datetime | createdAt | |
| datetime | updatedAt | |

## ROLES

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | name | |

## USER_ROLES

| Type | Field | Constraints |
|------|-------|-------------|
| string | userId | FK → USERS.id |
| string | roleId | FK → ROLES.id |

## PRODUCTS

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | name | |
| string | description | |
| decimal | price | |
| string | imageUrl | |
| integer | stockQuantity | |
| string | categoryId | FK → CATEGORIES.id |
| datetime | createdAt | |
| datetime | updatedAt | |

## CATEGORIES

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | name | |
| string | description | |

## CARTS

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | userId | FK → USERS.id |
| decimal | totalAmount | |
| datetime | createdAt | |
| datetime | updatedAt | |

## CART_ITEMS

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | cartId | FK → CARTS.id |
| string | productId | FK → PRODUCTS.id |
| integer | quantity | |

## ORDERS

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | userId | FK → USERS.id |
| string | status | |
| decimal | totalAmount | |
| string | shippingAddress | |
| string | paymentMethod | |
| datetime | createdAt | |
| datetime | updatedAt | |

## ORDER_ITEMS

| Type | Field | Constraints |
|------|-------|-------------|
| string | id | PK |
| string | orderId | FK → ORDERS.id |
| string | productId | FK → PRODUCTS.id |
| integer | quantity | |
| decimal | priceAtPurchase | |