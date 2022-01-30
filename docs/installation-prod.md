## :rocket: Como executar o projeto em modo **produção**
Para rodar o projeto em modo de produção é necessário ter Node, NPM, Docker e Docker Compose.

### 1. Clonar repositório
Clonar o repositório

```bash
git clone https://github.com/bmviniciuss/postpress
```

### 2. Definir variáveis de ambiente
Criar um arquivo .env na raiz do projeto com o conteudo a seguir:
```bash
DATABASE_URL="postgresql://postpress-db-user:postpress-db-password@db/postpress?schema=public"
POSTGRES_USER="postpress-db-user"
POSTGRES_PASSWORD="postpress-db-password"
JWT_SECRET="super secret pass"
SALT_NUMBER=10
```

### 3. Iniciar aplicação
Executar o comando para iniciar o docker-compose de produção
```
npm run prod:start
```

ou

```
docker-compose -f docker-compose.yml up
```

### :star: Pronto
   
A aplicação estará rodando `http://localhost:4000`.

---
