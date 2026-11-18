# Docker Setup for OBF Automation API

This document provides instructions for running the OBF Automation API using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Configuration

The default configuration is set in the `docker-compose.yml` file. You can modify environment variables there or create a `.env` file based on `.env.example` to override those values.

### 2. Building and Starting the Containers

```bash
# Build and start all containers in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f app
```

### 3. Accessing the Services

- **API:** The Node.js backend API is available at http://localhost:3000
- **PostgreSQL:** The database is available at localhost:5432
- **pgAdmin:** The pgAdmin interface is available at http://localhost:5050
  - Email: admin@example.com
  - Password: admin

### 4. Stopping the Containers

```bash
# Stop all containers
docker-compose down

# Stop all containers and remove volumes (this will delete all data)
docker-compose down -v
```

## Database Migrations

Migrations are automatically run when the container starts. If you need to run them manually:

```bash
# Access the container shell
docker-compose exec app sh

# Run migrations manually
node dist/database/migrate.js
```

## Container Information

- **app**: Node.js backend application
- **db**: PostgreSQL database 
- **pgadmin**: pgAdmin web interface for database management

## Data Persistence

Database data is stored in the `postgres_data` volume, which persists even when containers are stopped or removed (unless you use `docker-compose down -v`).

## Troubleshooting

### Container fails to start

Check the logs for errors:

```bash
docker-compose logs app
```

### Database connection issues

Make sure the database is running:

```bash
docker-compose ps
```

If needed, restart the containers:

```bash
docker-compose restart
``` 