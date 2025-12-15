# QRED - Assignment«

A TypeScript + Express REST API for managing credit cards, companies, transactions, and invoices using Prisma ORM and PostgreSQL.

## 🚀 Tech Stack

- **Node.js** + **TypeScript** ^5.1.3
- **Express.js** ^4.18.2
- **Prisma** ^5.22.0
- **PostgreSQL** (local or Docker)
- **Testing**: Mocha, Chai, Sinon

## 📋 Prerequisites

- Node.js v18+
- PostgreSQL running on port 5432
- Database - qred, qred_test required to run the tests locally
- Docker & Docker Compose

## Implementation scope and improvements
Scope: Only the endpoints necessary for the assignment were implemented.

Limitations: Full CRUD operations (e.g., update and delete) are not covered for every service.

Focus: The project prioritizes meeting the assignment’s requirements rather than implementing a complete production-ready API.

Future Work: 
- Additional endpoints could be added later to support full CRUD functionality. 
- Current payload validation is limited, which could be done extensively in future to validate the payloads. 
- Improved Error handling
- Authentication and Authorization
- Separate internal endpoints from public API endpoints.
- Add more test for better coverage. Only basic unit testing and integration testing focusing on overview is implemented to  showcase how unit and integration testing can be implemented to test the controller and service.
- Integrate frameworks like Pino for better logging, Linting for maiting coding standards.

## 📋 API Endpoints

### Company Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies |
| GET | `/api/companies/:id` | Get company by ID |
| GET | `/api/companies/:id/overview` | Get company overview |
| POST | `/api/companies` | Create company |

### Card Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Get all cards |
| GET | `/api/cards/:id` | Get card by ID |
| POST | `/api/cards` | Create card |
| PATCH | `/api/cards/:id` | Update card status |

### Transaction Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |

### Invoice Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| POST | `/api/invoices` | Generate invoice |
| PATCH | `/api/invoices/:id` | Update invoice status |

## 🔧 Installation

### Local Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and update DATABASE_URL

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### Docker Setup
```bash
# Start with Docker Compose
docker compose up

# Start in background
docker compose up -d

# Stop containers
docker compose down
```

### Run the following command to start the services and seed initial data:
```bash
docker compose up --build
```
- This will automatically seed the database with:
    - Company data
    - Card data
    - Transaction data
- Once seeding is complete, the Company ID will be printed in the logs.
- Copy this Company ID and use it in the API endpoint to quickly test and retrieve the overview response.
  http://localhost:5000/api/companies/{companyId}/overview

## 🌐 Access Application

**Local Setup:**
- API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

**Docker Setup:**
- API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

## 📝 NPM Commands

```bash
npm run dev              # Development mode (ts-node with hot-reload)
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate test coverage report
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create & apply migrations
npm run prisma:studio    # Open Prisma GUI
npm run clean            # Remove dist directory
```

## ✨ Key Features

- TypeScript with strict type checking
- Prisma ORM with PostgreSQL
- Service layer architecture
- Card number masking for security
- Input validation
- Comprehensive error handling
- Unit & integration tests

## 📁 Project Structure

```
src/
├── controllers/          # HTTP request handlers
├── services/            # Business logic
├── routes/              # API routes
├── models/              # TypeScript models
├── lib/                 # Utilities & Prisma client
├── test/                # Test files
├── app.ts               # Express app
└── server.ts            # Server entry point
```

## 🔐 Security

- Card numbers masked in all responses
- Input validation on all endpoints
- Type-safe database operations

