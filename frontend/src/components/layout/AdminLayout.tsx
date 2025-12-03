import React from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const current = location.pathname.startsWith('/admin/products') ? 'products' : 'dashboard';

  const handleChange = (_: React.SyntheticEvent, value: string) => {
    navigate(value === 'products' ? '/admin/products' : '/admin');
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={current} onChange={handleChange} aria-label="Admin navigation">
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Products" value="products" />
        </Tabs>
        </Box>
      <Box>
        {children ?? <Outlet />}
      </Box>
    </Container>
  );
};

export default AdminLayout;
