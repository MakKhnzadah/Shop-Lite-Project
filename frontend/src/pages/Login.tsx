import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../features/api/apiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../app/hooks';
import { LoginRequest } from '../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch (err: any) {
      setError(
        err.data?.message || 'Login failed. Please check your credentials and try again.'
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="auth-form">
            <h2 className="text-center mb-4">Login</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <p>
                Don't have an account?{' '}
                <a href="/register" className="text-decoration-none">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;