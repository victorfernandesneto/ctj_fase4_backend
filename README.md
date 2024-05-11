﻿## Tech Challenge Fase 4

### Tecnologias utilizadas

[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-brightgreen.svg?style=flat-square)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.3-blue.svg?style=flat-square)](https://www.postgresql.org/)

---

### Implementar:


- [ ] Uma API RESTful que gerencia as operações de reservas, como adicionar, visualizar e cancelar reservas.

- [ ] Conexão com um banco de dados SQL para armazenar informações sobre os espaços disponíveis, horários de reserva e detalhes das reservas.

### Sobre a database:

- [x] Um esquema de banco de dados projetado para armazenar informações sobre os espaços, reservas e **horários disponíveis**.

- [x] Tabelas para espaços (com informações como nome do espaço, capacidade, etc.), reservas (incluindo data, horário e espaço reservado) ~~e, potencialmente, usuários (para futuras funcionalidades de autenticação)~~.

### Funcionalidades-Chave:

- [ ] Gestão de Espaços (adicionar, editar, deletar e consultar), considerando que o espaço tenha um nome e um total de lugares (ou seja, capacidade máxima).

- [ ] Gestão de Reservas (adicionar, alterar e cancelar), sendo que isso é por espaço, por data e por hora.

### Detalhes adicionais:

- [ ] Tempo mínimo de reserva será de 1 hora e o máximo de 8 horas.

- [ ] Reservas não podem se sobrepor.

- [ ] Não há recorrência nas reservas.
