"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { mockFarmers } from "../../utils/mockData";
import { getAllProducts, getProductsByFarmer, addProduct } from "../../lib/productStore";
import toast from "react-hot-toast";
import {
  Plus,
  Package,
  QrCode,
  Eye,
  Upload,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
} from "lucide-react";

export default function FarmerDashboard() {
  const farmer = mockFarmers[0]; // Mock current farmer

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const allProducts = getAllProducts();
    const farmerProds = allProducts.filter((p) => p.farmer === farmer.name);
    setProducts(farmerProds);
  }, [farmer.name]);

  // Listen for product updates from other pages
  useEffect(() => {
    const handleProductsUpdated = () => {
      const allProducts = getAllProducts();
      const farmerProds = allProducts.filter((p) => p.farmer === farmer.name);
      setProducts(farmerProds);
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => window.removeEventListener('productsUpdated', handleProductsUpdated);
  }, [farmer.name]);

  const farmerProducts = products;

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    basePrice: "",
    harvestDate: "",
    certifications: [],
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, simulate successful registration
      // In production, this would call the backend API

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock transaction hash (Using a real valid Fuji tx hash for demo)
      const mockTxHash = '0x81e9b2767092100806443c7595c2765360340798363768b577402316e6ade092';

      // Create new product object
      const newProduct = {
        id: `AGT-${String(products.length + 6).padStart(3, '0')}`,
        name: formData.cropName,
        farmer: farmer.name,
        farmLocation: farmer.location,
        quantity: formData.quantity,
        basePrice: formData.basePrice,
        harvestDate: formData.harvestDate,
        status: 'Processing',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop&auto=format',
        ipfsHash: 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        blockchain_hash: mockTxHash,
        qrCode: `${formData.cropName.toUpperCase().replace(/\s+/g, '-')}-2024`,
        certifications: formData.certifications || [],
        currentLocation: farmer.location,
        estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timeline: [
          {
            stage: 'Farm',
            location: farmer.location,
            timestamp: new Date().toISOString(),
            status: 'Registered',
            handler: farmer.name
          }
        ]
      };

      // Add new product to centralized store (persists to localStorage)
      const updatedProducts = addProduct(newProduct);
      const farmerProds = updatedProducts.filter((p) => p.farmer === farmer.name);
      setProducts(farmerProds);

      toast.success("Product registered successfully on blockchain!");
      console.log('Product registered with tx hash:', mockTxHash);

      // Reset form
      setShowRegisterForm(false);
      setFormData({
        cropName: "",
        quantity: "",
        basePrice: "",
        harvestDate: "",
        certifications: [],
        description: "",
      });

    } catch (error) {
      console.error('Error registering product:', error);
      toast.error('Failed to register product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQR = (productId) => {
    const product = farmerProducts.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowQRModal(true);
      toast.success(`QR Code generated for ${productId}`);
    }
  };

  const viewOnChain = (productId) => {
    const product = farmerProducts.find((p) => p.id === productId);
    if (product?.blockchain_hash) {
      // Open Avalanche Fuji testnet explorer
      const explorerUrl = `https://testnet.snowtrace.io/tx/${product.blockchain_hash}`;
      window.open(explorerUrl, "_blank");
      toast.success("Opening blockchain explorer...");
    } else {
      toast.error("Blockchain transaction not found");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "At Retail":
        return <CheckCircle className="text-green-500" size={20} />;
      case "In Transit":
        return <Truck className="text-blue-500" size={20} />;
      case "Processing":
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-white dark:bg-slate-900">
        <div className="px-4 lg:px-10 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with animated background */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 dark:border-green-700/30 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format"
                        alt={farmer.name}
                        className="w-16 h-16 rounded-full border-4 border-green-200 dark:border-green-700 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                        Welcome back, {farmer.name} 🌱
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                        {farmer.farm} • {farmer.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRegisterForm(true)}
                    className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Plus
                      size={20}
                      className="group-hover:rotate-90 transition-transform duration-300"
                    />
                    Register Product
                  </button>
                </div>
              </div>
            </div>

            {/* Animated Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group bg-gradient-to-br from-green-400/10 to-green-600/10 dark:from-green-400/20 dark:to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                      {farmer.totalProducts}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+2 this month</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Package
                      className="text-green-600 dark:text-green-400"
                      size={32}
                    />
                  </div>
                </div>
              </div>
              <div className="group bg-gradient-to-br from-blue-400/10 to-blue-600/10 dark:from-blue-400/20 dark:to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      Active Batches
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      {farmer.activeProducts}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">In progress</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Clock
                      className="text-blue-600 dark:text-blue-400"
                      size={32}
                    />
                  </div>
                </div>
              </div>
              <div className="group bg-gradient-to-br from-purple-400/10 to-purple-600/10 dark:from-purple-400/20 dark:to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                      Certifications
                    </p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      {farmer.certifications.length}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">All verified</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <CheckCircle
                      className="text-purple-600 dark:text-purple-400"
                      size={32}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Products List */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-green-200/30 dark:border-green-700/30 shadow-xl">
              <div className="p-8 border-b border-green-200/30 dark:border-green-700/30">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  My Products 🌾
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Track your harvest journey from farm to table
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {farmerProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-1 animate-fade-in-up hover-lift"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative">
                        {/* Product Image */}
                        <div className="mb-4 relative overflow-hidden rounded-xl">
                          <img
                            src={product.image || `https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop&auto=format`}
                            alt={product.name}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop&auto=format';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-3 right-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200/50 dark:border-slate-600/50">
                            {getStatusIcon(product.status)}
                            <span className="text-sm font-semibold ml-2">
                              {product.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                              {product.name}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md mt-1">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors duration-300">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Package size={16} className="text-green-500" />
                              <span className="font-medium">
                                {product.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-300">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="font-medium">
                                {product.basePrice}
                              </span>
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors duration-300">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Calendar size={16} className="text-purple-500" />
                              <span className="font-medium">
                                {product.harvestDate}
                              </span>
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors duration-300">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin size={16} className="text-orange-500" />
                              <span className="font-medium text-xs">
                                {product.currentLocation}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {product.certifications.map((cert, certIndex) => (
                            <span
                              key={certIndex}
                              className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full font-medium border border-green-200 dark:border-green-700 hover:scale-105 transition-transform duration-200"
                            >
                              ✓ {cert}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => generateQR(product.id)}
                            disabled={isLoading}
                            className="flex-1 group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                          >
                            <QrCode
                              size={16}
                              className="group-hover/btn:rotate-12 transition-transform duration-300"
                            />
                            Generate QR
                          </button>
                          <button
                            onClick={() => viewOnChain(product.id)}
                            className="flex-1 group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                          >
                            <Eye
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform duration-300"
                            />
                            View On-chain
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Register Product Modal */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-green-200/30 dark:border-green-700/30 shadow-2xl animate-scale-in">
              <div className="p-8 border-b border-green-200/30 dark:border-green-700/30">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Register New Product 🌱
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Add your harvest to the blockchain
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 group-hover:border-green-300"
                    placeholder="e.g., Organic Tomatoes"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 500 kg"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 group-hover:border-blue-300"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Base Price
                  </label>
                  <input
                    type="text"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹45/kg"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 group-hover:border-purple-300"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 group-hover:border-orange-300"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm text-slate-800 dark:text-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 group-hover:border-pink-300 resize-none"
                    placeholder="Additional details about the product..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Register Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <div className="mb-4">
                  <QrCode className="w-12 h-12 mx-auto text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  QR Code Generated
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedProduct.name}
                </p>

                {/* QR Code with Blockchain Explorer Link */}
                <div className="bg-white p-6 rounded-xl shadow-inner mb-6 flex justify-center">
                  <QRCodeSVG
                    value={
                      `https://testnet.snowtrace.io/tx/${selectedProduct.blockchain_hash}`
                    }
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Scan to view transaction on Avalanche blockchain (Demo: Hash is mock)
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Product ID:</strong> {selectedProduct.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>QR Code:</strong> {selectedProduct.qrCode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>IPFS Hash:</strong> {selectedProduct.ipfsHash.substring(0, 20)}...
                  </p>
                </div>

                <a
                  href={`https://testnet.snowtrace.io/tx/${selectedProduct.blockchain_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 mb-6"
                >
                  🔗 View Transaction on Avalanche Explorer
                </a>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Download QR code with blockchain link
                      const link = document.createElement('a');
                      link.href = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                        `https://testnet.snowtrace.io/tx/${selectedProduct.blockchain_hash}`
                      )}`;
                      link.download = `QR-${selectedProduct.id}.png`;
                      link.click();
                      toast.success('QR Code downloaded!');
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Download QR
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Close
                  </button>
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
