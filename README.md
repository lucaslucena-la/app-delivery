# Delivery App - Fullstack (Node + React + Postgres)

Este projeto é um sistema de delivery composto por **frontend (React + Vite)**, **backend (Node.js + Express + TypeScript)** e **banco de dados (PostgreSQL)**.
Todo o ambiente roda em **containers Docker** usando `docker-compose`.

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- [Node.js](https://nodejs.org/) **(opcional, apenas se quiser rodar fora do Docker)**

## Como rodar o projeto com docker

1) Subir os Containers
**Na raiz do Projeto:**
```env
docker compose up --build
```
Frontend → http://localhost:5173

Backend → http://localhost:3001

