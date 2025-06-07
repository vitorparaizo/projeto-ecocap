import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Importando suas rotas de API
import register from './api/register.js';
import login from './api/login.js';
import agendar from './api/agendar.js';
import pontosColeta from './api/pontos-coleta.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// --- ROTAS DA API ---
// Seu código já estava correto aqui.
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/agendar', agendar); // Rota principal para o agendamento
app.get('/api/pontos-coleta', pontosColeta);


// --- ROTAS PARA SERVIR AS PÁGINAS HTML ---
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'telaLogin.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'mapa.html'));
});

// AJUSTE: Adicionei esta rota para servir a página de coleta diretamente.
app.get('/coleta', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'coleta.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
