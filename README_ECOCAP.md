
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
- 🟩 Node.js  
- 🗃️ PostgreSQL (Supabase)  
- ☁️ Supabase (DB Hosting)  
- 🚀 Vercel (Deploy)

---

## ⚙️ Instalação

> Requisitos:
> - Node.js instalado
> - Python 3.11 (para scripts auxiliares, se houver)
> - Banco de dados na nuvem (Supabase)
> - Deploy na Vercel (acesso preferencial)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ecocap.git
cd ecocap

# Instale as dependências (via Node)
npm install

# (opcional) Para Python, se necessário:
# pip install -r requirements.txt
```

> ⚠️ **Importante:** O banco de dados está hospedado no Supabase, e as credenciais de acesso estão protegidas em um arquivo `.env`, que não está disponível no repositório por motivos de segurança. Portanto, a aplicação **não funcionará completamente em ambiente local** sem essas configurações.

> Para acesso completo, utilize a versão publicada no deploy:  
**🔗 [Acesse via Vercel](https://seu-projeto.vercel.app)**

---

## ▶️ Como Usar

### Em produção (recomendado)

Acesse diretamente a aplicação hospedada na Vercel:  
`https://seu-projeto.vercel.app`

### Em ambiente local (limitado)

```bash
npm run start
```

> ⚠️ Sem acesso ao `.env`, recursos que dependem do banco não funcionarão.

---

## 📁 Estrutura do Projeto

```bash
ecocap/
├── backend/               # (se aplicável)
│   ├── manage.py
│   └── app/
│       ├── models.py
│       └── views.py
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── main.js
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