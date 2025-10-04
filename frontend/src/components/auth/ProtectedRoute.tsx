import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

export default ProtectedRoute;