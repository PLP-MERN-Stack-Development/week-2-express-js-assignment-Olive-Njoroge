// middleware/validateProduct.js

module.exports = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;
  
    const errors = [];
  
    if (!name || typeof name !== 'string') errors.push('Name is required and must be a string.');
    if (!description || typeof description !== 'string') errors.push('Description is required and must be a string.');
    if (price === undefined || typeof price !== 'number') errors.push('Price is required and must be a number.');
    if (!category || typeof category !== 'string') errors.push('Category is required and must be a string.');
    if (inStock === undefined || typeof inStock !== 'boolean') errors.push('inStock is required and must be a boolean.');
  
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation Error', errors });
    }
  
    next(); // Data is valid
  };
  