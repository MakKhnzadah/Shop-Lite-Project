import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const { totalItems } = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <Link to="/" className="text-decoration-none">
              <h1 className="m-0">Shop Lite</h1>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            <Link to="/products" className="nav-link">Products</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <span className="nav-link">Hello, {user?.firstName || user?.username}</span>
                <button onClick={handleLogout} className="nav-link btn btn-link">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
            
            <Link to="/cart" className="nav-link position-relative">
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;