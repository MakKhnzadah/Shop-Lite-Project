import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
  styled
} from '@mui/material';
import { luxuryColors } from '../../theme/luxuryTheme';

// Social Media Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';

// Custom styled components
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-3px)',
  },
}));

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FFFFFF',
        color: theme.palette.text.primary,
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Column */}
          <Grid item xs={12} md={4} lg={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700 
              }}
            >
              SHOP LITE
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ mb: 3 }}
            >
              Discover luxury at its finest. We curate premium products to elevate your lifestyle.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <SocialButton aria-label="facebook">
                <FacebookIcon fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="twitter">
                <TwitterIcon fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="instagram">
                <InstagramIcon fontSize="small" />
              </SocialButton>
              <SocialButton aria-label="pinterest">
                <PinterestIcon fontSize="small" />
              </SocialButton>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600 
              }}
            >
              SHOP
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/products">All Products</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/products?category=new">New Arrivals</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/products?category=bestsellers">Bestsellers</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/products?category=sale">Special Offers</FooterLink>
              </ListItem>
            </List>
          </Grid>
          
          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600 
              }}
            >
              SUPPORT
            </Typography>
            <List dense disablePadding>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/help">Help Center</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/shipping">Shipping Info</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/returns">Returns & Exchanges</FooterLink>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </ListItem>
            </List>
          </Grid>
          
          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2,
                fontWeight: 600 
              }}
            >
              NEWSLETTER
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe to receive updates, exclusive offers, and more.
            </Typography>
            <Box 
              component="form" 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
              }}
            >
              <TextField
                placeholder="Your email"
                size="small"
                fullWidth
                sx={{ 
                  mr: { xs: 0, sm: 1 },
                  mb: { xs: 1, sm: 0 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                SUBSCRIBE
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Footer Bottom */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Shop Lite. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;