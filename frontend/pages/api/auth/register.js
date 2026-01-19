// API route for user registration
export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password, role, fullName, verificationCode, ...additionalData } = req.body;

      // Validate required fields
      if (!email || !password || !role || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, role, and full name are required'
        });
      }

      // Validate verification codes
      const validCodes = {
        farmer: 'FARMER2025',
        distributor: 'DISTRIBUTOR2025',
        retailer: 'RETAILER2025'
      };

      if (verificationCode !== validCodes[role]) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code for this role'
        });
      }

      // Mock registration - in real app, save to database
      const userData = {
        email,
        role,
        fullName,
        ...additionalData,
        createdAt: new Date().toISOString()
      };

      // In a real app, hash password and save to database
      // const hashedPassword = await bcrypt.hash(password, 10);

      // Generate mock JWT token
      const mockToken = `mock_jwt_token_${Date.now()}`;

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          token: mockToken,
          user: userData
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
}