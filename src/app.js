const express = require('express');
const exphbs = require('express-handlebars');
const socketIo = require('socket.io');
const http = require('http');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const realTimeRouter = require('./routes/realTimeProducts');
const { readDataFromFile, writeDataToFile } = require('./utils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); 

io.on('connection', (socket) => {
  console.log('Conectado');

  socket.on('newProduct', (product) => {
    const products = readDataFromFile('./data/products.json');
    products.push(product);
    writeDataToFile('./data/products.json',products);
    io.emit('updateProducts', { products });
  });

  socket.on('deleteProduct', (productId) => {
    const products = readDataFromFile('./data/products.json');
    const updatedProducts = products.filter((product) => product.id !== productId);
    writeDataToFile('./data/products.json',updatedProducts);
    io.emit('updateProducts', { updatedProducts });
  });

  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', realTimeRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
