import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="card product-card">
      {product.imageUrl ? (
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="card-img-top"
        />
      ) : (
        <div 
          className="card-img-top d-flex align-items-center justify-content-center bg-light text-secondary"
          style={{ height: '200px' }}
        >
          No Image Available
        </div>
      )}
      <div className="card-body product-card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text product-price">${product.price.toFixed(2)}</p>
        <p className="card-text text-muted">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>
        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-outline-primary" 
            onClick={handleViewDetails}
          >
            View Details
          </button>
          <button 
            className="btn btn-primary" 
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

export default ProductCard;