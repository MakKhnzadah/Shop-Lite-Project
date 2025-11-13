import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import {
  Typography,
  Container,
  Paper,
  Box,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Order type definition
interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  totalAmount: number;
  items?: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const Orders: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  
  // Placeholder data until API works correctly
  const placeholderOrders: Order[] = [
    { 
      id: 1, 
      orderNumber: "ORD-2025-001", 
      date: '2025-10-01', 
      status: 'DELIVERED', 
      totalAmount: 129.99,
      items: [
        { id: 101, name: "Premium Headphones", quantity: 1, price: 99.99 },
        { id: 102, name: "USB-C Cable", quantity: 2, price: 15.00 }
      ]
    },
    { 
      id: 2, 
      orderNumber: "ORD-2025-002", 
      date: '2025-09-15', 
      status: 'PENDING', 
      totalAmount: 79.50,
      items: [
        { id: 201, name: "Wireless Mouse", quantity: 1, price: 49.50 },
        { id: 202, name: "Mouse Pad", quantity: 1, price: 30.00 }
      ]
    },
    { 
      id: 3, 
      orderNumber: "ORD-2025-003", 
      date: '2025-08-22', 
      status: 'CANCELLED', 
      totalAmount: 199.99,
      items: [
        { id: 301, name: "Smart Watch", quantity: 1, price: 199.99 }
      ]
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Get filtered orders based on current tab
  const getFilteredOrders = () => {
    if (tabValue === 0) return placeholderOrders;
    if (tabValue === 1) return placeholderOrders.filter(order => order.status === 'PENDING');
    if (tabValue === 2) return placeholderOrders.filter(order => order.status === 'DELIVERED');
    if (tabValue === 3) return placeholderOrders.filter(order => order.status === 'CANCELLED');
    return placeholderOrders;
  };

  const filteredOrders = getFilteredOrders();

  // Render status chip with appropriate color
  const renderStatusChip = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'default' = 'default';
    
    switch(status) {
      case 'DELIVERED':
        color = 'success';
        break;
      case 'PENDING':
        color = 'warning';
        break;
      case 'CANCELLED':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        My Orders
      </Typography>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : undefined}
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Tab label="All Orders" />
          <Tab label="Pending" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {renderOrdersList()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderOrdersList()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderOrdersList()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderOrdersList()}
        </TabPanel>
      </Paper>
    </Container>
  );

  function renderOrdersList() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    if (filteredOrders.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No orders found.
          </Typography>
          <Button 
            component={Link} 
            to="/" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {filteredOrders.map((order, index) => (
          <React.Fragment key={order.id}>
            {index > 0 && <Divider sx={{ my: 3 }} />}
            <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        Order #{order.orderNumber}
                      </Typography>
                      {renderStatusChip(order.status)}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {order.date}
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        Total: ${order.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Items:
                    </Typography>
                    
                    {order.items && order.items.map(item => (
                      <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {item.name} x{item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        component={Link}
                        to={`/orders/${order.id}`}
                        variant="outlined"
                        size="small"
                      >
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
      </Box>
    );
  }
};

export default Orders;