const express = require('express');
const app = express();
const ProductManager = require('./ProductManager');

const productManager = new ProductManager('../Products.json');

// Endpoint para obtener productos con límite opcional
app.get('/products', (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getProducts(limit);
  res.json(products);
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = productManager.getProductById(productId);
  res.json(product);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
