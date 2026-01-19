'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { mockTransporterBatches } from '../../utils/mockData';
import toast from 'react-hot-toast';
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Edit3,
  Save,
  X,
  Eye,
  Navigation
} from 'lucide-react';

export default function TransporterDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    currentLocation: '',
    transportCost: '',
    notes: '',
    status: ''
  });

  // Fetch batches on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transporter/batches');
      const result = await response.json();
      
      if (result.success) {
        setBatches(result.data);
      } else {
        toast.error('Failed to load batches');
        // Fallback to mock data
        setBatches(mockTransporterBatches);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast.error('Failed to load batches');
      // Fallback to mock data
      setBatches(mockTransporterBatches);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="icon-check icon-pulse-gentle" size={20} />;
      case 'In Transit':
        return <Truck className="icon-truck icon-float" size={20} />;
      case 'Awaiting Pickup':
        return <Clock className="icon-clock icon-rotate-slow" size={20} />;
      default:
        return <AlertCircle className="icon-hover-lift" style={{color: '#6b7280'}} size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'In Transit':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Awaiting Pickup':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const handleUpdateBatch = (batch) => {
    setSelectedBatch(batch);
    setUpdateForm({
      currentLocation: batch.currentLocation,
      transportCost: batch.transportCost.toString(),
      notes: batch.notes || '',
      status: batch.status
    });
    setIsUpdateModalOpen(true);
  };

  const handleSubmitUpdate = async () => {
    if (!updateForm.currentLocation.trim()) {
      toast.error('Please enter current location');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/transporter/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId: selectedBatch.id,
          location: updateForm.currentLocation,
          transportCost: updateForm.transportCost,
          note: updateForm.notes,
          status: updateForm.status
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        const updatedBatches = batches.map(batch => 
          batch.id === selectedBatch.id 
            ? {
                ...batch,
                currentLocation: updateForm.currentLocation,
                transportCost: parseFloat(updateForm.transportCost) || 0,
                notes: updateForm.notes,
                status: updateForm.status,
                lastUpdated: new Date().toISOString()
              }
            : batch
        );

        setBatches(updatedBatches);
        setIsUpdateModalOpen(false);
        toast.success('Transport details updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update transport details');
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      toast.error('Failed to update transport details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    totalBatches: batches.length,
    inTransit: batches.filter(b => b.status === 'In Transit').length,
    delivered: batches.filter(b => b.status === 'Delivered').length,
    awaitingPickup: batches.filter(b => b.status === 'Awaiting Pickup').length,
    totalEarnings: batches.reduce((sum, b) => sum + b.transportCost, 0)
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
                Transporter Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-fade-in-up" style={{animationDelay: '0.2s'}}>
                Manage your assigned batches and update transport details
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 icon-group">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <Package className="icon-package icon-float mx-auto mb-3" size={32} />
                <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">{stats.totalBatches}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Batches</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <Clock className="icon-clock icon-pulse-gentle mx-auto mb-3" size={32} />
                <h3 className="text-2xl font-bold text-yellow-600">{stats.awaitingPickup}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Awaiting Pickup</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <Truck className="icon-truck icon-float mx-auto mb-3" size={32} />
                <h3 className="text-2xl font-bold text-blue-600">{stats.inTransit}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">In Transit</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <CheckCircle className="icon-check icon-pulse-gentle mx-auto mb-3" size={32} />
                <h3 className="text-2xl font-bold text-green-600">{stats.delivered}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Delivered</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-6 text-center icon-item">
                <DollarSign className="icon-hover-lift mx-auto mb-3" style={{color: '#10b981'}} size={32} />
                <h3 className="text-2xl font-bold text-primary">₹{stats.totalEarnings}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Earnings</p>
              </div>
            </div>

            {/* Batches List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark">
              <div className="p-6 border-b border-accent-light dark:border-accent-dark">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark text-flip-in">
                  Assigned Batches
                </h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading batches...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Product</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Batch ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Quantity</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Current Location</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Transport Cost</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((batch, index) => (
                      <tr key={batch.id} className="border-b border-accent-light dark:border-accent-dark hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={batch.image}
                              alt={batch.productName}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-slate-200 dark:border-slate-600"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=60&h=60&fit=crop&auto=format';
                              }}
                            />
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">{batch.productName}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{batch.farmer}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {batch.id}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="icon-package icon-hover-lift" />
                            <span className="font-medium">{batch.quantity}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="icon-hover-lift" style={{color: '#ef4444'}} />
                            <span className="text-sm">{batch.currentLocation}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={16} className="icon-hover-lift" style={{color: '#10b981'}} />
                            <span className="font-medium">₹{batch.transportCost}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(batch.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(batch.status)}`}>
                              {batch.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateBatch(batch)}
                              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                            >
                              <Edit3 size={14} className="icon-hover-lift" />
                              Update
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

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-accent-light dark:border-accent-dark flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
                Update Transport Details - {selectedBatch?.id}
              </h2>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 hover:bg-accent-light dark:hover:bg-accent-dark rounded-lg transition-colors"
              >
                <X size={20} className="text-text-light dark:text-text-dark icon-hover-lift" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <img 
                  src={selectedBatch?.image}
                  alt={selectedBatch?.productName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-text-light dark:text-text-dark">{selectedBatch?.productName}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedBatch?.quantity}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">From: {selectedBatch?.farmer}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={updateForm.currentLocation}
                      onChange={(e) => setUpdateForm({...updateForm, currentLocation: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark"
                      placeholder="Enter current location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Transport Cost (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={updateForm.transportCost}
                      onChange={(e) => setUpdateForm({...updateForm, transportCost: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark"
                      placeholder="Enter transport cost"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                    className="w-full px-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark"
                  >
                    <option value="Awaiting Pickup">Awaiting Pickup</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark"
                    placeholder="Add any notes about the transport..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitUpdate}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {isSubmitting ? 'Updating...' : 'Submit Update'}
                </button>
                <button
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-6 py-3 border border-accent-light dark:border-accent-dark rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}