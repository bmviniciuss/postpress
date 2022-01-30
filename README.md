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

- :toolbox: Executando Projeto
  - [Desenvolvimento](./docs/installation-dev.md)
  - [Produção](./docs/installation-prod.md)
- [:sparkles: Features](#sparkles--features)
- [:gear: Sobre Desenvolvimento](#-gear--sobre-desenvolvimento)
- [:test_tube: Testes](#-test-tube--testes)
  - [Execução de testes](#execu--o-de-testes)
    - [Unitários](#unit-rios)
    - [Integração](#integra--o)
    - [Coverage report](#coverage-report)

## sparkles: Features
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
Feito com :red_heart: por Vinicius Barbosa :wave: [Entre em contato!](https://www.linkedin.com/in/bmviniciuss/)




