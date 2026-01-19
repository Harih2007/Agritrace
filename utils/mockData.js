// Mock data for the AgriTrace application

export const mockProducts = [
  {
    id: 'AGT-001',
    name: 'Organic Tomatoes',
    farmer: 'John Smith',
    farmLocation: 'Green Valley Farm, Maharashtra',
    quantity: '500 kg',
    basePrice: '₹45/kg',
    harvestDate: '2024-01-15',
    status: 'In Transit',
    image: 'https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ipfsHash: 'QmX7Y8Z9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T',
    qrCode: 'AGT001-2024-TOMATO-ORGANIC',
    certifications: ['Organic India', 'Non-GMO'],
    currentLocation: 'Distribution Center, Mumbai',
    estimatedArrival: '2024-01-18',
    timeline: [
      {
        stage: 'Farm',
        location: 'Green Valley Farm, CA',
        timestamp: '2024-01-15 08:00',
        status: 'Harvested',
        handler: 'John Smith'
      },
      {
        stage: 'Processing',
        location: 'Valley Processing Center',
        timestamp: '2024-01-16 14:30',
        status: 'Processed & Packaged',
        handler: 'Valley Processing Co.'
      },
      {
        stage: 'Transport',
        location: 'En route to LA Distribution',
        timestamp: '2024-01-17 09:15',
        status: 'In Transit',
        handler: 'Fresh Transport LLC'
      }
    ]
  },
  {
    id: 'AGT-002',
    name: 'Free-Range Eggs',
    farmer: 'Priya Sharma',
    farmLocation: 'Sunrise Poultry Farm, Punjab',
    quantity: '200 dozen',
    basePrice: '₹85/dozen',
    harvestDate: '2024-01-16',
    status: 'At Retail',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ipfsHash: 'QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W',
    qrCode: 'AGT002-2024-EGGS-FREERANGE',
    certifications: ['Cage-Free', 'Pasture-Raised'],
    currentLocation: 'Fresh Market, Chandigarh',
    estimatedArrival: 'Delivered',
    timeline: [
      {
        stage: 'Farm',
        location: 'Sunrise Poultry Farm, Punjab',
        timestamp: '2024-01-16 06:00',
        status: 'Collected',
        handler: 'Priya Sharma'
      },
      {
        stage: 'Processing',
        location: 'Farm Processing Unit',
        timestamp: '2024-01-16 10:00',
        status: 'Cleaned & Packaged',
        handler: 'Sunrise Poultry Farm'
      },
      {
        stage: 'Transport',
        location: 'Local Distribution',
        timestamp: '2024-01-17 07:00',
        status: 'Delivered',
        handler: 'Local Fresh Delivery'
      },
      {
        stage: 'Retail',
        location: 'Fresh Market, Chandigarh',
        timestamp: '2024-01-17 11:30',
        status: 'Available for Sale',
        handler: 'Fresh Market'
      }
    ]
  },
  {
    id: 'AGT-003',
    name: 'Organic Apples',
    farmer: 'Rajesh Kumar',
    farmLocation: 'Mountain View Orchards, Himachal Pradesh',
    quantity: '1000 kg',
    basePrice: '₹180/kg',
    harvestDate: '2024-01-14',
    status: 'Processing',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ipfsHash: 'QmB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X',
    qrCode: 'AGT003-2024-APPLES-ORGANIC',
    certifications: ['Organic India', 'Rainforest Alliance'],
    currentLocation: 'Himalayan Processing Center',
    estimatedArrival: '2024-01-19',
    timeline: [
      {
        stage: 'Farm',
        location: 'Mountain View Orchards, Himachal Pradesh',
        timestamp: '2024-01-14 07:30',
        status: 'Harvested',
        handler: 'Rajesh Kumar'
      },
      {
        stage: 'Processing',
        location: 'Himalayan Processing Center',
        timestamp: '2024-01-17 13:00',
        status: 'Sorting & Packaging',
        handler: 'Himalayan Fresh Processing'
      }
    ]
  },
  {
    id: 'AGT-004',
    name: 'Basmati Rice',
    farmer: 'Suresh Patel',
    farmLocation: 'Golden Fields Farm, Haryana',
    quantity: '2000 kg',
    basePrice: '₹65/kg',
    harvestDate: '2024-01-12',
    status: 'At Retail',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ipfsHash: 'QmC3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y',
    qrCode: 'AGT004-2024-RICE-BASMATI',
    certifications: ['Organic India', 'Export Quality'],
    currentLocation: 'Metro Mart, Delhi',
    estimatedArrival: 'Delivered',
    timeline: [
      {
        stage: 'Farm',
        location: 'Golden Fields Farm, Haryana',
        timestamp: '2024-01-12 05:30',
        status: 'Harvested',
        handler: 'Suresh Patel'
      },
      {
        stage: 'Processing',
        location: 'Modern Rice Mill, Karnal',
        timestamp: '2024-01-13 09:00',
        status: 'Milled & Packaged',
        handler: 'Modern Rice Mills'
      },
      {
        stage: 'Transport',
        location: 'Highway Transport',
        timestamp: '2024-01-14 14:00',
        status: 'Delivered',
        handler: 'Express Logistics'
      },
      {
        stage: 'Retail',
        location: 'Metro Mart, Delhi',
        timestamp: '2024-01-15 08:00',
        status: 'Available for Sale',
        handler: 'Metro Mart'
      }
    ]
  },
  {
    id: 'AGT-005',
    name: 'Organic Mangoes',
    farmer: 'Lakshmi Devi',
    farmLocation: 'Tropical Grove, Karnataka',
    quantity: '800 kg',
    basePrice: '₹320/kg',
    harvestDate: '2024-01-10',
    status: 'Processing',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ipfsHash: 'QmD4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z',
    qrCode: 'AGT005-2024-MANGO-ORGANIC',
    certifications: ['Organic India', 'Alphonso Variety'],
    currentLocation: 'Fruit Processing Unit, Bangalore',
    estimatedArrival: '2024-01-20',
    timeline: [
      {
        stage: 'Farm',
        location: 'Tropical Grove, Karnataka',
        timestamp: '2024-01-10 06:00',
        status: 'Harvested',
        handler: 'Lakshmi Devi'
      },
      {
        stage: 'Processing',
        location: 'Fruit Processing Unit, Bangalore',
        timestamp: '2024-01-17 11:00',
        status: 'Sorting & Grading',
        handler: 'Karnataka Fruit Processing'
      }
    ]
  }
];

