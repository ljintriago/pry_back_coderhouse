const express = require('express');
const fs = require('fs');
const products = require('../data/products.json');
const { readDataFromFile, writeDataToFile } = require('../utils');
  
let products = readDataFromFile('../data/products.json');

const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    const { limit } = req.query;
    let productList = products;
  
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!isNaN(parsedLimit)) {
        productList = productList.slice(0, parsedLimit);
      }
    }
  
    res.json(productList);
});
  
  
productsRouter.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const product = products.find((p) => p.id === productId);
  
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
});
  
  
productsRouter.post('/', (req, res) => {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    } = req.body;
  
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ message: 'Todos los campos obligatorios deben ser proporcionados.' });
    }
  
    // Generación de un nuevo ID
    const newProductId = Date.now().toString();
  
    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price: parseFloat(price),
      status: true,
      stock: parseInt(stock, 10),
      category,
      thumbnails: thumbnails || [],
    };
  
    products.push(newProduct);

    writeDataToFile('../data/products.json', products);
  
    res.status(201).json(newProduct);
});
  
productsRouter.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const productIndex = products.findIndex((p) => p.id === productId);
  
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  
    const updatedProduct = products[productIndex];
    const { title, description, code, price, stock, category, thumbnails } = req.body;
  
    if (title) updatedProduct.title = title;
    if (description) updatedProduct.description = description;
    if (code) updatedProduct.code = code;
    if (price) updatedProduct.price = parseFloat(price);
    if (stock) updatedProduct.stock = parseInt(stock, 10);
    if (category) updatedProduct.category = category;
    if (thumbnails) updatedProduct.thumbnails = thumbnails;
  
    writeDataToFile('../data/products.json', products);
  
    res.json(updatedProduct);
});
  
productsRouter.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const productIndex = products.findIndex((p) => p.id === productId);
  
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  
    products.splice(productIndex, 1);
  
    writeDataToFile('../data/products.json', products);
  
    res.json({ message: 'Producto eliminado' });
});

module.exports = productsRouter;