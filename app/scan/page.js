'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { mockProducts, mockPriceBreakdown } from '../../utils/mockData';
import toast from 'react-hot-toast';
import { 
  QrCode, 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Package, 
  DollarSign,
  CheckCircle,
  Truck,
  Clock,
  Shield,
  Leaf,
  Award
} from 'lucide-react';

export default function ScanPage() {
  const [searchInput, setSearchInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!searchInput.trim()) {
      toast.error('Please enter a product ID or QR code');
      return;
    }

    setIsLoading(true);
    
    // Simulate scanning/API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find product (simulate successful scan)
    const product = mockProducts.find(p => 
      p.id.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.qrCode.toLowerCase().includes(searchInput.toLowerCase())
    ) || mockProducts[0]; // Default to first product for demo
    
    setScannedProduct(product);
    setIsLoading(false);
    toast.success('Product found! Displaying journey details.');
  };

  const getStageIcon = (stage) => {
    switch (stage.toLowerCase()) {
      case 'farm':
        return <Leaf className="text-green-500" size={24} />;
      case 'processing':
        return <Package className="text-blue-500" size={24} />;
      case 'transport':
        return <Truck className="text-orange-500" size={24} />;
      case 'retail':
        return <CheckCircle className="text-purple-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-background-light dark:bg-background-dark">
        <div className="px-4 lg:px-10 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">
                Scan Product
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Enter a product ID or scan a QR code to trace your food's complete journey from farm to table.
              </p>
            </div>

            {/* Scan Interface */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-8 mb-8">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-8 w-full max-w-sm">
                  <QrCode size={120} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                    QR Scanner Placeholder
                  </p>
                </div>
                
                <div className="text-slate-500 dark:text-slate-400 font-medium">OR</div>
                
                <div className="w-full max-w-md">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Enter Product ID (e.g., AGT-001)"
                      className="flex-1 px-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark"
                      onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                    />
                    <button
                      onClick={handleScan}
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Search size={20} />
                      )}
                      {isLoading ? 'Scanning...' : 'Search'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Try: AGT-001 (Tomatoes), AGT-002 (Eggs), AGT-003 (Apples), AGT-004 (Rice), or AGT-005 (Mangoes) for demo
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {scannedProduct && (
              <div className="space-y-6">
                {/* Product Info Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      {/* Product Image */}
                      {scannedProduct.image && (
                        <div className="mb-6 relative overflow-hidden rounded-xl">
                          <img 
                            src={scannedProduct.image}
                            alt={scannedProduct.name}
                            className="w-full h-48 object-cover rounded-xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark text-slide-in-left">
                            {scannedProduct.name}
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 text-fade-in-up" style={{animationDelay: '0.1s'}}>ID: {scannedProduct.id}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                          <Shield size={16} className="icon-shield icon-glow" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <User size={16} />
                          <span>{scannedProduct.farmer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin size={16} />
                          <span>{scannedProduct.farmLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar size={16} />
                          <span>Harvested: {scannedProduct.harvestDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Package size={16} />
                          <span>{scannedProduct.quantity}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {scannedProduct.certifications.map((cert, index) => (
                          <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Award size={12} />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:w-48">
                      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center">
                        <QrCode size={80} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          IPFS: {scannedProduct.ipfsHash.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">Product Journey</h3>
                  
                  <div className="space-y-6">
                    {scannedProduct.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700">
                            {getStageIcon(event.stage)}
                          </div>
                          {index < scannedProduct.timeline.length - 1 && (
                            <div className="w-px bg-slate-300 dark:bg-slate-600 h-12 mt-2"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h4 className="font-semibold text-text-light dark:text-text-dark">
                              {event.stage}
                            </h4>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {formatTimestamp(event.timestamp)}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                            {event.location}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                            Status: {event.status}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Handler: {event.handler}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-6">Price Breakdown</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-accent-light dark:border-accent-dark">
                      <span className="text-slate-600 dark:text-slate-400">Farm Gate Price</span>
                      <span className="font-medium text-text-light dark:text-text-dark">₹{mockPriceBreakdown.farmGate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-accent-light dark:border-accent-dark">
                      <span className="text-slate-600 dark:text-slate-400">Processing</span>
                      <span className="font-medium text-text-light dark:text-text-dark">₹{mockPriceBreakdown.processing}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-accent-light dark:border-accent-dark">
                      <span className="text-slate-600 dark:text-slate-400">Transport</span>
                      <span className="font-medium text-text-light dark:text-text-dark">₹{mockPriceBreakdown.transport}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-accent-light dark:border-accent-dark">
                      <span className="text-slate-600 dark:text-slate-400">Retail Markup</span>
                      <span className="font-medium text-text-light dark:text-text-dark">₹{mockPriceBreakdown.retail}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-slate-50 dark:bg-slate-700 rounded-lg px-4">
                      <span className="font-semibold text-text-light dark:text-text-dark">Total Consumer Price</span>
                      <span className="font-bold text-lg text-primary">₹{mockPriceBreakdown.total}</span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Blockchain Verification</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-1">Blockchain Network</p>
                      <p className="font-medium text-text-light dark:text-text-dark">Avalanche C-Chain</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-1">IPFS Hash</p>
                      <p className="font-mono text-xs text-text-light dark:text-text-dark break-all">
                        {scannedProduct.ipfsHash}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-1">Smart Contract</p>
                      <p className="font-mono text-xs text-text-light dark:text-text-dark">
                        0x742d35Cc6634C0532925a3b8D4C9db...
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-1">Last Updated</p>
                      <p className="font-medium text-text-light dark:text-text-dark">
                        {formatTimestamp(scannedProduct.timeline[scannedProduct.timeline.length - 1]?.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}