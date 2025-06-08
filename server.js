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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// O servidor estático ainda é útil para o desenvolvimento local
app.use(express.static(path.join(__dirname, 'public')));

// --- ROTAS DA API (A única responsabilidade do servidor agora) ---
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/agendar', agendar);
app.get('/api/pontos-coleta', pontosColeta);
app.get('/api/catadores', catadores);
app.get('/api/agenda', agenda);

// As rotas para servir HTML foram REMOVIDAS daqui
// app.get('/mapa', ...) -> REMOVIDO
// app.get('/home', ...) -> REMOVIDO
// etc...

// A Vercel ignora esta parte, mas é útil para o desenvolvimento local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));

// Exportar a app para a Vercel
export default app;
