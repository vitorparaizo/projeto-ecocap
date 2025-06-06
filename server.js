import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import register from './api/register.js';
import login from './api/login.js';
import agendar from './api/agendar.js'; 

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/agendar', agendar); 


app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'telaLogin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
