import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  // Check for token in cookies first, then in Authorization header
  const { token: cookieToken } = req.cookies;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  const token = cookieToken || headerToken;

  // Debug logging
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Auth Header:', authHeader);
  console.log('Auth middleware - Token found:', !!token);

  if (!token) {
    console.log('Auth middleware - No token found in cookies or headers');
    return res.status(401).json({ success: false, message: 'Not Authorized - No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);

    if (decoded?.id) {
      req.body = req.body || {};        // Initialize req.body if undefined
      req.body.userId = decoded.id;    // attach user ID to request body
      console.log('Auth middleware - User ID attached:', decoded.id);
      next();                          // proceed to the next middleware/controller
    } else {
      console.log('Auth middleware - Invalid token structure');
      return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
  } catch (error) {
    console.log('Auth middleware - JWT verification error:', error.message);
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