export const mockFarmers = [
  {
    id: 'F001',
    name: 'John Smith',
    email: 'john@greenvalleyfarm.com',
    farm: 'Green Valley Farm',
    location: 'Maharashtra, India',
    certifications: ['Organic India', 'Sustainable Agriculture'],
    totalProducts: 15,
    activeProducts: 3
  },
  {
    id: 'F002',
    name: 'Priya Sharma',
    email: 'priya@sunrisepoultry.com',
    farm: 'Sunrise Poultry Farm',
    location: 'Punjab, India',
    certifications: ['Cage-Free', 'Pasture-Raised'],
    totalProducts: 8,
    activeProducts: 2
  }
];

export const mockPriceBreakdown = {
  farmGate: 45,
  processing: 8,
  transport: 5,
  retail: 12,
  total: 70
};

export const mockNotifications = [
  {
    id: 1,
    type: 'success',
    message: 'Product AGT-001 successfully registered on blockchain',
    timestamp: '2024-01-17 10:30'
  },
  {
    id: 2,
    type: 'info',
    message: 'QR code generated for batch AGT-002',
    timestamp: '2024-01-17 09:15'
  },
  {
    id: 3,
    type: 'warning',
    message: 'Temperature alert for shipment AGT-003',
    timestamp: '2024-01-17 08:45'
  }
];

export const mockTransporterBatches = [
  {
    id: 'AGT-001',
    productName: 'Organic Tomatoes',
    crop: 'Tomatoes',
    farmer: 'John Smith',
    farmLocation: 'Green Valley Farm, Maharashtra',
    quantity: '500 kg',
    basePrice: '₹45/kg',
    currentLocation: 'Distribution Center, Mumbai',
    transportCost: 850,
    status: 'In Transit',
    assignedDate: '2024-01-16',
    estimatedDelivery: '2024-01-18',
    image: 'https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pickupLocation: 'Green Valley Farm, Maharashtra',
    deliveryLocation: 'Fresh Market, Mumbai',
    notes: 'Handle with care - organic produce'
  },
  {
    id: 'AGT-003',
    productName: 'Organic Apples',
    crop: 'Apples',
    farmer: 'Rajesh Kumar',
    farmLocation: 'Mountain View Orchards, Himachal Pradesh',
    quantity: '1000 kg',
    basePrice: '₹180/kg',
    currentLocation: 'Awaiting Pickup',
    transportCost: 0,
    status: 'Awaiting Pickup',
    assignedDate: '2024-01-17',
    estimatedDelivery: '2024-01-20',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pickupLocation: 'Mountain View Orchards, Himachal Pradesh',
    deliveryLocation: 'Metro Mart, Delhi',
    notes: 'Temperature controlled transport required'
  },
  {
    id: 'AGT-004',
    productName: 'Basmati Rice',
    crop: 'Rice',
    farmer: 'Suresh Patel',
    farmLocation: 'Golden Fields Farm, Haryana',
    quantity: '2000 kg',
    basePrice: '₹65/kg',
    currentLocation: 'Delivered',
    transportCost: 1200,
    status: 'Delivered',
    assignedDate: '2024-01-14',
    estimatedDelivery: '2024-01-15',
    deliveredDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pickupLocation: 'Golden Fields Farm, Haryana',
    deliveryLocation: 'Metro Mart, Delhi',
    notes: 'Delivered on time'
  },
  {
    id: 'AGT-005',
    productName: 'Organic Mangoes',
    crop: 'Mangoes',
    farmer: 'Lakshmi Devi',
    farmLocation: 'Tropical Grove, Karnataka',
    quantity: '800 kg',
    basePrice: '₹320/kg',
    currentLocation: 'Processing Center',
    transportCost: 950,
    status: 'In Transit',
    assignedDate: '2024-01-16',
    estimatedDelivery: '2024-01-19',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    pickupLocation: 'Tropical Grove, Karnataka',
    deliveryLocation: 'Premium Fruits, Bangalore',
    notes: 'Premium Alphonso variety - handle carefully'
  }
];