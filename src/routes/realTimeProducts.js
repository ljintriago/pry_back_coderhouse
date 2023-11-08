const express = require('express');
const realTimeRouter = express.Router();
const fs = require('fs');

function cargarProductos() {
  try {
    const productsData = fs.readFileSync('../data/products.json', 'utf8');
    const products = JSON.parse(productsData);
    return products;
  } catch (error) {
    console.error('Error al cargar los productos desde JSON:', error);
    return [];
  }
}

realTimeRouter.get('/home', (req, res) => {
    const products = cargarProductos();
    res.render('home', { products });
});
  
  
realTimeRouter.get('/realtimeproducts', (req, res) => {
    const products = cargarProductos();
    res.render('realTimeProducts', { products });
});

router.post('/addProduct', (req, res) => {
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

    io.emit('updateProducts', { newProduct });
});
  
router.post('/deleteProduct', (req, res) => {
    const productId = req.params.pid;
    const products = cargarProductos();
    const productIndex = products.findIndex((p) => p.id === productId);
  
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  

    io.emit('updateProducts', { productId });
});
  

module.exports = realTimeRouter;
