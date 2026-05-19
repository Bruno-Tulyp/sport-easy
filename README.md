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

### 3. Start the development environment

Run the Docker services and start the development server:

```bash
docker compose up -d
pnpm dev
```

By default, the application will be available at [http://localhost:3000](http://localhost:3000).
