import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../features/api/apiSlice';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;
  
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  if (isLoading) {
    return <div className="text-center py-5">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-5 text-danger">
        Product not found or error loading product details.
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid rounded"
            />
          ) : (
            <div className="bg-light text-center py-5 rounded">
              <p className="text-secondary">No image available</p>
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-success fs-4 fw-bold mb-3">${product.price.toFixed(2)}</p>
          
          <div className="mb-4">
            <h5>Description:</h5>
            <p>{product.description}</p>
          </div>
          
          <div className="mb-4">
            <h5>Category:</h5>
            <p>{product.category.name}</p>
          </div>
          
          <div className="mb-4">
            <h5>Availability:</h5>
            {product.stock > 0 ? (
              <p className="text-success">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-danger">Out of Stock</p>
            )}
          </div>
          
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;