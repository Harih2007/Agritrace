'use client';

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Leaf, 
  QrCode, 
  Shield, 
  Truck, 
  Users, 
  Database,
  CheckCircle,
  ArrowRight,
  Store
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Database,
      title: 'Avalanche Blockchain',
      description: 'Immutable, high-speed, and secure ledger for all transaction and journey data.'
    },
    {
      icon: QrCode,
      title: 'QR Code Tracking',
      description: 'A simple scan provides a digital passport for every product, from farm to your hands.'
    },
    {
      icon: Shield,
      title: 'Smart Contracts',
      description: 'Automating agreements and payments, ensuring fairness and efficiency for all parties.'
    }
  ];

  const journeySteps = [
    {
      icon: Leaf,
      title: 'Farmer Registration',
      description: 'Farmers register their produce with complete details including origin, certifications, and harvest information.',
      color: 'primary'
    },
    {
      icon: Truck,
      title: 'Distributor Pickup',
      description: 'Distributors collect products from farms, update transport details, and ensure quality during transit.',
      color: 'secondary'
    },
    {
      icon: Store,
      title: 'Retailer Inventory',
      description: 'Retailers receive products, manage inventory, set prices, and make them available to consumers.',
      color: 'primary'
    },
    {
      icon: QrCode,
      title: 'QR Code Tracking',
      description: 'Each stage is recorded with QR codes, creating an immutable trail from farm to consumer.',
      color: 'secondary'
    },
    {
      icon: Users,
      title: 'Consumer Trust',
      description: 'Consumers scan QR codes to verify the complete journey, ensuring authenticity and quality.',
      color: 'primary'
    }
  ];

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 lg:py-32">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" 
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80"></div>
          
          <div className="px-4 lg:px-10 flex flex-1 justify-center relative">
            <div className="layout-content-container flex flex-col items-center text-center gap-8 max-w-7xl flex-1">
              <div className="flex flex-col gap-4 max-w-4xl">
                <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl lg:text-6xl">
                  Connecting Harvest to Home with <span className="text-primary">Blockchain</span> Precision.
                </h1>
                <h2 className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal sm:text-lg lg:text-xl max-w-3xl mx-auto">
                  Leveraging Avalanche for a transparent food supply chain. Track your food's journey, ensure quality, and empower farmers with AgriTrace.
                </h2>
              </div>
              
              <div className="flex flex-col items-center gap-6">
                {/* Role-based Login Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap justify-center">
                  <button 
                    onClick={() => router.push('/login/farmer')}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-green-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="truncate">Farmer Login</span>
                  </button>
                  <button 
                    onClick={() => router.push('/login/distributor')}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-orange-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="truncate">Distributor Login</span>
                  </button>
                  <button 
                    onClick={() => router.push('/login/retailer')}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="truncate">Retailer Login</span>
                  </button>
                </div>
                
                {/* Consumer Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={() => router.push('/scan')}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border-2 border-secondary text-secondary text-base font-bold leading-normal tracking-[0.015em] hover:bg-secondary/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="truncate">Scan Product</span>
                  </button>
                  <button 
                    onClick={() => router.push('/admin')}
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border-2 border-primary text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="truncate">Admin Panel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900 circuit-board-bg">
          <div className="px-4 lg:px-10 flex flex-1 justify-center">
            <div className="layout-content-container flex flex-col gap-12 max-w-7xl flex-1 px-4">
              <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-2xl">
                  Core Technologies
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-3xl">
                  A synergy of agricultural tradition and cutting-edge technology ensures a transparent and efficient supply chain.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-col gap-4 rounded-xl border border-accent-light dark:border-accent-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-6 text-center items-center transform hover:-translate-y-2 transition-transform duration-300">
                    <feature.icon className={`${index === 1 ? 'text-primary' : 'text-secondary'} text-5xl`} size={48} />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="px-4 lg:px-10 flex flex-1 justify-center">
            <div className="layout-content-container flex flex-col gap-12 max-w-7xl flex-1 px-4 items-center">
              <div className="flex flex-col gap-4 text-center">
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-2xl">
                  The Product Journey
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-3xl">
                  Follow the path of your food from the fields to your plate in five simple, transparent steps.
                </p>
              </div>
              
              <div className="w-full max-w-3xl">
                <div className="space-y-8">
                  {journeySteps.map((step, index) => (
                    <div key={index} className="flex gap-6 items-start">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`flex items-center justify-center size-12 rounded-full ${
                          step.color === 'primary' ? 'bg-primary/10 text-primary border-2 border-primary/20' : 'bg-secondary/10 text-secondary border-2 border-secondary/20'
                        }`}>
                          <step.icon size={24} />
                        </div>
                        {index < journeySteps.length - 1 && (
                          <div className="w-px bg-slate-300 dark:bg-slate-700 h-16"></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-slate-900 dark:text-white text-lg font-medium leading-normal">
                          {index + 1}. {step.title}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900">
          <div className="px-4 lg:px-10 flex flex-1 justify-center">
            <div className="layout-content-container grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl flex-1 px-4">
              <div className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-8 aspect-square lg:aspect-auto min-h-[300px]" 
                   style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')"}}>
                <h3 className="text-white text-3xl font-bold leading-tight">Empowering Farmers</h3>
                <p className="text-slate-200 text-lg">Achieve better market access, command fair prices for premium produce, and build a trusted brand directly with consumers.</p>
              </div>
              <div className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-8 aspect-square lg:aspect-auto min-h-[300px]" 
                   style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')"}}>
                <h3 className="text-white text-3xl font-bold leading-tight">Informing Consumers</h3>
                <p className="text-slate-200 text-lg">Make informed choices with verified data on origin and handling. Connect with the source of your food and champion sustainable practices.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="px-4 lg:px-10 flex flex-1 justify-center">
            <div className="layout-content-container flex flex-col lg:flex-row gap-12 items-center max-w-7xl flex-1 px-4">
              <div className="flex-1 flex flex-col gap-4 text-center lg:text-left items-center lg:items-start">
                <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-2xl">
                  Traceability at Your Fingertips
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-lg">
                  Scan the sample QR code with your smartphone to experience the detailed product journey firsthand. See how AgriTrace brings transparency to life.
                </p>
                <button 
                  onClick={() => router.push('/scan')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-slate-50 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors mt-4 gap-2"
                >
                  <span className="truncate">Explore a Demo</span>
                  <ArrowRight size={20} />
                </button>
              </div>
              
              <div className="flex-1 w-full max-w-md lg:max-w-none">
                <div className="relative group rounded-xl p-8 bg-white dark:bg-slate-900 border border-accent-light dark:border-accent-dark shadow-lg dark:shadow-2xl">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center p-4">
                    <QrCode size={200} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                    <div className="text-center text-white p-4">
                      <QrCode size={60} className="text-primary-light mx-auto mb-2" />
                      <p className="font-bold text-xl">Scan Me</p>
                      <p className="text-sm">Unlock the product's story.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}