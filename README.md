# Postpress
## A Blogging API

[![Coverage Status](https://coveralls.io/repos/github/bmviniciuss/postpress/badge.svg?branch=main)](https://coveralls.io/github/bmviniciuss/postpress?branch=main)

1. :gear: Executando Projeto
   1. [Desenvolvimento](./docs/installation-dev.md)
   2. [Produção](./docs/installation-prod.md)
2. Features

## 2. :sparkles: Features
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

---
Feito com :red_heart: por Vinicius Barbosa :wave: [Entre em contato!](https://www.linkedin.com/in/bmviniciuss/)




