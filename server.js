import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; 


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


app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/agendar', agendar);
app.get('/api/pontos-coleta', pontosColeta);
app.get('/api/catadores', catadores);
app.get('/api/agenda', agenda);


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'telaLogin.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'telaRegister.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/mapa', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mapa.html')));
app.get('/coleta', (req, res) => res.sendFile(path.join(__dirname, 'public', 'coleta.html')));
app.get('/catadores', (req, res) => res.sendFile(path.join(__dirname, 'public', 'catadores.html')));
app.get('/agenda', (req, res) => res.sendFile(path.join(__dirname, 'public', 'agenda.html')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));




