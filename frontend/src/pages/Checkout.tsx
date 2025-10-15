import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { useCreateOrderMutation } from '../features/api/apiSlice';
import { clearCart, paymentSuccess, paymentFailed, startPaymentProcess, resetPaymentStatus } from '../features/cart/cartSlice';
import { Product } from '../types';
import StripePaymentForm from '../components/payment/StripePaymentForm';

interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: 'credit' | 'paypal' | 'bank';
}

// Interface for order creation request
interface OrderRequest {
  shippingAddress: string;
  paymentMethod: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  totalAmount: number;
  paymentIntentId?: string; // Optional payment intent ID for credit card payments
}

const Checkout: React.FC = () => {
  const { items, totalAmount, paymentStatus, paymentIntentId } = useAppSelector((state: RootState) => state.cart);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Effect to handle resetting payment status when component mounts/unmounts
  React.useEffect(() => {
    // Reset payment status when component mounts
    dispatch(resetPaymentStatus());
    
    // Reset payment status when component unmounts
    return () => {
      dispatch(resetPaymentStatus());
    };
  }, [dispatch]);
  
  const handlePaymentSuccess = (paymentIntentId: string) => {
    dispatch(paymentSuccess(paymentIntentId));
    handleSubmit(new Event('submit') as any);
  };
  
  const handlePaymentError = (errorMessage: string) => {
    dispatch(paymentFailed(errorMessage));
    setError(`Payment failed: ${errorMessage}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // For credit card payments, we need to check if payment was successful
    if (formData.paymentMethod === 'credit' && paymentStatus !== 'succeeded') {
      // If using Stripe and payment hasn't succeeded yet, don't proceed
      if (e.type === 'submit') {
        // User clicked the form submit button directly, not from Stripe callback
        // We'll let the StripePaymentForm handle the payment process
        return;
      }
    }

    try {
      const orderData: OrderRequest = {
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
        paymentMethod: formData.paymentMethod,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        totalAmount: totalAmount * 1.1, // Including tax
      };
      
      // Add payment intent ID if we have one
      if (formData.paymentMethod === 'credit' && paymentStatus === 'succeeded') {
        orderData.paymentIntentId = paymentIntentId || '';
      }

      await createOrder(orderData as any).unwrap(); // Type assertion as any to bypass type checking
      dispatch(clearCart());
      dispatch(resetPaymentStatus());
      navigate('/order-confirmation');
    } catch (err: any) {
      setError(
        err.data?.message || 'Failed to place your order. Please try again.'
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="mb-4">Checkout</h1>
        <p>Your cart is empty. Please add items to your cart before checkout.</p>
        <a href="/products" className="btn btn-primary">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Checkout</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Shipping Information</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="state" className="form-label">
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="zipCode" className="form-label">
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <h5 className="mt-4">Payment Method</h5>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="credit"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="credit">
                      Credit Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="paypal"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="paypal">
                      PayPal
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="bank"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="bank">
                      Bank Transfer
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'credit' ? (
                  <div className="mt-4">
                    <StripePaymentForm 
                      amount={totalAmount * 1.1}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <hr />
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${(totalAmount * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;