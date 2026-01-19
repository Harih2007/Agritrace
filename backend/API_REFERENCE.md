# API Reference

Complete API documentation for the Supply Chain Backend.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {...},
  "token": "jwt_token"
}
```

---

### POST /auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "walletAddress": "0x..." // optional
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "User created successfully"
}
```

---

### POST /auth/wallet
Authenticate using wallet signature.

**Request:**
```json
{
  "signature": "0x...",
  "message": "Sign this message to authenticate",
  "address": "0x..."
}
```

**Response (200):**
```json
{
  "user": {
    "wallet_address": "0x..."
  },
  "message": "Wallet authenticated successfully"
}
```

---

### POST /auth/logout
Logout current user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### POST /products
Create a new product (registers on blockchain).

**Auth Required:** Yes

**Request:**
```json
{
  "name": "Organic Wheat",
  "description": "Premium organic wheat from local farm",
  "ipfsHash": "QmX...",
  "metadata": {
    "weight": "50kg",
    "origin": "California"
  },
  "price": 100.50
}
```

**Response (201):**
```json
{
  "product": {
    "id": 1,
    "blockchain_id": "1",
    "name": "Organic Wheat",
    "description": "Premium organic wheat from local farm",
    "ipfs_hash": "QmX...",
    "metadata": {...},
    "price": "100.50",
    "owner_id": "uuid",
    "blockchain_hash": "0x...",
    "is_active": true,
    "created_at": "2025-01-09T..."
  },
  "blockchainHash": "0x...",
  "message": "Product registered successfully"
}
```

---

### GET /products/:id
Get product details with blockchain verification.

**Request:**
```
GET /products/1
```

**Response (200):**
```json
{
  "product": {
    "id": 1,
    "blockchain_id": "1",
    "name": "Organic Wheat",
    ...
  },
  "blockchain": {
    "id": "1",
    "owner": "0x...",
    "timestamp": "2025-01-09T...",
    "isActive": true
  }
}
```

---

### PUT /products/:id
Update product information.

**Auth Required:** Yes (must be owner)

**Request:**
```json
{
  "ipfsHash": "QmY...",
  "metadata": {
    "weight": "60kg"
  },
  "isActive": true
}
```

**Response (200):**
```json
{
  "product": {...},
  "message": "Product updated successfully"
}
```

---

### DELETE /products/:id
Deactivate a product.

**Auth Required:** Yes (must be owner)

**Response (200):**
```json
{
  "message": "Product deactivated successfully"
}
```

---

### GET /products/user/:userId
List all products owned by a user.

**Auth Required:** Yes

**Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Organic Wheat",
      ...
    }
  ]
}
```

---

## Payment (Escrow) Endpoints

### POST /payments/escrow
Create an escrow payment for a product.

**Auth Required:** Yes

**Request:**
```json
{
  "productId": 1,
  "sellerAddress": "0x...",
  "amount": "1.5"
}
```

**Response (201):**
```json
{
  "escrow": {
    "id": 1,
    "blockchain_id": "1",
    "product_id": 1,
    "buyer_id": "uuid",
    "seller_address": "0x...",
    "amount": "1.5",
    "status": "funded",
    "blockchain_hash": "0x..."
  },
  "blockchainHash": "0x...",
  "message": "Escrow created successfully"
}
```

---

### POST /payments/escrow/:id/confirm-delivery
Buyer confirms product delivery.

**Auth Required:** Yes (buyer only)

**Response (200):**
```json
{
  "message": "Delivery confirmed"
}
```

---

### POST /payments/escrow/:id/release
Release funds to seller after delivery confirmation.

**Auth Required:** Yes (buyer only)

**Response (200):**
```json
{
  "message": "Funds released successfully"
}
```

---

### POST /payments/escrow/:id/dispute
Raise a dispute on the escrow.

**Auth Required:** Yes (buyer or seller)

**Response (200):**
```json
{
  "message": "Dispute raised"
}
```

---

### GET /payments/escrow/:id
Get escrow details.

**Auth Required:** Yes

**Response (200):**
```json
{
  "escrow": {
    "id": 1,
    "status": "funded",
    "products": {...}
  },
  "blockchain": {
    "id": "1",
    "buyer": "0x...",
    "seller": "0x...",
    "amount": "1.5",
    "state": 1,
    "createdAt": "2025-01-09T..."
  }
}
```

---

## QR Code Endpoints

### POST /qr/generate/:productId
Generate a QR code for product verification.

**Auth Required:** Yes (must be product owner)

**Request:**
```
POST /qr/generate/1
```

**Response (200):**
```json
{
  "qrCode": "data:image/png;base64,...",
  "qrData": {
    "productId": 1,
    "blockchainId": "1",
    "name": "Organic Wheat",
    "ipfsHash": "QmX...",
    "verificationUrl": "http://localhost:3000/api/qr/verify/1",
    "timestamp": "2025-01-09T..."
  },
  "message": "QR code generated successfully"
}
```

---

### GET /qr/verify/:productId
Verify product authenticity via QR code.

**Request:**
```
GET /qr/verify/1
```

**Response (200):**
```json
{
  "verified": true,
  "product": {
    "id": 1,
    "name": "Organic Wheat",
    "blockchainId": "1",
    "ipfsHash": "QmX...",
    "blockchainHash": "0x...",
    "isActive": true
  },
  "qrCode": {...},
  "timestamp": "2025-01-09T..."
}
```

---

### POST /qr/scan
Scan and decode QR code data.

**Request:**
```json
{
  "qrData": "{\"productId\":1,\"blockchainId\":\"1\",...}"
}
```

**Response (200):**
```json
{
  "valid": true,
  "product": {...},
  "scannedData": {...}
}
```

---

## IPFS Endpoints

### POST /ipfs/upload
Upload a file to IPFS via Pinata.

**Auth Required:** Yes

**Request:**
```json
{
  "file": "base64_encoded_file_content",
  "filename": "product-image.jpg",
  "contentType": "image/jpeg",
  "name": "Product Image",
  "metadata": {
    "productId": 1
  }
}
```

**Alternative (JSON content):**
```json
{
  "content": {
    "name": "Product Metadata",
    "description": "..."
  },
  "name": "Product Metadata"
}
```

**Response (201):**
```json
{
  "ipfsHash": "QmX...",
  "gatewayUrl": "https://gateway.pinata.cloud/ipfs/QmX...",
  "pinataUrl": "https://gateway.pinata.cloud/ipfs/QmX...",
  "record": {
    "id": 1,
    "ipfs_hash": "QmX...",
    "filename": "product-image.jpg"
  },
  "message": "File uploaded to IPFS successfully"
}
```

---

### GET /ipfs/:hash
Get IPFS file information.

**Request:**
```
GET /ipfs/QmX...
```

**Response (200):**
```json
{
  "ipfsHash": "QmX...",
  "gatewayUrl": "https://gateway.pinata.cloud/ipfs/QmX...",
  "pinataUrl": "https://gateway.pinata.cloud/ipfs/QmX...",
  "record": {
    "id": 1,
    "filename": "product-image.jpg",
    "content_type": "image/jpeg",
    "user_id": "uuid"
  }
}
```

---

### POST /ipfs/pin
Pin an existing IPFS hash.

**Auth Required:** Yes

**Request:**
```json
{
  "ipfsHash": "QmX...",
  "name": "Pinned Content"
}
```

**Response (200):**
```json
{
  "ipfsHash": "QmX...",
  "status": "pinned",
  "message": "Content pinned successfully"
}
```

---

### DELETE /ipfs/unpin/:hash
Unpin content from IPFS.

**Auth Required:** Yes

**Request:**
```
DELETE /ipfs/unpin/QmX...
```

**Response (200):**
```json
{
  "message": "Content unpinned successfully"
}
```

---

### GET /ipfs/user/files
List all IPFS files uploaded by the user.

**Auth Required:** Yes

**Response (200):**
```json
{
  "files": [
    {
      "id": 1,
      "ipfs_hash": "QmX...",
      "filename": "product-image.jpg",
      "gateway_url": "https://...",
      "created_at": "2025-01-09T..."
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

### Common Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **429** - Too Many Requests (rate limit exceeded)
- **500** - Internal Server Error

### Example Error Response

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

---

## Rate Limiting

- **Window:** 15 minutes (configurable)
- **Max Requests:** 100 per window (configurable)
- **Response:** 429 Too Many Requests

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## CORS

Configure allowed origins in `.env`:
```
CORS_ORIGIN=http://localhost:3000
```

For multiple origins, update `backend/src/server.js`.

---

## Webhooks (Future)

Planned webhook support for:
- Product registration events
- Escrow status changes
- Payment completions
- Dispute resolutions

---

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let token = '';

// Login
async function login(email, password) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  token = response.data.token;
  return response.data;
}

// Create product
async function createProduct(productData) {
  const response = await axios.post(
    `${API_URL}/products`,
    productData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
}

// Usage
(async () => {
  await login('user@example.com', 'password123');
  const product = await createProduct({
    name: 'Organic Wheat',
    description: 'Premium wheat',
    ipfsHash: 'QmX...',
    price: 100
  });
  console.log('Product created:', product);
})();
```

### Python

```python
import requests

API_URL = 'http://localhost:3000/api'
token = ''

def login(email, password):
    global token
    response = requests.post(f'{API_URL}/auth/login', json={
        'email': email,
        'password': password
    })
    data = response.json()
    token = data['token']
    return data

def create_product(product_data):
    response = requests.post(
        f'{API_URL}/products',
        json=product_data,
        headers={'Authorization': f'Bearer {token}'}
    )
    return response.json()

# Usage
login('user@example.com', 'password123')
product = create_product({
    'name': 'Organic Wheat',
    'description': 'Premium wheat',
    'ipfsHash': 'QmX...',
    'price': 100
})
print('Product created:', product)
```

---

## Support

For API issues or questions, check:
- Server logs: `backend/logs/`
- Health endpoint: `GET /health`
- Environment configuration: `backend/.env`
