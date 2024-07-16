const connection = require('./connection');

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
app.get('/produtos', (req, res) => {
    connection.query('SELECT * FROM Produtos', (err, results) => {
      if (err) {
        res.status(500).send('Erro ao buscar produtos');
      } else {
        res.json(results);
      }
    });
  });

  app.post('/produtos', (req, res) => {
    const { nome, descricao, preco } = req.body;
    const query = 'INSERT INTO Produtos (nome, descricao, preco, data_de_criacao) VALUES (?, ?, ?, NOW())';
    connection.query(query, [nome, descricao, preco], (err, results) => {
      if (err) {
        res.status(500).send('Erro ao adicionar produto');
      } else {
        res.status(201).send('Produto adicionado com sucesso');
      }
    });
  });

  app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;
    const query = 'UPDATE Produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?';
    connection.query(query, [nome, descricao, preco, id], (err, results) => {
      if (err) {
        res.status(500).send('Erro ao atualizar produto');
      } else if (results.affectedRows === 0) {
        res.status(404).send('Produto não encontrado');
      } else {
        res.send('Produto atualizado com sucesso');
      }
    });
  });
  
  // Endpoint para deletar um produto
  app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Produtos WHERE id = ?';
    connection.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).send('Erro ao deletar produto');
      } else if (results.affectedRows === 0) {
        res.status(404).send('Produto não encontrado');
      } else {
        res.send('Produto deletado com sucesso');
      }
    });
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
