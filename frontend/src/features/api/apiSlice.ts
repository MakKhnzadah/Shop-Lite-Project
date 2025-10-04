import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, LoginRequest, RegisterRequest, Product, Category, Order } from '../../types';
import { RootState } from '../../app/store';

// Base API configuration
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as RootState).auth.token;
      
      // If token exists, add authorization header
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'User', 'Order'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Product endpoints
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProductsByCategory: builder.query<Product[], number>({
      query: (categoryId) => `/products/category/${categoryId}`,
      providesTags: ['Product'],
    }),
    
    // Category endpoints
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    
    // Order endpoints
    getUserOrders: builder.query<Order[], void>({
      query: () => '/orders/user',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<Order, any>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
} = apiSlice;