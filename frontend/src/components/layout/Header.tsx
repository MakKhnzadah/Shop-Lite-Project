import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';

// MUI Components
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  InputBase,
  alpha,
} from '@mui/material';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const { totalItems } = useAppSelector((state: RootState) => state.cart || { totalItems: 0 });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && 
        ((event as React.KeyboardEvent).key === 'Tab' || 
         (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        color: theme.palette.text.primary,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '80px' }}>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: '1.8rem',
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SHOP LITE
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            {/* Mobile drawer navigation */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 300, pt: 2 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700 
                    }}
                  >
                    SHOP LITE
                  </Typography>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider />
                <List>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                      <ListItemText primary="Home" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/products">
                      <ListItemText primary="Shop" />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider />
                <List>
                  {isAuthenticated ? (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={Link} to="/dashboard">
                          <ListItemText primary="Dashboard" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                          <ListItemText primary="Logout" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  ) : (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={Link} to="/login">
                          <ListItemText primary="Login" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={Link} to="/register">
                          <ListItemText primary="Register" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Logo for mobile */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: 'inherit',
              textDecoration: 'none',
              justifyContent: 'center',
            }}
          >
            SHOP LITE
          </Typography>

          {/* Navigation items for desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/"
              sx={{ 
                my: 2, 
                mx: 1,
                color: 'inherit', 
                display: 'block',
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              HOME
            </Button>
            <Button
              component={Link}
              to="/products"
              sx={{ 
                my: 2, 
                mx: 1,
                color: 'inherit', 
                display: 'block',
                fontWeight: 500,
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              SHOP
            </Button>
          </Box>

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Search icon */}
            <Tooltip title="Search">
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Favorites icon */}
            <Tooltip title="Favorites">
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <FavoriteBorderIcon />
              </IconButton>
            </Tooltip>
            
            {/* Cart icon with badge */}
            <Tooltip title="Shopping Cart">
              <IconButton component={Link} to="/cart" color="inherit" sx={{ ml: 1 }}>
                <Badge badgeContent={totalItems} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User account section */}
            <Box sx={{ ml: 1 }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Account">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                      {user?.profileImage ? (
                        <Avatar 
                          alt={user?.firstName || "User"} 
                          src={user?.profileImage} 
                          sx={{ 
                            width: 36, 
                            height: 36,
                            border: `2px solid ${theme.palette.primary.main}` 
                          }} 
                        />
                      ) : (
                        <AccountCircleIcon sx={{ fontSize: 28 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem 
                      component={Link} 
                      to="/dashboard"
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem 
                      component={Link} 
                      to="/profile"
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem 
                      component={Link} 
                      to="/orders"
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">Orders</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="inherit"
                  sx={{ 
                    ml: 1,
                    borderWidth: 2,
                    borderRadius: 1,
                    px: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;