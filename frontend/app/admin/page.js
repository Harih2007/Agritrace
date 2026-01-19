'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { mockFarmers } from '../../utils/mockData';
import { getAllProducts, approveProduct, rejectProduct } from '../../lib/productStore';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Calendar,
  MapPin,
  User,
  Package,
  QrCode,
  X,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  BarChart3,
  TrendingUp
} from 'lucide-react';

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [products, setProducts] = useState([]);

  // Load products from localStorage
  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  // Listen for product updates
  useEffect(() => {
    const handleProductsUpdated = () => {
      setProducts(getAllProducts());
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdated);
  }, []);

  // Handle product approval
  const handleApprove = (productId) => {
    approveProduct(productId);
    toast.success('Product approved successfully!');
  };

  // Handle product rejection
  const handleReject = (productId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      rejectProduct(productId, reason);
      toast.success('Product rejected');
    }
  };
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'At Retail':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'In Transit':
        return <Truck className="text-blue-500" size={16} />;
      case 'Processing':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'At Retail':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleExport = () => {
    toast.success('Exporting data to CSV...');
  };

  const stats = {
    totalProducts: products.length,
    activeFarmers: mockFarmers.length,
    inTransit: products.filter(p => p.status === 'In Transit').length,
    completed: products.filter(p => p.status === 'At Retail').length,
    pending: products.filter(p => p.status === 'Processing').length,
    approved: products.filter(p => p.status === 'Approved').length
  };

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-white dark:bg-slate-900">
        <div className="px-4 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-700/30 shadow-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <BarChart3 className="text-white" size={32} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent">
                      Admin Dashboard 🎛️
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Monitor and manage all product batches across the supply chain
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Animated Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group bg-gradient-to-br from-blue-400/10 to-blue-600/10 dark:from-blue-400/20 dark:to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <TrendingUp size={14} className="text-blue-500" />
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">{stats.totalProducts}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across all farms</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Package className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-purple-400/10 to-purple-600/10 dark:from-purple-400/20 dark:to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                      Active Farmers
                    </p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">{stats.activeFarmers}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Registered users</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <User className="text-purple-600 dark:text-purple-400" size={32} />
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-orange-400/10 to-orange-600/10 dark:from-orange-400/20 dark:to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      In Transit
                    </p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">{stats.inTransit}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Moving now</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Truck className="text-orange-600 dark:text-orange-400" size={32} />
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-green-400/10 to-green-600/10 dark:from-green-400/20 dark:to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">{stats.completed}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">At retail</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Filters and Search */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-blue-200/30 dark:border-blue-700/30 shadow-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
                    <input
                      type="text"
                      placeholder="Search products, farmers, or IDs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="Processing">Processing</option>
                    <option value="In Transit">In Transit</option>
                    <option value="At Retail">At Retail</option>
                  </select>
                </div>
                
                <button
                  onClick={handleExport}
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Download size={16} className="group-hover:animate-bounce" />
                  Export Data
                </button>
              </div>
            </div>

            {/* Enhanced Products Table */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-blue-200/30 dark:border-blue-700/30 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-blue-200/30 dark:border-blue-700/30">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Product Batches ({filteredProducts.length}) 📦
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time supply chain monitoring</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600">
                    <tr>
                      <th className="text-left p-6 font-semibold text-slate-700 dark:text-slate-200">Product</th>
                      <th className="text-left p-6 font-semibold text-slate-700 dark:text-slate-200">Farmer</th>
                      <th className="text-left p-6 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                      <th className="text-left p-6 font-semibold text-slate-700 dark:text-slate-200">Harvest Date</th>
                      <th className="text-left p-6 font-semibold text-slate-700 dark:text-slate-200">Location</th>
                      <th className="text-left p-6 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr key={product.id} className="border-b border-blue-200/20 dark:border-blue-700/20 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 transition-all duration-300 group animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="p-6">
                          <div className="flex items-center gap-4 group-hover:transform group-hover:translate-x-1 transition-transform duration-200">
                            <img 
                              src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&h=60&fit=crop&auto=format'}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-600"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&h=60&fit=crop&auto=format';
                              }}
                            />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">{product.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md mt-1 inline-block">{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                            <img 
                              src={`https://images.unsplash.com/photo-${product.farmer.includes('Johnson') ? '1507003211169-0a1dd7228f2d' : 
                                    product.farmer.includes('Smith') ? '1472099645785-5658abf4ff4e' :
                                    product.farmer.includes('Brown') ? '1500648767791-00dcc994a43e' :
                                    '1507003211169-0a1dd7228f2d'}?w=40&h=40&fit=crop&crop=face&auto=format`}
                              alt={product.farmer}
                              className="w-8 h-8 rounded-full border-2 border-purple-200 dark:border-purple-700"
                            />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{product.farmer}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(product.status)}
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(product.status)} border border-current/20 hover:scale-105 transition-transform duration-200`}>
                              {product.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors duration-300">
                            <Calendar size={16} className="text-green-500" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{product.harvestDate}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors duration-300">
                            <MapPin size={16} className="text-orange-500" />
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{product.currentLocation}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(product)}
                              className="group/btn flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            {product.status === 'Processing' && (
                              <>
                                <button
                                  onClick={() => handleApprove(product.id)}
                                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                                  title="Approve Product"
                                >
                                  <CheckCircle size={14} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(product.id)}
                                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                                  title="Reject Product"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </>
                            )}
                            {product.status === 'Approved' && (
                              <span className="text-green-600 text-sm font-semibold">✓ Approved</span>
                            )}
                            {product.status === 'Rejected' && (
                              <span className="text-red-600 text-sm font-semibold">✗ Rejected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-accent-light dark:border-accent-dark flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                  Product Details - {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-accent-light dark:hover:bg-accent-dark rounded-lg transition-colors"
                >
                  <X size={20} className="text-text-light dark:text-text-dark" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600 dark:text-slate-400">Product ID:</span> {selectedProduct.id}</p>
                        <p><span className="text-slate-600 dark:text-slate-400">Name:</span> {selectedProduct.name}</p>
                        <p><span className="text-slate-600 dark:text-slate-400">Quantity:</span> {selectedProduct.quantity}</p>
                        <p><span className="text-slate-600 dark:text-slate-400">Base Price:</span> {selectedProduct.basePrice}</p>
                        <p><span className="text-slate-600 dark:text-slate-400">Harvest Date:</span> {selectedProduct.harvestDate}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Farmer Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-slate-600 dark:text-slate-400">Farmer:</span> {selectedProduct.farmer}</p>
                        <p><span className="text-slate-600 dark:text-slate-400">Farm Location:</span> {selectedProduct.farmLocation}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Current Status</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(selectedProduct.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProduct.status)}`}>
                          {selectedProduct.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Current Location: {selectedProduct.currentLocation}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">QR Code & IPFS</h3>
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                          <QrCode size={60} className="text-slate-400" />
                        </div>
                        <div className="text-sm">
                          <p className="text-slate-600 dark:text-slate-400">IPFS Hash:</p>
                          <p className="font-mono text-xs break-all">{selectedProduct.ipfsHash}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Certifications */}
                <div>
                  <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.certifications.map((cert, index) => (
                      <span key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm px-3 py-1 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Timeline */}
                <div>
                  <h3 className="font-semibold text-text-light dark:text-text-dark mb-4">Supply Chain Timeline</h3>
                  <div className="space-y-4">
                    {selectedProduct.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex-shrink-0">
                          {getStatusIcon(event.stage)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-text-light dark:text-text-dark">{event.stage}</h4>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{event.location}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Status: {event.status} | Handler: {event.handler}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}