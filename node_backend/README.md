# OBF Automation API

This is a Node.js + TypeScript backend for the Order-Booking-Form (OBF) Automation API.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- PostgreSQL
- Supabase
- JWT Authentication
- Winston Logger

## Features

- RESTful API architecture
- TypeScript for type safety and better developer experience
- Sequelize ORM for database operations
- Authentication with JWT
- Excel file processing with xlsx
- Error handling middleware
- Logging with Winston
- Rate limiting

## Project Structure

```
node_backend/
├── src/
│   ├── config/         # Configuration files
│   ├── database/
│   │   ├── migrations/ # Database migrations
│   │   └── seeders/    # Seed data
│   ├── middleware/     # Custom middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # Express routes
│   ├── types/          # TypeScript interfaces and types
│   ├── utils/          # Utility functions
│   └── server.ts       # Main entry point
├── dist/               # Compiled JavaScript files
├── uploads/            # Uploaded files
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your environment variables
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Build the project:
   ```bash
   npm run build
   ```
6. Start the server:
   ```bash
   npm start
   ```

### Development

```bash
# Run in development mode with hot reloading
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

## Docker Setup

For Docker-based setup and deployment, refer to the [Docker documentation](DOCKER.md).

You can quickly start the entire application stack (Node.js backend, PostgreSQL, and pgAdmin) using:

```bash
docker-compose up -d
```

## Database Migrations

The project uses Sequelize migrations to manage database schema changes. Migration files are located in the `src/database/migrations/` directory.

### Running Migrations

To run all pending migrations:

```bash
npm run migrate
```

### Creating New Migrations

To create a new migration:

```bash
npm run migrate:create -- new-migration-name
```

### Reverting Migrations

To undo the most recent migration:

```bash
npm run migrate:undo
```

## API Endpoints

### OBF Routes
- `GET /obf` - Get all OBFs
- `GET /obf/:id` - Get a single OBF
- `POST /obf` - Create a new OBF
- `PUT /obf/:id` - Update an OBF
- `DELETE /obf/:id` - Delete an OBF

### File Upload Routes
- `POST /file-upload` - Upload and process an Excel file

## Environment Variables

See `.env.example` for all required environment variables.

## Database

The application uses Sequelize ORM with PostgreSQL. Models are defined in the `src/models` directory and database tables are created using migrations in the `src/database/migrations` directory.

## License

This project is proprietary and confidential. 