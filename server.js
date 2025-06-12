// server.js - Starter Express server for Week 2 assignment

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const authenticate = require('./middleware/auth.js');
const logger = require('./middleware/logger');

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

// Async wrapper for error handling
const wrapAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string') errors.push('Name is required and must be a string.');
  if (!description || typeof description !== 'string') errors.push('Description is required and must be a string.');
  if (price === undefined || typeof price !== 'number') errors.push('Price is required and must be a number.');
  if (!category || typeof category !== 'string') errors.push('Category is required and must be a string.');
  if (inStock === undefined || typeof inStock !== 'boolean') errors.push('inStock is required and must be a boolean.');

  if (errors.length > 0) {
    return next(new ValidationError('Validation Error', errors));
  }

  next();
};

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);
app.use(bodyParser.json());

// In-memory product data
let products = [
  { id: '1', name: 'Laptop', description: 'High-performance laptop', price: 1200, category: 'electronics', inStock: true },
  { id: '2', name: 'Smartphone', description: '128GB storage', price: 800, category: 'electronics', inStock: true },
  { id: '3', name: 'Coffee Maker', description: 'With timer', price: 50, category: 'kitchen', inStock: false }
];

// Routes
app.get('/', (req, res) => res.send('Hello World'));

app.get('/api/products', wrapAsync(async (req, res) => {
  res.json(products);
}));

app.get('/api/products/:id', wrapAsync(async (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  res.json(product);
}));

app.post('/api/products', authenticate, validateProduct, wrapAsync(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

app.put('/api/products/:id', validateProduct, wrapAsync(async (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) throw new NotFoundError('Product not found');

  products[index] = { ...products[index], ...req.body, id: req.params.id };
  res.json(products[index]);
}));

app.delete('/api/products/:id', wrapAsync(async (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) throw new NotFoundError('Product not found');

  const deleted = products.splice(index, 1)[0];
  res.json({ message: 'Product deleted successfully', product: deleted });
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  if (err.errors) response.errors = err.errors;
  res.status(status).json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
