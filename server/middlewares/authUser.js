import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.id) {
      req.body = req.body || {};        // Initialize req.body if undefined
      req.body.userId = decoded.id;    // attach user ID to request body
      next();                          // proceed to the next middleware/controller
    } else {
      return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
