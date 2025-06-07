// server.js (Corrigido)

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import register from './api/register.js';
import login from './api/login.js';
import agendar from './api/agendar.js';
// 1. IMPORTAR a lógica dos pontos de coleta
import pontosColeta from './api/pontos-coleta.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Rotas de POST (já estavam corretas)
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/agendar', agendar);

// 2. ADICIONAR a rota GET para os pontos de coleta
app.get('/api/pontos-coleta', pontosColeta);


// Rotas para servir as páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'telaLogin.html'));
});

// Adicionei esta rota para facilitar o acesso direto à página do mapa
app.get('/mapa', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'mapa.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));  