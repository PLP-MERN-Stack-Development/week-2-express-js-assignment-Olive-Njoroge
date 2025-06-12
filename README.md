
# Product Management API

A simple Express.js REST API for managing products, featuring authentication, error handling, filtering, pagination, and search functionality.

## 📦 Technologies Used

- Node.js
- Express
- UUID
- dotenv

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```bash
touch .env
```

Add your environment variables in `.env`:

```
PORT=3000
```

### 4. Run the server

```bash
npm start
```

Server will run at: `http://localhost:3000`

---

## 📘 API Documentation

### Base URL

```
http://localhost:3000/api/products
```

---

### ✅ Get All Products

```
GET /api/products
```

#### Optional Query Parameters

| Parameter   | Description                      |
|-------------|----------------------------------|
| category    | Filter by product category       |
| page        | Page number for pagination       |
| limit       | Items per page                   |

#### Example:

```
GET /api/products?category=electronics&page=1&limit=2
```

#### Response:
```json
{
  "page": 1,
  "limit": 2,
  "total": 2,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### 🔍 Search Products by Name

```
GET /api/products/search?name=laptop
```

#### Response:
```json
{
  "total": 1,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### 📊 Get Product Statistics

```
GET /api/products/stats
```

#### Response:
```json
{
  "totalProducts": 3,
  "countByCategory": {
    "electronics": 2,
    "kitchen": 1
  }
}
```

---

### 🔍 Get Product by ID

```
GET /api/products/:id
```

#### Response:
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

---

### ➕ Create Product (Requires Auth Header)

```
POST /api/products
```

#### Headers:
```
Authorization: your-token
```

#### Body:
```json
{
  "name": "Blender",
  "description": "500W electric blender",
  "price": 80,
  "category": "kitchen",
  "inStock": true
}
```

#### Response:
```json
{
  "id": "generated-uuid",
  "name": "Blender",
  "description": "500W electric blender",
  "price": 80,
  "category": "kitchen",
  "inStock": true
}
```

---

### ✏️ Update Product

```
PUT /api/products/:id
```

#### Body:
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "price": 90,
  "category": "electronics",
  "inStock": false
}
```

#### Response:
```json
{
  "id": "1",
  "name": "Updated Name",
  "description": "Updated description",
  "price": 90,
  "category": "electronics",
  "inStock": false
}
```

---

### ❌ Delete Product

```
DELETE /api/products/:id
```

#### Response:
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
}
```

---

## ⚠️ Error Handling

The API uses consistent error responses:

```json
{
  "message": "Validation Error",
  "errors": [
    "Name is required and must be a string.",
    "Price is required and must be a number."
  ]
}
```

---

## 🧪 Sample `.env` File

```
PORT=3000
```

---

## 📬 Contact

For any issues, please open an issue on GitHub or contact [your email].
