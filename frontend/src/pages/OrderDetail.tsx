import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Placeholder order steps for status tracking
const orderSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

// Order type definition
interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  totalAmount: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
}

const OrderDetail: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real application, this would fetch from an API
    // For now, we'll simulate loading and use placeholder data
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      if (id) {
        // Placeholder data
        const placeholderOrder: Order = {
          id: parseInt(id),
          orderNumber: `ORD-2025-00${id}`,
          date: '2025-10-01',
          status: 'DELIVERED',
          totalAmount: 129.99,
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          paymentMethod: 'Credit Card (ending in 1234)',
          items: [
            { 
              id: 101, 
              name: "Premium Headphones", 
              quantity: 1, 
              price: 99.99,
              imageUrl: "https://via.placeholder.com/100"
            },
            { 
              id: 102, 
              name: "USB-C Cable", 
              quantity: 2, 
              price: 15.00,
              imageUrl: "https://via.placeholder.com/100"
            }
          ]
        };
        
        setOrder(placeholderOrder);
        setLoading(false);
      } else {
        setError('Order not found');
        setLoading(false);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Determine the current step based on order status
  const getActiveStep = () => {
    if (!order) return 0;
    
    switch(order.status) {
      case 'PENDING':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  // Render status chip with appropriate color
  const renderStatusChip = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'default' = 'default';
    
    switch(status) {
      case 'DELIVERED':
        color = 'success';
        break;
      case 'PENDING':
      case 'PROCESSING':
      case 'SHIPPED':
        color = 'warning';
        break;
      case 'CANCELLED':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} />;
  };

  if (loading) {
    return (
      <Container sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button 
          component={Link} 
          to="/orders" 
          startIcon={<ArrowBackIcon />}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          component={Link} 
          to="/orders" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Orders
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Order Details
        </Typography>
      </Box>

      {/* Order Header */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="h5" component="div">
            Order #{order.orderNumber}
          </Typography>
          {renderStatusChip(order.status)}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Placed on {order.date}
        </Typography>
      </Paper>

      {/* Order Status Tracker */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Order Status</Typography>
        <Stepper activeStep={getActiveStep()} alternativeLabel>
          {orderSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={4}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Items</Typography>
            
            {order.items.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2} sm={1}>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        style={{ width: '100%', maxWidth: 60, height: 'auto' }} 
                      />
                    )}
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}

            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ mr: 5 }}>Subtotal:</Typography>
                  <Typography variant="body1">
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ mr: 5 }}>Shipping:</Typography>
                  <Typography variant="body1">$0.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ mr: 5 }}>Total:</Typography>
                  <Typography variant="h6">
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Order Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Shipping Address</Typography>
            {order.shippingAddress && (
              <>
                <Typography variant="body2">{order.shippingAddress.street}</Typography>
                <Typography variant="body2">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Typography>
                <Typography variant="body2">{order.shippingAddress.country}</Typography>
              </>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Payment Information</Typography>
            <Typography variant="body2">{order.paymentMethod}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          color="primary"
          sx={{ mx: 1 }}
        >
          Continue Shopping
        </Button>
        <Button 
          component={Link} 
          to="/orders" 
          variant="outlined"
          sx={{ mx: 1 }}
        >
          Back to Orders
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetail;