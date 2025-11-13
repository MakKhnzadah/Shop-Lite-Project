import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetProductsQuery } from '../features/api/apiSlice';
import ProductCard from '../components/products/ProductCard';

// MUI components
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Link,
  IconButton,
  useTheme,
  styled,
  CircularProgress,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';

// MUI icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(20, 0),
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    '& .overlay': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
}));

const CategoryOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s ease',
}));

const FeatureBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    borderColor: theme.palette.primary.main,
    '& .feature-icon': {
      color: theme.palette.primary.main,
      transform: 'scale(1.1)',
    },
  },
}));

// Categories mock data
const categories = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070' },
  { id: 2, name: 'Clothing', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070' },
  { id: 3, name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068' },
];

const Home: React.FC = () => {
  const theme = useTheme();
  const { data: products, isLoading, error } = useGetProductsQuery();

  // Get featured products (for demonstration, we'll just take the first 6)
  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
              }}
            >
              Elevate Your Lifestyle
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 400, 
                mb: 6,
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Discover premium quality products curated for the modern lifestyle
            </Typography>
            <Button 
              component={RouterLink}
              to="/products" 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                py: 1.5, 
                px: 4,
                borderRadius: 1,
                fontSize: '1.1rem',
              }}
            >
              Shop Collection
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Categories Section */}
      <Box sx={{ py: 8, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ mb: 2 }}
            >
              Shop by Category
            </Typography>
            <Divider sx={{ width: 80, margin: '0 auto', borderWidth: 2, borderColor: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Browse our premium selections across popular categories
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item xs={12} md={4} key={category.id}>
                <CategoryCard>
                  <CardMedia
                    component="img"
                    height="300"
                    image={category.image}
                    alt={category.name}
                  />
                  <CategoryOverlay className="overlay">
                    <Typography 
                      variant="h4" 
                      component="h3" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 600,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {category.name}
                    </Typography>
                  </CategoryOverlay>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography 
                variant="h2" 
                component="h2" 
              >
                Featured Products
              </Typography>
              <Divider sx={{ width: 80, borderWidth: 2, borderColor: theme.palette.primary.main, mt: 2 }} />
            </Box>
            <Button 
              component={RouterLink}
              to="/products"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              View All
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#FFF4F4', border: '1px solid #FFD6D6' }}>
              <Typography color="error">
                Error loading products. Please try again later.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Services Feature Boxes */}
      <Box sx={{ py: 8, bgcolor: '#FAFAFA' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureBox elevation={0}>
                <Box sx={{ mb: 2 }}>
                  <LocalShippingOutlinedIcon className="feature-icon" sx={{ fontSize: 48, transition: 'all 0.3s ease' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On all orders over $50
                </Typography>
              </FeatureBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FeatureBox elevation={0}>
                <Box sx={{ mb: 2 }}>
                  <SupportAgentOutlinedIcon className="feature-icon" sx={{ fontSize: 48, transition: 'all 0.3s ease' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dedicated customer service
                </Typography>
              </FeatureBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FeatureBox elevation={0}>
                <Box sx={{ mb: 2 }}>
                  <CachedOutlinedIcon className="feature-icon" sx={{ fontSize: 48, transition: 'all 0.3s ease' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  30-Day Returns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hassle-free return policy
                </Typography>
              </FeatureBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FeatureBox elevation={0}>
                <Box sx={{ mb: 2 }}>
                  <SecurityOutlinedIcon className="feature-icon" sx={{ fontSize: 48, transition: 'all 0.3s ease' }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  Secure Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% protected checkout
                </Typography>
              </FeatureBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;