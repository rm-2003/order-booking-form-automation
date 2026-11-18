# OBF (Order Booking Form) Management System

A full-stack application for managing Order Booking Forms with approval workflows, user management, and financial calculations.

## About the Project

This Order Booking Form (OBF) Management System was developed for Mahindra Logistics Limited (MLL) to streamline and automate their project cost calculations, approvals, and financial management processes. Previously, this entire process was managed through Excel spreadsheets, which posed several challenges:

- Risk of data loss due to local file storage
- Difficulty in collaboration between team members
- Version control issues with multiple copies of spreadsheets
- Time-consuming manual calculations and validations
- Limited visibility into project status and approvals

The new cloud-based system addresses these challenges by providing:

- Centralized cloud storage for all OBF data
- Real-time collaboration between team members
- Automated calculations and validations
- Standardized templates and workflows
- Comprehensive audit trails
- Better visibility into project status

The system helps MLL teams to:

- Create and manage Order Booking Forms with standardized templates
- Calculate project costs including manpower, CAPEX, OPEX, and rental expenses
- Track revenue and financial metrics
- Manage approval workflows with configurable thresholds
- Maintain master data for various cost components
- Generate comprehensive financial reports

The system is designed to improve efficiency, reduce manual errors, and provide better visibility into project financials across different verticals including:
- Auto and Engineering
- E-Commerce
- Transportation
- Enterprise Mobility
- Distribution/EDSP/OXD/XL
- And other MLL business units

## Architecture Overview

The application follows a modern microservices architecture with the following components:

### Frontend
- Next.js 14 (React) application
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components
- Authentication using JWT

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Sequelize ORM
- JWT authentication
- Docker containerization

## Directory Structure

```
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── obf/            # OBF management pages
│   │   │   ├── [id]/       # Dynamic OBF pages
│   │   │   │   ├── input/  # Input sheet
│   │   │   │   ├── working/# Working sheet
│   │   │   │   └── final/  # Final output
│   │   └── users/          # User management pages
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility functions and configurations
│   └── public/            # Static assets
│
├── node_backend/           # Express backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── database/      # Database migrations and models
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── tests/             # Backend tests
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (admin only)
- `POST /api/auth/logout` - User logout

### OBF Management
- `GET /api/obf` - Get all OBFs
- `GET /api/obf/:id` - Get single OBF
- `POST /api/obf` - Create new OBF
- `PUT /api/obf/:id` - Update OBF
- `DELETE /api/obf/:id` - Delete OBF

### OBF Input Sheet
- `GET /api/obf/:id/input` - Get input sheet data
- `POST /api/obf/:id/input` - Update input sheet data

### OBF Working Sheet
- `GET /api/obf/:id/revenue` - Get revenue data
- `POST /api/obf/:id/revenue` - Update revenue data
- `GET /api/obf/:id/ba-rates` - Get BA rates
- `POST /api/obf/:id/ba-rates` - Update BA rates
- `GET /api/obf/:id/direct-expenses` - Get direct expenses
- `POST /api/obf/:id/direct-expenses` - Update direct expenses
- `GET /api/obf/:id/financial-metrics` - Get financial metrics
- `POST /api/obf/:id/financial-metrics` - Update financial metrics

### OBF Cost Breakup
- `GET /api/cost-breakup/:obfId/manpower` - Get manpower breakup
- `POST /api/cost-breakup/:obfId/manpower` - Update manpower breakup
- `GET /api/cost-breakup/:obfId/opex` - Get OPEX breakup
- `POST /api/cost-breakup/:obfId/opex` - Update OPEX breakup
- `GET /api/cost-breakup/:obfId/rental` - Get rental breakup
- `POST /api/cost-breakup/:obfId/rental` - Update rental breakup
- `GET /api/cost-breakup/:obfId/pre-go-live-manpower` - Get pre-go-live manpower
- `POST /api/cost-breakup/:obfId/pre-go-live-manpower` - Update pre-go-live manpower

### Master Data
- `GET /api/masters/manpower` - Get manpower master data
- `POST /api/masters/manpower` - Update manpower master data
- `GET /api/masters/capex` - Get CAPEX master data
- `POST /api/masters/capex` - Update CAPEX master data
- `GET /api/masters/opex` - Get OPEX master data
- `POST /api/masters/opex` - Update OPEX master data
- `GET /api/masters/rental` - Get rental master data
- `POST /api/masters/rental` - Update rental master data
- `GET /api/masters/thresholds` - Get approval thresholds
- `POST /api/masters/thresholds` - Update approval thresholds

### OBF Approval Flow
- `POST /api/obf/:id/validate` - Validate OBF against thresholds
- `POST /api/obf/:id/start-approval` - Start approval process
- `POST /api/obf/:id/approve` - Approve OBF
- `POST /api/obf/:id/reject` - Reject OBF
- `GET /api/obf/:id/approval-status` - Get approval status

### Notifications
- `GET /api/obf/notifications` - Get user notifications
- `POST /api/obf/notifications/:id/read` - Mark notification as read

### File Upload
- `POST /api/file-upload` - Upload and process Excel file
- `GET /api/file-upload/template/:type` - Download template file

## Frontend Routes

### Authentication
- `/login` - Login page
- `/auth/callback` - OAuth callback handler
- `/auth/google` - Google OAuth login
- `/auth/microsoft` - Microsoft OAuth login

### OBF Management
- `/` - Dashboard with OBF list
- `/obf/new` - Create new OBF
- `/obf/[id]` - OBF details page
- `/obf/[id]/input` - Input sheet
- `/obf/[id]/working` - Working sheet
- `/obf/[id]/final` - Final output

### User Management
- `/users` - User management (admin only)

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker and Docker Compose (for containerized deployment)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd node_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

4. Update the environment variables in `.env`

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXT_PUBLIC_SSO_CLIENT_ID=your_sso_client_id
   NEXT_PUBLIC_SSO_SERVER_URL=your_sso_server_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Deployment

### Using Docker Compose
1. Navigate to the project root:
   ```bash
   cd node_backend
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

### Manual Docker Deployment
1. Build the backend image:
   ```bash
   cd node_backend
   docker build -t obf-backend .
   ```

2. Build the frontend image:
   ```bash
   cd frontend
   docker build -t obf-frontend .
   ```

3. Run the containers:
   ```bash
   docker run -d -p 3001:3001 obf-backend
   docker run -d -p 3000:3000 obf-frontend
   ```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=obf_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SSO_CLIENT_ID=your_sso_client_id
NEXT_PUBLIC_SSO_SERVER_URL=your_sso_server_url
```

## Development

### Running Tests
```bash
# Backend tests
cd node_backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style
The project uses ESLint and Prettier for code formatting. Run:
```bash
npm run lint
npm run format
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.