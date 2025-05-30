const jwt = require('jsonwebtoken');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`});

const requireAuth = (req, res, next) => {

  let token = req.query.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.decoded = decoded;
    next();
  } 
  catch (err) {
   
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Expired token',
      });
    }
    else {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
  }
  }
}

module.exports = requireAuth;
