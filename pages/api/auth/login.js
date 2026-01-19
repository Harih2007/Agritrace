// API route for user login
export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password, role } = req.body;

      // Validate required fields
      if (!email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and role are required'
        });
      }

      // Mock authentication - in real app, verify against database
      const mockUsers = {
        'farmer@agritrace.com': { password: 'farmer123', role: 'farmer', name: 'John Smith' },
        'distributor@agritrace.com': { password: 'distributor123', role: 'distributor', name: 'Transport Co.' },
        'retailer@agritrace.com': { password: 'retailer123', role: 'retailer', name: 'Fresh Market' }
      };

      const user = mockUsers[email];

      if (!user || user.password !== password || user.role !== role) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // In a real app, generate JWT token here
      const mockToken = `mock_jwt_token_${Date.now()}`;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token: mockToken,
          user: {
            email: email,
            role: user.role,
            name: user.name
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
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