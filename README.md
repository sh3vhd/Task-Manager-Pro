# Task Manager Pro

Полнофункциональная система управления задачами в стиле Trello/Notion.

## Стек
- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js (Express)
- **DB**: PostgreSQL + Prisma ORM
- **Auth**: JWT (access + refresh), refresh в httpOnly cookie

## Возможности
- Регистрация/вход/выход, обновление access token
- CRUD задач (заголовок, описание)
- Теги/категории задач (#tag)
- Статусы: To Do / In Progress / Done (канбан)
- Фильтр и сортировка

## Быстрый старт
1. Установить зависимости
   ```bash
   npm run install-all
   ```
2. Скопировать `server/.env.example` → `server/.env` и заполнить переменные:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager_pro?schema=public"
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CLIENT_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   ```
3. Миграции Prisma
   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Запуск
   - Бэкенд: `npm run server` (из корня) или `cd server && npm run dev`
   - Фронтенд: `npm run dev` (из корня) или `cd client && npm run dev`

## API
```
/api/health            GET
/api/auth/register     POST
/api/auth/login        POST
/api/auth/refresh      POST
/api/auth/logout       POST

/api/tasks             GET, GET/:id, POST, PUT/:id, DELETE/:id
```

## Заметки
- В проде включите HTTPS и `secure: true` у cookie.
- Prisma Studio: `npm --prefix server run prisma:studio`.

---

# Task Manager Pro (English)

Full-featured task management app in Trello/Notion style.

## Stack
- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js (Express)
- **DB**: PostgreSQL + Prisma ORM
- **Auth**: JWT (access + refresh) with httpOnly refresh cookie

## Features
- Sign up / Sign in / Sign out, token refresh
- Full task CRUD
- Tags / categories
- Status columns: To Do / In Progress / Done
- Filtering & sorting

## Quick Start
1. Install deps
   ```bash
   npm run install-all
   ```
2. Configure env (`server/.env`):
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager_pro?schema=public"
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CLIENT_URL=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173
   ```
3. Prisma migrations
   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Run
   - Backend: `npm run server` (from root) or `cd server && npm run dev`
   - Frontend: `npm run dev` (from root) or `cd client && npm run dev`

## API
```
/api/health            GET
/api/auth/register     POST
/api/auth/login        POST
/api/auth/refresh      POST
/api/auth/logout       POST

/api/tasks             GET, GET/:id, POST, PUT/:id, DELETE/:id
```

## Notes
- Enable HTTPS and `secure: true` on cookies in production.
- Prisma Studio: `npm --prefix server run prisma:studio`.
