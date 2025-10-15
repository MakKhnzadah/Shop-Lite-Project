import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Alert,
  TextField,
  Stack,
  useTheme
} from '@mui/material';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess, onError }) => {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAppSelector((state: RootState) => state.auth);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [email, setEmail] = useState('');
  
  React.useEffect(() => {
    // Call your backend to create a payment intent and get client secret
    if (token && amount > 0) {
      fetch('http://localhost:8080/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: amount * 100 }) // Convert to cents for Stripe
      })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch(err => {
        console.error('Error creating payment intent:', err);
        setError('Could not initiate payment. Please try again later.');
      });
    }
  }, [amount, token]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email
          }
        }
      });
      
      if (error) {
        setError(error.message || 'Payment failed. Please try again.');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      onError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme.palette.divider
      }}
    >
      <Typography variant="h6" mb={2} fontWeight={600}>
        Payment Information
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={3}>
        All transactions are secure and encrypted. Your card information is never stored on our servers.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          
          <Box sx={{ 
            p: 2, 
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: 1,
            '&:focus-within': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
            }
          }}>
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: theme.palette.text.primary,
                    '::placeholder': {
                      color: theme.palette.text.secondary,
                    },
                  },
                  invalid: {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Total: ${amount.toFixed(2)}
            </Typography>
            
            <Button 
              type="submit"
              variant="contained"
              size="large"
              disabled={!stripe || processing || !clientSecret}
              startIcon={processing && <CircularProgress size={20} color="inherit" />}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

// Wrapper component to provide Stripe context
export const StripePaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;