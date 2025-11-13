# Shop Lite Project

A complete e-commerce solution with React frontend and Spring Boot backend.

## Prerequisites

- Java 17 or later
- Docker and Docker Compose (for containerized deployment)
- Node.js and npm (for frontend development)

## Quick Start with Docker

The easiest way to run the application is using Docker:

1. Make sure Docker Desktop is installed and running
2. Open a terminal/command prompt in the project root directory
3. Run the startup script:
   ```
   .\start_application.bat
   ```
   
   Or manually with:
   ```
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

## Manual Development Setup

### Backend (Spring Boot)

If Maven is already installed:

```
cd backend
mvn spring-boot:run
```

If Maven is not installed:

1. Install Maven using the provided script:
   ```
   .\install_maven.bat
   ```
   
2. Restart your terminal/command prompt
   
3. Build and run the backend:
   ```
   cd backend
   mvn clean package
   .\run_backend.bat
   ```

### Frontend (React)

```
cd frontend
npm install
npm start
```

## Default Admin Credentials

- Email: admin@shoplite.com
- Password: admin123

## Key Features

1. User authentication (JWT)
2. Product browsing and search
3. Shopping cart functionality
4. Order placement and tracking
5. Admin dashboard for product and user management

## Project Structure

- `/backend` - Spring Boot API
- `/frontend` - React application
- `/docs` - Documentation

## API Documentation

API documentation is available at http://localhost:8080/swagger-ui.html when the backend is running.