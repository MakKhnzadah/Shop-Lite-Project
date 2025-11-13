import React, { useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery } from '../features/api/apiSlice';
import ProductCard from '../components/products/ProductCard';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { setSelectedCategory } from '../features/products/productSlice';
import { Category } from '../types';

const Products: React.FC = () => {
  const { data: products, isLoading: productsLoading, error: productsError } = useGetProductsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { selectedCategory } = useAppSelector((state: RootState) => state.products);
  const dispatch = useAppDispatch();

  const handleCategoryChange = (category: Category | null) => {
    dispatch(setSelectedCategory(category));
  };

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products?.filter((product) => product.category.id === selectedCategory.id)
    : products;

  if (productsLoading || categoriesLoading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (productsError) {
    return <div className="text-center py-5 text-danger">Error loading products. Please try again later.</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Products</h1>
      
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex flex-wrap align-items-center">
            <span className="me-3">Filter by category:</span>
            <button
              className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-outline-primary'} me-2 mb-2`}
              onClick={() => handleCategoryChange(null)}
            >
              All
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                className={`btn btn-sm ${
                  selectedCategory?.id === category.id ? 'btn-primary' : 'btn-outline-primary'
                } me-2 mb-2`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p>No products found in this category. Please try another category.</p>
        </div>
      )}
    </div>
  );
};

export default Products;