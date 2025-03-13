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

## API Endpoints

### Authentication

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/auth/login` | POST | User login | `{ username, password }` | `{ access_token }` |
| `/auth/register` | POST | User registration | `{ username, password, email, role, permissions }` | User object |
| `/auth/logout` | POST | User logout | `{ username, access_token }` | Success message |

### Users

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|---------------------|----------|
| `/users` | GET | Get all users | - | Array of users |
| `/users/:id` | GET | Get user by ID | ID in URL | User object |
| `/users` | POST | Create a new user | User data | Created user object |
| `/users/:id` | PATCH | Update a user | ID in URL, user data in body | Updated user object |
| `/users/:id` | DELETE | Remove a user | ID in URL | - |

### Documents

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|---------------------|----------|
| `/documents` | GET | Get all documents | Query params for pagination | Array of documents |
| `/documents/:id` | GET | Get document by ID | ID in URL | Document object |
| `/documents` | POST | Create a new document | Document metadata | Created document object |
| `/documents/:id` | PATCH | Update a document | ID in URL, document data in body | Updated document object |
| `/documents/:id` | DELETE | Remove a document | ID in URL | - |

### Ingestion

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|---------------------|----------|
| `/ingestion` | POST | Start document ingestion | File data | Ingestion status |
| `/ingestion/status/:id` | GET | Get ingestion status | ID in URL | Status object |
| `/ingestion/cancel/:id` | GET | Cancel ingestion | ID in URL | Updated status |
| `/ingestion/pause/:id` | GET | Pause ingestion | ID in URL | Updated status |
| `/ingestion/resume/:id` | GET | Resume ingestion | ID in URL | Updated status |
| `/ingestion/retry/:id` | GET | Retry ingestion | ID in URL | Updated status |
| `/ingestion/embedding/:id` | GET | Get document embedding | ID in URL | Embedding data |

## Services

### AuthService
Handles user authentication, token generation, and registration.
- `validateUser()`: Validates user credentials
- `login()`: Authenticates users and returns JWT token
- `register()`: Creates new user accounts with hashed passwords
- `logout()`: Logs out users

### UsersService
Manages user accounts and operations.
- `findOneByUsername()`: Finds a user by username
- `create()`: Creates a new user
- `findAll()`: Retrieves all users
- `findOne()`: Finds a user by ID
- `update()`: Updates user information
- `remove()`: Deletes a user

### DocumentsService
Handles document operations.
- `create()`: Creates a new document record
- `findAll()`: Retrieves all documents
- `findOne()`: Finds a document by ID
- `update()`: Updates document information
- `remove()`: Deletes a document
- `findAllPaginated()`: Gets documents with pagination

### IngestionService
Manages document ingestion workflow.
- `ingestData()`: Initiates document ingestion
- `getIngestionStatus()`: Checks ingestion status
- `cancelIngestion()`: Cancels an ongoing ingestion
- `pauseIngestion()`: Pauses an ingestion process
- `resumeIngestion()`: Resumes a paused ingestion
- `retryIngestion()`: Retries a failed ingestion
- `getDocumentEmbedding()`: Retrieves document embeddings

## Authentication Flow

1. **Registration**: Users register with username/password and are assigned roles and permissions
2. **Login**: Users authenticate to receive a JWT token
3. **Authorization**: Protected endpoints require a valid JWT token in the Authorization header
4. **Roles & Permissions**: Different user roles have different access levels

## File Upload Process

1. Create a new document record with metadata
2. Upload the file to the ingestion service
3. The ingestion service processes the file and stores it in MinIO
4. The document is now available for retrieval

## MinIO Integration

Doc Man uses MinIO for object storage:
- All files are stored in MinIO buckets
- Files are referenced by their object IDs in the document records
- The API handles retrieval from MinIO transparently

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

## Example API Requests

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Upload Document
```bash
curl -X POST http://localhost:3000/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName": "example.pdf", "fileType": "application/pdf"}'
```

### Retrieve Documents (Paginated)
```bash
curl -X GET "http://localhost:3000/documents?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

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

## License

[UNLICENSED]
