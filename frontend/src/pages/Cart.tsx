import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateCartItem, removeFromCart, clearCart } from '../features/cart/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { RootState } from '../app/store';

const Cart: React.FC = () => {
  const { items, totalItems, totalAmount } = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Your Cart</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              {items.map((item: CartItem) => (
                <div key={item.product.id} className="cart-item">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="img-fluid rounded cart-item-img"
                        />
                      ) : (
                        <div className="bg-light text-center p-2 rounded">
                          <span className="text-secondary">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <h5 className="mb-0">{item.product.name}</h5>
                      <small className="text-muted">
                        Category: {item.product.category.name}
                      </small>
                    </div>
                    <div className="col-md-2">
                      <span className="fw-bold">${item.product.price.toFixed(2)}</span>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <Link to="/products" className="btn btn-outline-primary ms-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card cart-summary">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({totalItems}):</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Total:</span>
                <span>${(totalAmount * 1.1).toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;