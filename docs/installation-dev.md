## :rocket: Como executar o projeto em modo **desenvolvimento**
Para rodar a aplicação em modo desenvolvimento é necessário ter instalado em sua máquina o Node, NPM, Docker e Docker Compose (ou postgres instalado e rodando).

### 1. Clonar repositório
Clonar o repositório

```bash
git clone https://github.com/bmviniciuss/postpress
```

### 2. Definir variáveis de ambiente
Usar o arquivo `.env.dev` como exemplo e criar um arquivo .env na raiz do projeto:

```env
DATABASE_URL="postgresql://user:pass@localhost:15432/postpress-dev?schema=public"
POSTGRES_USER='user'
POSTGRES_PASSWORD='password'
JWT_SECRET="super secret pass"
SALT_NUMBER=10
```
Obs.: Como é um arquivo de desenvolvimento local, observar que o endereço do banco é `localhost:15432` e não `db` como o .env de produção mostrado acima.

### 3. Instalar dependências
```bash
npm install
```

### 4. Inicializar banco de dados
Para inicializar o banco de dados de desenvolvimento:
```bash
npm run dev:db:up
```

Obs.: Caso deseje desligar o banco de dados de produção executar o seguinte comando:

```bash
npm run dev:db:down
```

### 5. Rodar migrações
```
npm run prisma:migrate
```
:bulb: Só é necessário rodar o comando de aplicar migrações caso sejam criadas outras ou o banco de desenvolvimento seja resetado.

### 6. Inicializar aplicação
```bash
npm run dev:app:run
```

:star: Pronto!
