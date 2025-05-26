# To-Do App

Este é um aplicativo de lista de tarefas (To-Do App) desenvolvido com **React** no frontend e **Laravel** no backend. Ele permite que os usuários gerenciem suas tarefas, incluindo criação, edição, exclusão, ordenação e filtragem.

---

## Funcionalidades

### Autenticação:

- Registro, login e logout de usuários utilizando Laravel Sanctum.

### Gerenciamento de Tarefas:

- Criação, edição e exclusão de tarefas.
- Marcar tarefas como concluídas ou pendentes.
- Ordenação por título, data de criação ou prazo.
- Filtragem por tarefas concluídas, pendentes ou todas.

### Interface Responsiva:

- Estilização com Pico CSS para uma interface simples e moderna.

---

## Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca para construção da interface do usuário.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **Axios**: Cliente HTTP para comunicação com o backend.
- **React Icons**: Ícones para melhorar a interface.
- **Pico CSS**: Framework CSS minimalista.

### Backend

- **Laravel**: Framework PHP para construção da API.
- **Laravel Sanctum**: Gerenciamento de autenticação e tokens CSRF.
- **MySQL**: Banco de dados relacional para armazenamento das tarefas.

---

## Pré-requisitos

- Node.js (versão 16 ou superior)
- PHP (versão 8.1 ou superior)
- Composer
- MySQL
- Git

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://seu-repositorio.git
```

### 2. Configuração do Backend

```bash
cd backend
composer install
cp .env.example .env
```

- Configure as variáveis de ambiente no arquivo .env, como conexão com o banco de dados e domínio.
- Gere a chave da aplicação:

```bash
php artisan key:generate
```

- Execute as migrações:

```bash
php artisan migrate
```

- Inicie o servidor:

```bash
php artisan serve
```

### 3. Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

## Uso

Acesse o frontend no navegador (geralmente em `http://localhost:5173`).

Registre-se ou faça login.

Gerencie suas tarefas:

- Adicione novas tarefas.
- Edite ou exclua tarefas existentes.
- Marque tarefas como concluídas ou pendentes.
- Use os filtros e ordenações para organizar suas tarefas.

---
