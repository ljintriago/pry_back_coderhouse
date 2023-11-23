import express from 'express';
import { productsRouter } from "./routes/products.js"
import { cartsRouter } from './routes/carts.js'
import mongoose from 'mongoose';
import exphbs from 'handlebars';
import socketIo from 'socket.io';
import http from 'http'
import {realTimeRouter} from './routes/realTimeProducts.js';
import { readDataFromFile, writeDataToFile } from './utils.js';

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

const URL = "mongodb+srv://ljintriago:nls131802@petshopcluster.hksukok.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URL, {})
.then((res) => {
  console.log("Database connected");
})
.catch((error) => {
  console.log("Error while connecting Database: ", error)
});
