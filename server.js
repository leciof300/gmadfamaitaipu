const express = require('express');
const { Pool } = require('pg');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuração do Pool para conexão com o PostgreSQL
const pool = new Pool({
  connectionString: 'postgres://postgres.bsvhnbqbhcgtlebroalb:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

// Middleware para parsear JSON
app.use(express.json());

// Rota para adicionar um membro
app.post('/add-member', async (req, res) => {
  const { name, number, address, group } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO members(name, number, address, group) VALUES($1, $2, $3, $4) RETURNING *',
      [name, number, address, group]
    );

    res.status(201).json({ message: 'Membro adicionado com sucesso!', member: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erro ao adicionar membro: ' + error.message });
  }
});

// Configuração do HTTPS
const options = {
  key: fs.readFileSync('caminho/para/seu/certificado/key.pem'), // Altere para o caminho do seu certificado
  cert: fs.readFileSync('caminho/para/seu/certificado/cert.pem'), // Altere para o caminho do seu certificado
};

// Iniciar o servidor HTTPS
https.createServer(options, app).listen(port, () => {
  console.log(`Servidor HTTPS rodando em https://localhost:${port}`);
});
