// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

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

//`GET /api/products`: List all products
app.get('/api/products', async(req,res) => {
  res.json(products);
});

//`GET /api/products/:id`: Get a specific product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id); // find product by id in the array
  if (!product) return res.status(404).send({ message: 'Not Found' });
  res.send(product);
});

//`POST /api/products`: Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  // Simple validation (optional, but recommended)
  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  // Create new product object with a unique id
  const newProduct = {
    id: uuidv4(), // generate unique id
    name,
    description,
    price,
    category,
    inStock,
  };

  // Add the new product to the array
  products.push(newProduct);

  // Send back the newly created product with 201 Created status
  res.status(201).json(newProduct);
});

//`PUT /api/products/:id`: Update an existing product
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const updatedData = req.body;

  // Find index of product to update
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).send({ message: 'Product not found' });
  }

  // Update the product fields with data from request body
  products[productIndex] = {
    ...products[productIndex],   // keep existing fields
    ...updatedData,              // override with updated fields
    id: productId               // ensure id is not changed
  };

  res.send(products[productIndex]);
});


//`DELETE /api/products/:id`: Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  // Find index of the product to delete
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).send({ message: 'Product not found' });
  }

  // Remove the product from the array
  const deletedProduct = products.splice(productIndex, 1);

  res.send({ message: 'Product deleted successfully', product: deletedProduct[0] });
});



// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 