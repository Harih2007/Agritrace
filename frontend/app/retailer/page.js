'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { mockProducts } from '../../utils/mockData';
import toast from 'react-hot-toast';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Users,
  Calendar,
  MapPin,
  Eye,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  BarChart3,
  ShoppingCart
} from 'lucide-react';

export default function RetailerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading retailer products
    setTimeout(() => {
      const retailerProducts = mockProducts.map(product => ({
        ...product,
        retailPrice: parseFloat(product.basePrice.replace('₹', '').replace('/kg', '').replace('/dozen', '')) * 1.4,
        stockQuantity: Math.floor(Math.random() * 100) + 20,
        soldQuantity: Math.floor(Math.random() * 50),
        profit: Math.floor(Math.random() * 1000) + 500
      }));
      setProducts(retailerProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'At Retail':
        return <Store className="icon-hover-lift" style={{color: '#10b981'}} size={20} />;
      case 'In Transit':
        return <Truck className="icon-truck icon-float" size={20} />;
      case 'Processing':
        return <Clock className="icon-clock icon-rotate-slow" size={20} />;
      default:
        return <AlertCircle className="icon-hover-lift" style={{color: '#6b7280'}} size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'At Retail':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'In Transit':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Processing':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.stockQuantity > 10).length,
    lowStock: products.filter(p => p.stockQuantity <= 10).length,
    totalRevenue: products.reduce((sum, p) => sum + (p.soldQuantity * p.retailPrice), 0),
    totalProfit: products.reduce((sum, p) => sum + p.profit, 0)
  };

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-background-light dark:bg-background-dark">
        <div className="px-4 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2 text-bounce-in">
                Retailer Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-fade-in-up" style={{animationDelay: '0.2s'}}>
                Manage your store inventory and track sales performance
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 icon-group">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <Package className="icon-package icon-float mx-auto mb-3" size={32} />
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalProducts}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Products</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <CheckCircle className="icon-check icon-pulse-gentle mx-auto mb-3" size={32} />
                <h3 className="text-2xl font-bold text-green-600">{stats.inStock}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">In Stock</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <AlertCircle className="icon-hover-lift mx-auto mb-3" style={{color: '#f59e0b'}} size={32} />
                <h3 className="text-2xl font-bold text-yellow-600">{stats.lowStock}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Low Stock</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <TrendingUp className="icon-hover-lift mx-auto mb-3" style={{color: '#3b82f6'}} size={32} />
                <h3 className="text-2xl font-bold text-blue-600">₹{stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Revenue</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <TrendingUp className="icon-hover-lift mx-auto mb-3" style={{color: '#10b981'}} size={32} />
                <h3 className="text-2xl font-bold text-primary">₹{stats.totalProfit.toLocaleString()}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Profit</p>
              </div>
            </div>

            {/* Products Inventory */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark">
              <div className="p-6 border-b border-accent-light dark:border-accent-dark">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark text-flip-in">
                  Store Inventory
                </h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading inventory...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Product</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Product ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Cost Price</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Retail Price</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Stock</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Sold</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id} className="border-b border-accent-light dark:border-accent-dark hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&h=60&fit=crop&auto=format'}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-600"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&h=60&fit=crop&auto=format';
                                }}
                              />
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{product.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{product.farmer}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {product.id}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{product.basePrice}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-600">₹{product.retailPrice}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Package size={16} className={`icon-hover-lift ${product.stockQuantity <= 10 ? 'text-red-500' : 'text-green-500'}`} />
                              <span className={`font-medium ${product.stockQuantity <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                                {product.stockQuantity}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <ShoppingCart size={16} className="icon-hover-lift" style={{color: '#3b82f6'}} />
                              <span className="font-medium text-blue-600">{product.soldQuantity}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(product.status)}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                                {product.status}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                              >
                                <Eye size={14} className="icon-hover-lift" />
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent-light dark:border-accent-dark flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Product Details - {selectedProduct.name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-accent-light dark:hover:bg-accent-dark rounded-lg transition-colors"
              >
                <Eye size={20} className="text-text-light dark:text-text-dark icon-hover-lift" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div className="flex items-center gap-6">
                <img 
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-600"
                />
                <div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{selectedProduct.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">From: {selectedProduct.farmer}</p>
                  <p className="text-slate-600 dark:text-slate-400">Location: {selectedProduct.farmLocation}</p>
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Cost Price</h4>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedProduct.basePrice}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Retail Price</h4>
                  <p className="text-lg font-bold text-green-600">₹{selectedProduct.retailPrice}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Stock Quantity</h4>
                  <p className={`text-lg font-bold ${selectedProduct.stockQuantity <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedProduct.stockQuantity} units
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Units Sold</h4>
                  <p className="text-lg font-bold text-blue-600">{selectedProduct.soldQuantity} units</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Harvest Date</h4>
                  <p className="text-slate-600 dark:text-slate-400">{selectedProduct.harvestDate}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.certifications?.map((cert, index) => (
                      <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}