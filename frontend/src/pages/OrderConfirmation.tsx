import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Divider, Paper, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmation: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={4}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Thank you for your purchase. Your order has been received and is now being processed.
          </Typography>
          <Chip 
            label="Order Confirmation Email Sent" 
            color="primary" 
            variant="outlined" 
            sx={{ mt: 2 }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box mb={4}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            What Happens Next?
          </Typography>
          <Typography variant="body1" paragraph>
            1. You will receive an order confirmation email with details of your purchase.
          </Typography>
          <Typography variant="body1" paragraph>
            2. Once your order has been shipped, you'll receive a shipping confirmation email with tracking information.
          </Typography>
          <Typography variant="body1">
            3. You can track the status of your order in the "My Orders" section of your account.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/account/orders"
            sx={{ flex: { xs: '1 0 100%', sm: '0 1 auto' } }}
          >
            View My Orders
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/products"
            sx={{ flex: { xs: '1 0 100%', sm: '0 1 auto' } }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;