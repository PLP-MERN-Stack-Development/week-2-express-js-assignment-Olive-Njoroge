// server.js - Starter Express server for Week 2 assignment

require('dotenv').config();
const authenticate = require('./middleware/auth.js');

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Import the logger middleware
const logger = require('./middleware/logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Use the logger middleware globally
app.use(logger);

// Middleware setup
app.use(bodyParser.json());

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
    return res.status(400).json({ message: 'Validation Error', errors });
  }

  next();
};

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// `GET /api/products`: List all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// `GET /api/products/:id`: Get a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).send({ message: 'Not Found' });
  res.send(product);
});

// `POST /api/products`: Create a new product (with authentication and validation)
app.post('/api/products', authenticate, validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// `PUT /api/products/:id`: Update an existing product (with validation)
app.put('/api/products/:id', validateProduct, (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;

  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).send({ message: 'Product not found' });
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updatedData,
    id: productId
  };

  res.send(products[productIndex]);
});

// `DELETE /api/products/:id`: Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).send({ message: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1);
  res.send({ message: 'Product deleted successfully', product: deletedProduct[0] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
