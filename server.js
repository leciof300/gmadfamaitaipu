const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://postgres.bsvhnbqbhcgtlebroalb:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para interpretar dados do formulário

// Rota para adicionar um novo membro
app.post('/add-member', async (req, res) => {
  const { name, number, address, group } = req.body;

  try {
    // Verifica se o membro já existe
    const existingMember = await pool.query('SELECT * FROM members WHERE name = $1', [name]);

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ error: 'Membro já existe.' });
    }

    // Adiciona o novo membro
    await pool.query('INSERT INTO members (name, number, address, group) VALUES ($1, $2, $3, $4)', [name, number, address, group]);
    res.status(201).json({ message: 'Membro adicionado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar membro.' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
