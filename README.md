# Postpress
## A Blogging API

[![Coverage Status](https://coveralls.io/repos/github/bmviniciuss/postpress/badge.svg?branch=main)](https://coveralls.io/github/bmviniciuss/postpress?branch=main)

1. Executando Projeto
   1. [Desenvolvimento](./docs/installation-dev.md)
   2. [Produção](./docs/installation-prod.md)
2. Rotas

## 2. Rotas Implementadas
### Documentação
> `/docs`

Documentação das rotas da api pelo Swagger. 

### Autenticação
> POST `/login`

### Usuário
> POST `/user`

Cadastro de novo usuário.

> GET `/user`

Busca todos os usuários.

> GET `/user/:userId`

Busca um usuário pelo id.

> DELETE `/users/me`

Deleta o usuário que está autenticado.
Caso o possua posts eles tambem são apagados.

### Post
> POST `/post`

Criação de novos posts.

> GET `/post`

Lista todos os posts

> GET `/post/:postId`

Busca um post pelo id.

> PUT `/post/:postId`

Atualiza titulo e conteudo de um post.

> DELETE `/post/:postId`

> GET `post/search?q=searchTerm`

Realiza busca de posts por titulo ou conteudo.

---
Feito com :red_heart: por Vinicius Barbosa :wave: [Entre em contato!](https://www.linkedin.com/in/bmviniciuss/)




