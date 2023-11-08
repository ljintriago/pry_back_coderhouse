const express = require('express');
const fs = require('fs');
const carts = require('../data/carts.json');
const { readDataFromFile, writeDataToFile } = require('../utils');

let products = readDataFromFile('../data/products.json');
let carts = readDataFromFile('../data/carts.json');

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
    
    const newCartId = Date.now().toString();
  
    const newCart = {
      id: newCartId,
      products: [],
    };
  
    carts.push(newCart);
  
    writeDataToFile('../data/carts.json', carts);
  
    res.status(201).json(newCart);
});
  
cartsRouter.get('/:cid/products', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find((c) => c.id === cartId);
  
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
  
    res.json(cart.products);
});
  
cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = carts.find((c) => c.id === cartId);
  
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
  
    const product = products.find((p) => p.id === productId);
  
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const existingProduct = cart.products.find((p) => p.product === productId);
  
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }
  
    writeDataToFile('../data/carts.json', carts);
  
    res.status(201).json(cart.products);
});

module.exports = cartsRouter;