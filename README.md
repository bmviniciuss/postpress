<h1 align="center">
  Postpress
</h1>
<h3 align="center">Uma api de blogging construída utilizando Typescript, Prisma, Postgres e TDD. </h3>


<div align="center">
  <a href="https://github.com/bmviniciuss/postpress/actions/workflows/ci.yml">
    <img src="https://github.com/bmviniciuss/postpress/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://coveralls.io/github/bmviniciuss/postpress?branch=main">
    <img src="https://coveralls.io/repos/github/bmviniciuss/postpress/badge.svg?branch=main">
  </a>
</div>

- [:toolbox: Executando Projeto](#toolbox-executando-projeto)
  - [:rocket: Como executar o projeto em modo **desenvolvimento**](#rocket-como-executar-o-projeto-em-modo-desenvolvimento)
    - [1. Clonar repositório](#1-clonar-repositório)
    - [2. Definir variáveis de ambiente](#2-definir-variáveis-de-ambiente)
    - [3. Instalar dependências](#3-instalar-dependências)
    - [4. Inicializar banco de dados](#4-inicializar-banco-de-dados)
    - [5. Rodar migrações](#5-rodar-migrações)
    - [6. Inicializar aplicação](#6-inicializar-aplicação)
- [:sparkles: Features](#sparkles-features)
- [:gear: Sobre Desenvolvimento](#gear-sobre-desenvolvimento)
- [:test_tube: Testes](#test_tube-testes)
  - [Execução de testes](#execução-de-testes)
    - [Unitários](#unitários)
    - [Integração](#integração)
    - [Coverage report](#coverage-report)

## :toolbox: Executando Projeto
### :rocket: Como executar o projeto em modo **desenvolvimento**
Para rodar a aplicação em modo desenvolvimento é necessário ter instalado em sua máquina o Node, NPM, Docker e Docker Compose (ou postgres instalado e rodando).

#### 1. Clonar repositório
Clonar o repositório

```bash
git clone https://github.com/bmviniciuss/postpress
```

#### 2. Definir variáveis de ambiente
Usar o arquivo `.env.dev` como exemplo e criar um arquivo .env na raiz do projeto:

```env
DATABASE_URL="postgresql://user:pass@localhost:15432/postpress-dev?schema=public"
POSTGRES_USER='user'
POSTGRES_PASSWORD='password'
JWT_SECRET="super secret pass"
SALT_NUMBER=10
```
Obs.: Como é um arquivo de desenvolvimento local, observar que o endereço do banco é `localhost:15432` e não `db` como o .env de produção mostrado acima.

#### 3. Instalar dependências
```bash
npm install
```

#### 4. Inicializar banco de dados
Para inicializar o banco de dados de desenvolvimento:
```bash
npm run dev:db:up
```

Obs.: Caso deseje desligar o banco de dados de produção executar o seguinte comando:

```bash
npm run dev:db:down
```

#### 5. Rodar migrações
```
npm run prisma:migrate
```
:bulb: Só é necessário rodar o comando de aplicar migrações caso sejam criadas outras ou o banco de desenvolvimento seja resetado.

#### 6. Inicializar aplicação
```bash
npm run dev:app:run
```

:star: Pronto!

- [Ambiente de Produção](./docs/installation-prod.md)

---

## :sparkles: Features
- [x] Documentação via Swagger na rota `/docs`.
- [x] User
  - [x] Cadastro de usuário `POST /user`
  - [x] Listagem de usuários `GET /user`
  - [x] Busca de usuário por id `GET /user/:userId`
  - [x] Remoção de usuário `DELETE /users/me`
- [x] Login de usuários `POST /login`
- [x] Post
  - [x] Criação de post `POST /post`
  - [x] Listagem de posts `GET /post`
  - [x] Busca de post por id `GET /post/:postId`
  - [x] Atualização de post `PUT /post/:postId`
  - [x] Remoção de post `DELETE /post/:postId`
  - [x] Busca de post por titulo ou conteudo `GET /post/search?q=searchTerm`

## :gear: Sobre Desenvolvimento
A api do Postpress foi construída em Node e Typescript utilizando um banco de dados Postgres.
Para realizar a comunicação da api com o banco de dados e gerenciar *schemas* e *migrations* foi utiliado o ORM Prisma, que através do [arquivo](./prisma/schema.prisma) de schema escrito na [PSL (*Prisma Schema Language*)](https://www.prisma.io/docs/concepts/components/prisma-schema) cria os modelos tipados e migrações necessárias. O código tem influências da arquitetura limpa tentando separar e restringir as resposabilidates nas camadas e nos principios do SOLID. Além de ter seu desenvolvimento baseado em testes.

Algumas das dependências utilizadas no desenvolvimento da aplicação:
- [Typescript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Express](http://expressjs.com/)
- [Jest](https://jestjs.io/)
- [Swagger](https://swagger.io/)

## :test_tube: Testes
O desenvolvimento da aplicação foi realizado com testes unitários e de integração utilizando o framework [Jest](https://jestjs.io/).
Foram utilizando alguns utilitários como o [jest-mock-extended](https://www.npmjs.com/package/jest-mock-extended), faker e 
[factory-maker](https://www.npmjs.com/package/factory-maker).

### Execução de testes
A execução de testes da api está apenas disponível no ambiente de desenvolvimento local, sendo necessário instalar as dependências localmente, 
como explicado no tópico 1.1.

Temos dois tipos de testes (unitários e integração) que necessitam de setups diferentes, eles foram
divididos em dois tipos de arquivos. Arquivos com terminações `.spec.ts` especificam testes unitários de um componente,
já arquivos com terminações `.test.ts` indicam testes de integração de um componente.

#### Unitários
Para executar os testes unitários execute o seguinte comando:
```bash
npm run test:unit
```
Para executar em modo `watch`:
```bash
npm run test:unit -- --watch
```

---

#### Integração
Para executar os testes utilizar o seguinte comando:
```bash
npm run test:integration
```

Esse comando ira subir uma instância de um banco de dados postgres exclusivo para testes,
aplicará as migrations no banco de dados e executará os testes de integração.

Para executar em modo `watch`:
```bash
npm run test:integration -- --watch
```

Para desligar a instância do banco de dados de teste, rode o comando a seguir:
```bash
npm run test:docker:down
```

---

#### Coverage report
Para executar todos os testes e gerar o coverage report, rode o seguinte comando:
```bash
npm run test:ci:local
```
Esse comando ira subir uma instância de um banco de dados postgres exclusivo para testes,
aplicará as migrations no banco de dados e executará todos os testes e irá gerar o coverage report
e por fim desliga a instância do banco de teste.

---
Feito com :heart: por Vinicius Barbosa :wave: [Entre em contato!](https://www.linkedin.com/in/bmviniciuss/)




