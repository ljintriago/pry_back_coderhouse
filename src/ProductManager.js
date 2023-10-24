class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path);
      this.products = JSON.parse(data);
      this.currentId = this.generateNextId();
    } catch (error) {
      this.products = [];
      this.currentId = 1;
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data);
  }

  generateNextId() {
    return this.products.reduce((maxId, product) => (product.id > maxId ? product.id : maxId), 0) + 1;
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
      throw new Error("All product properties are mandatory");
    }

    if (this.products.some((product) => product.code === code)) {
      throw new Error("Product is already registered");
    }

    const product = {
      id: this.currentId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    this.currentId++;

    this.saveProducts();

    return "Product added";
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product !== undefined){
      return product
    }
    else{
      throw new Error("Product not found");
    } 
  }

  updateProduct(productId, updatedProductData) {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error("Product not found");
    }

    this.products[index] = {
      ...this.products[index],
      ...updatedProductData,
      id: productId, // Mantenemos el mismo ID
    };

    this.saveProducts();

    return "Product updated";
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index === -1) {
      throw new Error("Product not found");
    }

    this.products.splice(index, 1);

    this.saveProducts();

    return "Product deleted";
  }
}

module.exports = ProductManager;
  