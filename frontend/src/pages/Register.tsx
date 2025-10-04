import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../features/api/apiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../app/hooks';
import { RegisterRequest } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

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
      const result = await register(formData).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch (err: any) {
      setError(
        err.data?.message || 'Registration failed. Please try again with different credentials.'
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="auth-form">
            <h2 className="text-center mb-4">Register</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username *
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
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password *
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
                <small className="text-muted">
                  Password must be at least 8 characters long with letters and numbers.
                </small>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-decoration-none">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;