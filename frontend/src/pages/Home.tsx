import React from 'react';
import { useGetProductsQuery } from '../features/api/apiSlice';
import ProductCard from '../components/products/ProductCard';

const Home: React.FC = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) {
    return <div className="text-center py-5">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error loading products. Please try again later.</div>;
  }

  // Get featured products (for demonstration, we'll just take the first 4)
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div>
      <section className="hero-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4">Welcome to Shop Lite</h1>
              <p className="lead">Your one-stop destination for quality products at affordable prices.</p>
              <a href="/products" className="btn btn-primary btn-lg">Shop Now</a>
            </div>
            <div className="col-md-6">
              <img 
                src="https://via.placeholder.com/600x400" 
                alt="Shop Lite Banner" 
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products py-5">
        <div className="container">
          <h2 className="text-center mb-4">Featured Products</h2>
          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center">No featured products available.</p>
          )}
          <div className="text-center mt-4">
            <a href="/products" className="btn btn-outline-primary">View All Products</a>
          </div>
        </div>
      </section>

      <section className="categories-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Shop By Category</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3>Electronics</h3>
                  <p>Latest gadgets and devices</p>
                  <a href="/products" className="btn btn-outline-primary">Shop Now</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3>Clothing</h3>
                  <p>Fashion for everyone</p>
                  <a href="/products" className="btn btn-outline-primary">Shop Now</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3>Home & Garden</h3>
                  <p>Decorate your space</p>
                  <a href="/products" className="btn btn-outline-primary">Shop Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;