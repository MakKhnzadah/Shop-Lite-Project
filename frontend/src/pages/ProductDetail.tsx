import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/api/apiSlice';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';

// MUI Components
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Button, 
  Card, 
  Divider, 
  Rating,
  Chip,
  TextField,
  Stack,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  Breadcrumbs,
  Link,
  CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;
  const theme = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" mt={2}>Loading product details...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Product not found or error loading product details.
        </Typography>
      </Container>
    );
  }

  const stockAmount = product.stockQuantity ?? product.stock ?? 0;
  // Random rating for demo purposes
  const rating = (3 + Math.random() * 2).toFixed(1);

  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container>
        {/* Breadcrumb */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 4 }}
        >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/products">
            Products
          </Link>
          <Link underline="hover" color="inherit" href={`/products/category/${product.category.id}`}>
            {product.category.name}
          </Link>
          <Typography color="primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                position: 'relative',
                bgcolor: 'white',
                mb: 2
              }}
            >
              {product.imageUrl ? (
                <Box
                  component="img"
                  src={product.imageUrl}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                    maxHeight: 600
                  }}
                />
              ) : (
                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    p: 8,
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography color="text.secondary">No image available</Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Product Header */}
              <Box mb={2}>
                <Chip
                  label={product.category.name}
                  size="small"
                  sx={{ 
                    mb: 1,
                    bgcolor: 'rgba(184, 134, 11, 0.1)',
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                />
                <Typography 
                  variant="h3" 
                  component="h1"
                  fontFamily="'Playfair Display', serif"
                  fontWeight={600}
                  mb={1}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={parseFloat(rating)} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({rating})
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h4" 
                  fontWeight={600}
                  color="primary"
                  fontFamily="'Playfair Display', serif"
                  mb={3}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />
              
              {/* Product Details */}
              <Typography variant="body1" mb={3}>
                {product.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} mr={2}>
                  Availability:
                </Typography>
                {stockAmount > 0 ? (
                  <Chip 
                    label={`In Stock (${stockAmount} available)`}
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    label="Out of Stock"
                    color="error"
                    size="small"
                  />
                )}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Quantity Selector & Add to Cart */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Quantity:
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || stockAmount <= 0}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  
                  <TextField
                    variant="outlined"
                    value={quantity}
                    inputProps={{ 
                      style: { textAlign: 'center' },
                      min: 1,
                      max: stockAmount
                    }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handleQuantityChange(value);
                      }
                    }}
                    sx={{ width: '80px' }}
                    size="small"
                  />
                  
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= stockAmount || stockAmount <= 0}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              
              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={stockAmount <= 0}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {stockAmount > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontWeight: 500
                  }}
                >
                  Add to Wishlist
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        
        {/* Product Tabs */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                px: 4
              }
            }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>
          
          <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={2}>Product Description</Typography>
                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>
              </Box>
            )}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={2}>Product Specifications</Typography>
                <Typography variant="body1" color="text.secondary">
                  Detailed specifications will be added soon.
                </Typography>
              </Box>
            )}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={2}>Customer Reviews</Typography>
                <Typography variant="body1" color="text.secondary">
                  Customer reviews will be added soon.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetail;