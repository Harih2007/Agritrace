/**
 * Centralized Product Store with localStorage persistence
 * All pages read from and write to this store
 */

import { mockProducts } from '../utils/mockData';

const STORAGE_KEY = 'agrichain_products';

// Initialize products from localStorage or use mock data
export const initializeProducts = () => {
  if (typeof window === 'undefined') return mockProducts;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored products:', e);
      return mockProducts;
    }
  }
  
  // First time - save mock data to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
  return mockProducts;
};

// Get all products
export const getAllProducts = () => {
  return initializeProducts();
};

// Get products by farmer
export const getProductsByFarmer = (farmerName) => {
  const products = getAllProducts();
  return products.filter(p => p.farmer === farmerName);
};

// Get products by status
export const getProductsByStatus = (status) => {
  const products = getAllProducts();
  return products.filter(p => p.status === status);
};

// Get product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  return products.find(p => p.id === id);
};

// Add new product
export const addProduct = (product) => {
  const products = getAllProducts();
  const newProducts = [product, ...products];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products: newProducts } 
    }));
  }
  
  return newProducts;
};

// Update product
export const updateProduct = (id, updates) => {
  const products = getAllProducts();
  const updatedProducts = products.map(p => 
    p.id === id ? { ...p, ...updates } : p
  );
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products: updatedProducts } 
    }));
  }
  
  return updatedProducts;
};

// Delete product
export const deleteProduct = (id) => {
  const products = getAllProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products: filteredProducts } 
    }));
  }
  
  return filteredProducts;
};

// Approve product (admin function)
export const approveProduct = (id) => {
  return updateProduct(id, { 
    status: 'Approved',
    approvedAt: new Date().toISOString(),
    approvedBy: 'Admin'
  });
};

// Reject product (admin function)
export const rejectProduct = (id, reason) => {
  return updateProduct(id, { 
    status: 'Rejected',
    rejectedAt: new Date().toISOString(),
    rejectedBy: 'Admin',
    rejectionReason: reason
  });
};

// Clear all products (reset to mock data)
export const resetProducts = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
    
    window.dispatchEvent(new CustomEvent('productsUpdated', { 
      detail: { products: mockProducts } 
    }));
  }
  
  return mockProducts;
};

// Hook for React components
export const useProducts = () => {
  if (typeof window === 'undefined') return mockProducts;
  
  const [products, setProducts] = React.useState(initializeProducts);
  
  React.useEffect(() => {
    const handleUpdate = (event) => {
      setProducts(event.detail.products);
    };
    
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);
  
  return products;
};
