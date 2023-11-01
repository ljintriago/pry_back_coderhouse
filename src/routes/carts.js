const express = require('express');
const fs = require('fs');
const carts = require('../data/carts.json');

function readDataFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer ${filename}: ${error.message}`);
      return [];
    }
}
  
function writeDataToFile(filename, data) {
    try {
      fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error al escribir en ${filename}: ${error.message}`);
    }
}

let products = readDataFromFile('../data/products.json');
let carts = readDataFromFile('carrito.json');

const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
    
    const newCartId = Date.now().toString();
  
    const newCart = {
      id: newCartId,
      products: [],
    };
  
    carts.push(newCart);
  
    writeDataToFile('carrito.json', carts);
  
    res.status(201).json(newCart);
});
  
cartsRouter.get('/:cid', (req, res) => {
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
  
    writeDataToFile('carrito.json', carts);
  
    res.status(201).json(cart.products);
});

module.exports = cartsRouter;