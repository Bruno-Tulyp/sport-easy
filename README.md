# README

## Prerequisites

Make sure you have the following installed on your machine:

- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

## Getting Started

### 1. Configure environment variables

Copy the example environment file and update it with your own values:

```bash
cp .env.example .env
```

### 2. Install dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### 3. Start the database services

Run the Docker containers:

```bash
docker compose up -d
```

### 4. Run database migrations

Apply the database migrations:

```bash
pnpm db:migrate
```

If you want to reset the database, run migrations, and seed the database with initial data, use:

```bash
pnpm db:reset
```

### 5. Start the development server

Start the application:

```bash
pnpm dev
```

By default, the application will be available at [http://localhost:3000](http://localhost:3000).
