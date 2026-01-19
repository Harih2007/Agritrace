'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import toast from 'react-hot-toast';
import { 
  Truck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  MapPin,
  Shield,
  Building
} from 'lucide-react';

export default function DistributorLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    location: '',
    phone: '',
    distributorCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        if (formData.distributorCode !== 'DISTRIBUTOR2025') {
          toast.error('Invalid distributor verification code');
          setIsLoading(false);
          return;
        }

        if (!formData.fullName || !formData.companyName || !formData.location) {
          toast.error('Please fill all required fields');
          setIsLoading(false);
          return;
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Mock login validation
        if (formData.email === 'distributor@agritrace.com' && formData.password === 'distributor123') {
          localStorage.setItem('userRole', 'distributor');
          localStorage.setItem('userEmail', formData.email);
          toast.success('Login successful! Welcome back.');
          router.push('/transporter');
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        // Mock registration
        localStorage.setItem('userRole', 'distributor');
        localStorage.setItem('userEmail', formData.email);
        toast.success('Registration successful! Welcome to AgriTrace.');
        router.push('/transporter');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-background-light dark:bg-background-dark">
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full">
                  <Truck className="text-orange-600 dark:text-orange-400 icon-truck icon-float" size={40} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-text-light dark:text-text-dark text-bounce-in">
                {isLogin ? 'Distributor Login' : 'Distributor Registration'}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-fade-in-up" style={{animationDelay: '0.2s'}}>
                {isLogin ? 'Welcome back to AgriTrace' : 'Join the AgriTrace distribution network'}
              </p>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-accent-light dark:border-accent-dark p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full name"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your company name"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="City, State"
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Distributor Verification Code *
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          name="distributorCode"
                          value={formData.distributorCode}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter verification code"
                          required={!isLogin}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Use code: DISTRIBUTOR2025
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {isLogin && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Demo: distributor@agritrace.com
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {isLogin && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Demo password: distributor123
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-accent-light dark:border-accent-dark rounded-lg bg-white dark:bg-slate-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 hover:text-orange-500 text-sm font-medium text-underline-animate"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-slate-500 hover:text-slate-700 text-sm text-underline-animate"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}