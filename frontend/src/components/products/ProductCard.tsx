import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';
import { Product } from '../../types';

// MUI Components
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  useTheme,
  styled
} from '@mui/material';

// MUI Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  border: '1px solid #f0f0f0',
  background: 'linear-gradient(to bottom right, #ffffff, #fafafa)',
  '&:hover': {
    boxShadow: '0 16px 30px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-8px)',
    borderColor: theme.palette.primary.light,
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
    '& .product-actions': {
      opacity: 1,
    },
    '&::after': {
      opacity: 1,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '80px',
    height: '80px',
    background: `linear-gradient(135deg, transparent 50%, ${theme.palette.primary.light} 50%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  }
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 300,
  backgroundSize: 'cover',
  transition: 'transform 0.6s ease',
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderColor: theme.palette.primary.dark,
  },
}));

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Calculate random rating for demo purposes
  const rating = (3 + Math.random() * 2).toFixed(1);
  const isNew = Math.random() > 0.7; // 30% chance to be "New"
  const stockAmount = product.stockQuantity ?? product.stock ?? 0;
  const isLowStock = stockAmount < 10;

  return (
    <StyledCard>
      {/* Product Quick Actions */}
      <ProductActions className="product-actions">
        <Tooltip title="Quick view" arrow placement="left">
          <ActionButton size="small" onClick={handleViewDetails}>
            <VisibilityIcon fontSize="small" />
          </ActionButton>
        </Tooltip>
        <Tooltip title={isFavorite ? "Remove from wishlist" : "Add to wishlist"} arrow placement="left">
          <ActionButton size="small" onClick={toggleFavorite}>
            {isFavorite ? 
              <FavoriteIcon fontSize="small" color="error" /> : 
              <FavoriteBorderIcon fontSize="small" />
            }
          </ActionButton>
        </Tooltip>
      </ProductActions>
      
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <ProductImage
          image={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
          title={product.name}
          onClick={handleViewDetails}
          sx={{ cursor: 'pointer' }}
        />
        
        {/* Product tags */}
        <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
          {isNew && (
            <Chip 
              label="NEW" 
              size="small" 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                color: 'white',
                fontWeight: 600,
                mb: 1
              }} 
            />
          )}
          {isLowStock && (
            <Box sx={{ display: 'block' }}>
              <Chip 
                label="LOW STOCK" 
                size="small" 
                sx={{ 
                  bgcolor: theme.palette.error.main, 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {product.category?.name || 'Uncategorized'}
        </Typography>
        
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            mb: 1,
            fontWeight: 600,
            height: 56,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          onClick={handleViewDetails}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={parseFloat(rating)} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({rating})
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mb: 2,
            height: 60,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>
      </CardContent>
      
      {/* Product Actions */}
      <CardActions sx={{ justifyContent: 'space-between', padding: 2, pt: 0, alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontFamily: '"Playfair Display", serif'
          }}
        >
          ${product.price.toFixed(2)}
        </Typography>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={stockAmount <= 0}
          sx={{
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '4px',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          {stockAmount > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default ProductCard;