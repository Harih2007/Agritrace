// API route for getting transporter batches
import { mockTransporterBatches } from '../../../utils/mockData';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // In a real app, you would filter by the authenticated transporter's ID
      // For now, return all mock batches
      res.status(200).json({
        success: true,
        data: mockTransporterBatches,
        message: 'Batches retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve batches',
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
}