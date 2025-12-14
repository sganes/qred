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
- OR Docker & Docker Compose

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

