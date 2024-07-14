const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data', 'products.json');

// Helper functions
const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Routes
app.get('/api/products', (req, res) => {
  const products = readData();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readData();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeData(products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData();
  const { id } = req.params;
  const index = products.findIndex(p => p.id == id);

  if (index !== -1) {
    products[index] = { id: parseInt(id), ...req.body };
    writeData(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData();
  const { id } = req.params;
  const initialLength = products.length;
  products = products.filter(p => p.id != id);

  if (products.length < initialLength) {
    writeData(products);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});