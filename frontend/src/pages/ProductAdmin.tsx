import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import ImageUpload from '../components/common/ImageUpload';
import AdminLayout from '../components/layout/AdminLayout';
import { useGetCategoriesQuery, useGetProductsQuery } from '../features/api/apiSlice';
import { Category, Product } from '../types';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  categoryId: string;
  imageUrl: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

const ProductAdmin: React.FC = () => {
  const { token } = useAppSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
  });
  const { data: categories = [], refetch: refetchCategories } = useGetCategoriesQuery();
  const { data: products = [], refetch: refetchProducts, isLoading: loading } = useGetProductsQuery();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({ name: '', description: '' });
  const [catSaving, setCatSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({
      ...formData,
      imageUrl,
    });
  };

  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryForm((prev: CategoryFormData) => ({ ...prev, [name]: value }));
  };

  const handleCategoryCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('You must be logged in as admin to manage categories');
      return;
    }

    if (!categoryForm.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setCatSaving(true);
      const res = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryForm.name.trim(),
          description: categoryForm.description || null,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create category');
      }

      setSuccess('Category created');
      setCategoryForm({ name: '', description: '' });
      await refetchCategories();
    } catch (err) {
      console.error(err);
      setError('Failed to create category');
    } finally {
      setCatSaving(false);
    }
  };

  const handleCategoryDelete = async (id: number) => {
    if (!token) {
      setError('You must be logged in as admin to manage categories');
      return;
    }

    if (!window.confirm('Delete this category? This may affect products.')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status !== 204) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to delete category');
      }

      setSuccess('Category deleted');
      await refetchCategories();
    } catch (err) {
      console.error(err);
      setError('Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId),
        imageUrl: formData.imageUrl,
      };

      const url = editMode
        ? `http://localhost:8080/api/products/${editId}`
        : 'http://localhost:8080/api/products';
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      // Reset form and refresh products
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        imageUrl: '',
      });
      
      setSuccess(editMode ? 'Product updated successfully' : 'Product created successfully');
      setEditMode(false);
      setEditId(null);
      await refetchProducts();
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.category.id.toString(),
      imageUrl: product.imageUrl || '',
    });
    setEditMode(true);
    setEditId(product.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setSuccess('Product deleted successfully');
      await refetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: '',
      imageUrl: '',
    });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <AdminLayout>
    <Container maxWidth="lg" sx={{ py: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Management
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {editMode ? 'Edit Product' : 'Add New Product'}
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                required
              />
              
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                required
              />
              
              <TextField
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleSelectChange}
                  label="Category"
                >
                  {categories.map((category: Category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Product Image
                </Typography>
                <ImageUpload onUploadSuccess={handleImageUpload} />
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {editMode ? 'Update Product' : 'Add Product'}
                </Button>
                
                {editMode && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleCancel}
                    fullWidth
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </form>
          </Paper>
          <Box sx={{ height: 24 }} />
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Category Management
            </Typography>
            <form onSubmit={handleCategoryCreate}>
              <TextField
                label="Category Name"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryInput}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Description"
                name="description"
                value={categoryForm.description}
                onChange={handleCategoryInput}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" disabled={catSaving}>
                  {catSaving ? 'Saving…' : 'Add Category'}
                </Button>
              </Box>
            </form>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Existing Categories
              </Typography>
              {categories.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No categories yet</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((c: Category) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.id}</TableCell>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleCategoryDelete(c.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Product List
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: Product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>
                            {product.imageUrl ? (
                              <Box
                                component="img"
                                src={product.imageUrl}
                                alt={product.name}
                                sx={{ width: 50, height: 50, objectFit: 'cover' }}
                              />
                            ) : (
                              'No image'
                            )}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stockQuantity}</TableCell>
                          <TableCell>{product.category?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleDelete(product.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </AdminLayout>
  );
};

export default ProductAdmin;
