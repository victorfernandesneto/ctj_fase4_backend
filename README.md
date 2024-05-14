## Tech Challenge Fase 4

### Tecnologias utilizadas

[![Node.js](https://img.shields.io/badge/Node.js-20.13.1-green.svg?style=flat-square)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-brightgreen.svg?style=flat-square)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.3-blue.svg?style=flat-square)](https://www.postgresql.org/)

---

### Implementar:


- [x] Uma API RESTful que gerencia as operações de reservas, como adicionar, visualizar e cancelar reservas.
- [x] Conexão com um banco de dados SQL para armazenar informações sobre os espaços disponíveis, horários de reserva e detalhes das reservas.

### Sobre a database:

- [x] Um esquema de banco de dados projetado para armazenar informações sobre os espaços, reservas e **horários disponíveis**.
- [x] Tabelas para espaços (com informações como nome do espaço, capacidade, etc.), reservas (incluindo data, horário e espaço reservado) ~~e, potencialmente, usuários (para futuras funcionalidades de autenticação)~~.

### Funcionalidades-Chave:

- [x] Gestão de Espaços (adicionar, editar, deletar e consultar), considerando que o espaço tenha um nome e um total de lugares (ou seja, capacidade máxima).
- [x] Gestão de Reservas (adicionar, alterar e cancelar), sendo que isso é por espaço, por data e por hora.

### Detalhes adicionais:

- [x] Tempo mínimo de reserva será de 1 hora e o máximo de 8 horas.
- [x] Reservas não podem se sobrepor.
- [x] Não há recorrência nas reservas.

### Extras

- [ ] Ajeitar padronização do nome de variáveis para inglês
- [x] Documentação em Swagger
- [ ] Testes

### Como instalar

- Se atente à versão do Node.js que você utilizar, no repositório foi utilizada a versão 20.13.1.

- Crie um arquivo `.env` na raiz do repositório que deve conter

```
DB_USER='SEU_USUARIO_AQUI'
DB_HOST='SEU_HOST_AQUI' # localhost para testes locais
DB_NAME='NOME_DA_SUA_DATABASE'
DB_PASSWORD='SUA_SENHA_AQUI'
DB_PORT=5432 # porta padrão
```

- Rode o arquivo `populate_db.js` utilizando `node populate_db.js`. Se quiser adicionar dados "fake", descomente a linha 79 do código.

- Rode `app.js` utilizando `node app.js`.
