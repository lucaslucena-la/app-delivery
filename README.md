# Delivery App - Fullstack (Node + React + Postgres)

Este projeto é um sistema de delivery composto por **frontend (React + Vite)**, **backend (Node.js + Express + TypeScript)** e **banco de dados (PostgreSQL)**.
Todo o ambiente roda em **containers Docker** usando `docker-compose`.

---

## 🚀 Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- [Node.js](https://nodejs.org/) **(opcional, apenas se quiser rodar fora do Docker)**

---
## ⚙️ Configuração de ambiente

Na **raiz do projeto**, crie o arquivo `.env`:

```env
# Configuração do banco
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=delivery_db

# String de conexão usada pelo backend
DATABASE_URL=postgres://postgres:1234@db:5432/delivery_db

# URL do backend usada pelo frontend
VITE_API_URL=http://localhost:3001
```
No **backend (app-delivery-backend/.env)** coloque:

```env
DATABASE_URL=postgres://postgres:1234@db:5432/delivery_db
```

## ▶️ Como rodar o projeto com docker

1) Subir os Containers
**Na raiz do Projeto:**
```env
docker compose up --build
```
Frontend → http://localhost:5173

Backend → http://localhost:3001

2) Criar tabelas e inserir dados iniciais (se necessário)
```env
docker compose exec backend npx ts-node src/db/create.ts
docker compose exec backend npx ts-node src/db/seed.ts
```
Isso cria as tabelas e popula o banco com usuários, clientes, restaurantes, pratos etc.(Para teste)
=======

>>>>>>> 487d799 (Rodando redondo com docker)
