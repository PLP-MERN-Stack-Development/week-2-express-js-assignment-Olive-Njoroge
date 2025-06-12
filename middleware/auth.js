// middleware/auth.js

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
  
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
    }
  
    next(); // pass to the next middleware or route handler
  };
  
  module.exports = authenticate;
  