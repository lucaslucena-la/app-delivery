FROM node:20-alpine

WORKDIR /app

# habilita o corepack (traz pnpm)
RUN corepack enable

# copie lockfile e package.json primeiro para cache de dependências
COPY package.json ./

# instala dependências com pnpm respeitando o lockfile
RUN pnpm install 

# copie o restante do projeto
COPY . .

EXPOSE 5173

# rode o Vite no host 0.0.0.0 dentro do container
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
