import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importando suas rotas de API
import register from './api/register.js';
import login from './api/login.js';
import agendar from './api/agendar.js';
import pontosColeta from './api/pontos-coleta.js';
import catadores from './api/catadores.js';
import agenda from './api/agenda.js';

dotenv.config();

// Configuração de path que funciona em qualquer ambiente (local e Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Servir arquivos estáticos (CSS, JS do cliente, imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- ROTAS DA API ---
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/agendar', agendar);
app.get('/api/pontos-coleta', pontosColeta);
app.get('/api/catadores', catadores);
app.get('/api/agenda', agenda);


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'telaLogin.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/mapa', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mapa.html')));
app.get('/coleta', (req, res) => res.sendFile(path.join(__dirname, 'public', 'coleta.html')));
app.get('/catadores', (req, res) => res.sendFile(path.join(__dirname, 'public', 'catadores.html')));
app.get('/agenda', (req, res) => res.sendFile(path.join(__dirname, 'public', 'agenda.html')));


// A Vercel ignora esta parte, mas é útil para o desenvolvimento local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

// Exportar a app para a Vercel entender como usar o servidor
export default app;
