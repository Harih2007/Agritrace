# Database Schema for AgriTrace with Transporter Role

## Users Table (Supabase Auth Extended)

```sql
-- Add role field to auth.users metadata or create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'transporter', 'consumer', 'admin')),
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Batches Table (Enhanced for Transporter)

```sql
CREATE TABLE public.batches (
  id TEXT PRIMARY KEY, -- e.g., 'AGT-001'
  product_name TEXT NOT NULL,
  farmer_id UUID REFERENCES public.profiles(id),
  quantity TEXT NOT NULL,
  base_price DECIMAL(10,2),
  harvest_date DATE,
  farm_location TEXT,
  image_url TEXT,
  ipfs_hash TEXT,
  qr_code TEXT,
  certifications TEXT[], -- Array of certifications
  
  -- Transport fields
  assigned_transporter_id UUID REFERENCES public.profiles(id),
  current_location TEXT DEFAULT 'Farm',
  transport_cost DECIMAL(10,2) DEFAULT 0,
  pickup_location TEXT,
  delivery_location TEXT,
  estimated_delivery DATE,
  transport_notes TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'Awaiting Pickup' CHECK (status IN ('Awaiting Pickup', 'In Transit', 'Delivered', 'Processing')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Transport Updates Table (Audit Trail)

```sql
CREATE TABLE public.transport_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id TEXT REFERENCES public.batches(id),
  transporter_id UUID REFERENCES public.profiles(id),
  location TEXT NOT NULL,
  transport_cost DECIMAL(10,2),
  notes TEXT,
  status TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with role
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Farmer APIs
- `GET /api/farmer/batches` - Get farmer's batches
- `POST /api/farmer/create-batch` - Create new batch
- `PUT /api/farmer/batch/:id` - Update batch details

### Transporter APIs
- `GET /api/transporter/batches` - Get assigned batches
- `POST /api/transporter/update` - Update transport details
- `GET /api/transporter/history` - Get transport history

### Consumer APIs
- `GET /api/scan/:batchId` - Get batch details for QR scan
- `GET /api/batches/:id/timeline` - Get complete batch timeline

### Admin APIs
- `GET /api/admin/batches` - Get all batches
- `POST /api/admin/assign-transporter` - Assign transporter to batch
- `GET /api/admin/analytics` - Get system analytics

## Blockchain Integration

### Smart Contract Events
```solidity
event BatchCreated(string batchId, address farmer, string ipfsHash);
event TransportStarted(string batchId, address transporter, string location);
event LocationUpdated(string batchId, string newLocation, uint256 timestamp);
event BatchDelivered(string batchId, address transporter, string finalLocation);
```

### IPFS Metadata Structure
```json
{
  "batchId": "AGT-001",
  "productName": "Organic Tomatoes",
  "farmer": {
    "name": "John Smith",
    "location": "Green Valley Farm, Maharashtra",
    "certifications": ["Organic India", "Non-GMO"]
  },
  "transport": {
    "transporter": "Express Logistics",
    "pickupDate": "2024-01-16T08:00:00Z",
    "currentLocation": "Mumbai Distribution Center",
    "estimatedDelivery": "2024-01-18T18:00:00Z"
  },
  "timeline": [
    {
      "stage": "Farm",
      "timestamp": "2024-01-15T08:00:00Z",
      "location": "Green Valley Farm",
      "handler": "John Smith"
    },
    {
      "stage": "Transport",
      "timestamp": "2024-01-16T10:00:00Z",
      "location": "In Transit to Mumbai",
      "handler": "Express Logistics"
    }
  ]
}
```

## Security Considerations

1. **JWT Authentication**: All API endpoints require valid JWT tokens
2. **Role-based Access**: Users can only access data relevant to their role
3. **Data Validation**: All inputs are validated and sanitized
4. **Rate Limiting**: API endpoints have rate limiting to prevent abuse
5. **HTTPS Only**: All communications must be over HTTPS
6. **Audit Trail**: All updates are logged for transparency

## Environment Variables

```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Blockchain
AVALANCHE_RPC_URL=https://api.avax.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address

# IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```