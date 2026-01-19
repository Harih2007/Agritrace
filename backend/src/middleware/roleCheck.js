const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 */
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
      }

      const token = authHeader.replace('Bearer ', '');
      
      // Get user from token
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, is_active')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return res.status(403).json({ error: 'User profile not found' });
      }

      // Check if user is active
      if (!profile.is_active) {
        return res.status(403).json({ error: 'User account is inactive' });
      }

      // Check role
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!roles.includes(profile.role)) {
        logger.warn(`Access denied for user ${user.id} with role ${profile.role}`);
        return res.status(403).json({ 
          error: 'Access denied',
          message: `This action requires one of the following roles: ${roles.join(', ')}`,
          userRole: profile.role
        });
      }

      // Attach user and role to request
      req.user = {
        ...user,
        role: profile.role
      };

      next();
    } catch (error) {
      logger.error('Role check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

/**
 * Predefined role checkers
 */
const requireAdmin = checkRole('admin');
const requireFarmer = checkRole(['farmer', 'admin']);
const requireDistributor = checkRole(['distributor', 'admin']);
const requireRetailer = checkRole(['retailer', 'admin']);
const requireTransporter = checkRole(['transporter', 'admin']);
const requireSupplyChainRole = checkRole(['farmer', 'distributor', 'retailer', 'transporter', 'admin']);

module.exports = {
  checkRole,
  requireAdmin,
  requireFarmer,
  requireDistributor,
  requireRetailer,
  requireTransporter,
  requireSupplyChainRole
};
