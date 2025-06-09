
# ♻️ ECOCAP

O **ECOCAP** é um aplicativo que promove a solidariedade e a sustentabilidade ao conectar estabelecimentos de alimentos — como mercados e padarias — a pessoas, por meio da reciclagem.  
Usuários podem trocar resíduos recicláveis por créditos digitais chamados **ECOBônus**, que são usados na compra de alimentos.  
Com isso, o ECOCAP combate o desperdício, estimula o consumo consciente e ajuda na construção de comunidades mais sustentáveis.

---

## 📚 Índice

- [🚀 Tecnologias](#-tecnologias)
- [⚙️ Instalação](#️-instalação)
- [▶️ Como Usar](#️-como-usar)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [💡 Exemplo de Uso](#-exemplo-de-uso)
- [📝 Licença](#-licença)
- [📫 Contato](#-contato)

---

## 🚀 Tecnologias

- 🐍 Python 3.11  
- 🌐 Django  
- 🖼️ HTML, CSS, JavaScript  
- 🗃️ SQL, JSON  
- ☁️ Supabase  

---

## ⚙️ Instalação

> Requisitos:
> - Python 3.11
> - Node.js (para o front-end com npm)
> - Banco de dados (Supabase configurado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ecocap.git
cd ecocap

# Crie o ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate   # Windows

# Instale as dependências do backend
pip install -r requirements.txt

# Vá para o front-end (separado)
cd frontend
npm install
```

---

## ▶️ Como Usar

### Backend (Django)

```bash
# Volte para a pasta backend, se necessário
python manage.py migrate
python manage.py runserver
```

### Frontend (npm)

```bash
cd frontend
npm run start
```

Acesse:  
- Frontend → `http://localhost:3000`  
- Backend → `http://localhost:8000`

---

## 📁 Estrutura do Projeto

```bash
ecocap/
├── backend/
│   ├── manage.py
│   └── app/
│       ├── models.py
│       ├── views.py
│       └── ...
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── main.js
│   └── ...
├── requirements.txt
└── README.md
```

---

## 💡 Exemplo de Uso

- Usuário cadastra resíduos recicláveis.
- Recebe créditos digitais (**ECOBônus**).
- Utiliza os créditos para comprar alimentos em parceiros locais.

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.  
Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---
