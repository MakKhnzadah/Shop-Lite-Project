import React from 'react';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Box, 
  Button,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  // Placeholder data until API works correctly
  const placeholderOrders = [
    { id: 1, orderNumber: "ORD-2025-001", date: '2025-10-01', status: 'DELIVERED', totalAmount: 129.99 },
    { id: 2, orderNumber: "ORD-2025-002", date: '2025-09-15', status: 'PENDING', totalAmount: 79.50 }
  ];

  // Calculate order stats
  const pendingCount = placeholderOrders.filter(order => order.status === 'PENDING').length;
  const deliveredCount = placeholderOrders.filter(order => order.status === 'DELIVERED').length;

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {user?.firstName || user?.username || 'User'}
            </Typography>
            <Typography variant="body1">
              Here you can manage your account and track your orders.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Order Status
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f9f9f9', height: '100%' }}>
            <Typography variant="subtitle1" color="textSecondary">Pending Orders</Typography>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
              {pendingCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f9f9f9', height: '100%' }}>
            <Typography variant="subtitle1" color="textSecondary">Delivered Orders</Typography>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
              {deliveredCount}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f9f9f9', height: '100%' }}>
            <Typography variant="subtitle1" color="textSecondary">Total Orders</Typography>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 'bold' }}>
              {placeholderOrders.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Recent Orders
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {placeholderOrders && placeholderOrders.length > 0 ? (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Order Number</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {placeholderOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px' }}>{order.orderNumber}</td>
                    <td style={{ padding: '16px' }}>{order.date}</td>
                    <td style={{ padding: '16px' }}>
                      <Chip
                        label={order.status}
                        color={order.status === 'DELIVERED' ? 'success' : 'warning'}
                        size="small"
                      />
                    </td>
                    <td style={{ padding: '16px' }}>${order.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>
                      <Button
                        component={Link}
                        to={`/orders/${order.id}`}
                        variant="outlined"
                        size="small"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography>No orders found.</Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          component={Link}
          to="/orders"
          variant="contained"
          color="primary"
        >
          View All Orders
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;