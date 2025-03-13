# Doc Man - Document Management System

A comprehensive document management system built with NestJS, PostgreSQL, and MinIO for efficient document storage and retrieval.

## Project Overview

Doc Man is a full-featured document management system that allows for:
- User management with role-based access control
- Document storage and retrieval
- Integration with MinIO for object storage
- RESTful API for document operations

## Technologies Used

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL
- **Object Storage**: MinIO
- **API Documentation**: Swagger
- **Authentication**: JWT
- **ORM**: TypeORM
- **Testing**: Jest
- **Containerization**: Docker

## Project Structure

The project consists of several services:

1. **API Service**: Main application backend (NestJS)
2. **Ingestion Mock**: Service for simulating document ingestion
3. **MinIO**: Object storage service for document files
4. **PostgreSQL**: Database for storing metadata and user information

## Prerequisites

- Docker and Docker Compose
- Node.js (v20+)
- Yarn package manager

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd doc-man
   yarn install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` (if not already present)
   - Update the values as needed

4. seed the admin user:
   ```bash
   yarn seed
   ```

5. Start the development server:
   ```bash
   yarn start:dev
   ```

### Using Docker

1. Make sure Docker and Docker Compose are installed
2. Build and start all services:
   ```bash
   cd doc-man
   docker compose up --build
   ```
3. Once the doc Man API container is completely up add the seeding data in docker container
   ```bash
   cd doc-man
   docker exec -it <container_id> sh
   yarn seed
   exit
   ```
3. The API will be available at http://localhost:3000

## Available Commands

```bash
# Development
yarn start:dev     # Start the application in development mode with hot-reload

# Production
yarn build         # Build the application for production
yarn start:prod    # Start the application in production mode

# Testing
yarn test          # Run unit tests
yarn test:e2e      # Run end-to-end tests
yarn test:cov      # Generate test coverage report

# Database
yarn seed          # Run database seed scripts
```

## Environment Variables

Configuration is managed through the `.env` file:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: PostgreSQL credentials
- `DB_HOST`, `DB_PORT`, etc.: Database connection details
- `PORT`: API service port (default: 3000)
- `JWT_SECRET`, `JWT_EXPIRES_IN`: JWT authentication configuration
- `MICROSERVICE_PORT`, `MICROSERVICE_HOST`: Microservice configuration

## User Roles and Permissions

The system supports multiple user roles:
- **Admin**: Full system access
- **User**: Standard access
- **Guest**: Limited access
- **Viewer**: Read-only access
- **Editor**: Can edit documents

Permissions include:
- Create
- Read
- Update
- Delete
- All

## Troubleshooting

### Common Docker Issues

If you encounter the error `Error: getaddrinfo ENOTFOUND hostname`, ensure that:
- The service name in DB_HOST matches the service name in docker-compose.yml
- All services are properly networked in docker-compose.yml

### Database Connection Issues

If you have problems connecting to the database:
1. Check that PostgreSQL service is running
2. Verify the database credentials in the `.env` file
3. Ensure the DB_HOST is set to 'postgres' when running with Docker

## API Documentation

When the application is running, you can access the Swagger API documentation at:
http://localhost:3000/api
