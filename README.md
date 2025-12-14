# QRED - Credit Card Management System

A comprehensive Node.js + TypeScript REST API for managing credit cards, companies, transactions, and invoices with full Prisma ORM integration.

## 📁 Project Structure

```
qred/
├── src/
│   ├── controllers/              # Express request handlers
│   │   ├── companyController.ts
│   │   ├── cardController.ts
│   │   ├── transactionController.ts
│   │   └── invoiceController.ts
│   ├── services/                 # Business logic & database operations
│   │   ├── companyService.ts
│   │   ├── cardService.ts
│   │   ├── transactionService.ts
│   │   └── invoiceService.ts
│   ├── models/
│   │   └── overview.ts
│   ├── routes/                   # API route definitions
│   │   ├── companyRoutes.ts
│   │   ├── cardRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   ├── invoiceRoutes.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── helpers.ts           # Utility functions
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server entry point
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── dist/                        # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## ✨ Features

- **Modular Architecture**: Separation of concerns with controllers, services, and routes
- **TypeScript**: Full type safety with strict type checking
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Express.js**: Modern web framework for Node.js
- **Service Layer**: Business logic separated from HTTP handlers
- **Data Validation**: Input validation in services
- **Error Handling**: Comprehensive error handling across all layers
- **Card Masking**: Security feature to mask card numbers in responses
- **Automatic Invoice Generation**: Auto-generates invoices based on monthly transactions
- **Enum Validation**: Type-safe status fields (CardStatus, CardBrand, CardTier, TransactionStatus, InvoiceStatus)
- **Relationship Management**: Proper data relationships with Prisma relations

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript ^5.1.3
- **Web Framework**: Express.js ^4.18.2
- **ORM**: Prisma ^5.22.0
- **Database**: PostgreSQL
- **Environment**: dotenv ^16.0.3
- **Build Tool**: TypeScript Compiler (tsc)

## 📋 API Endpoints

### Company Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies |
| GET | `/api/companies/:id` | Get company by ID |
| GET | `/api/companies/:id/overview` | Get company overview with card and transaction summary |
| POST | `/api/companies` | Create new company |

### Card Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | Get all cards |
| GET | `/api/cards/:id` | Get card by ID |
| POST | `/api/cards` | Create new card |
| PATCH | `/api/cards/:id` | Update card status |

### Transaction Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get transaction by ID |
| GET | `/api/cards/:id/transactions` | Get transactions by card ID |
| POST | `/api/transactions` | Create new transaction |

### Invoice Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| GET | `/api/invoices/:id` | Get invoice by ID |
| GET | `/api/cards/:id/invoice` | Get due invoice for card |
| POST | `/api/invoices` | Generate new invoice |
| PATCH | `/api/invoices/:id` | Update invoice status |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## 🔧 Installation

### Prerequisites
- Node.js v18+
- PostgreSQL running locally on port 5432
- OR Docker & Docker Compose (for containerized setup)

### Local Setup

1. **Clone the repository**
   ```bash
   cd qred
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database credentials:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qred"
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

### Docker Setup

Run the application with PostgreSQL using Docker Compose:

**Start containers (development mode)**
```bash
docker compose up
```

**Start containers in background**
```bash
docker compose up -d
```

**Rebuild and start**
```bash
docker compose up --build
```

**Stop containers**
```bash
docker compose down
```

**View logs**
```bash
docker compose logs -f qred-app
```

**Access the application**
- API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`
- Database credentials: `postgres:postgres`

The `docker-compose.yml` includes:
- PostgreSQL 16 with persistent volume
- Node.js development environment with hot-reload
- Automatic Prisma client generation on startup
- Health checks for database readiness

## 📝 Running the Application

### Development Mode
```bash
npm run dev
```
Runs with ts-node for hot-reloading on file changes.

### Build for Production
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server
```bash
npm run start
```
Runs the compiled JavaScript from the `dist/` directory.

### Database Management

**Generate Prisma Client after schema changes**
```bash
npm run prisma:generate
```

**Create and apply a new migration**
```bash
npm run prisma:migrate
```

**Deploy existing migrations (production)**
```bash
npm run prisma:migrate:deploy
```

**Reset database (⚠️ deletes all data)**
```bash
npm run prisma:migrate:reset
```

**Open Prisma Studio (GUI database browser)**
```bash
npm run prisma:studio
```

## 📊 Data Models

### Company
```typescript
{
  id: string (UUID)
  name: string
  createdAt: DateTime
  updatedAt: DateTime
  cards: Card[]
}
```

### Card
```typescript
{
  id: string (UUID)
  companyId: string (FK)
  company: Company
  cardNumber: string (masked in responses)
  limit: Decimal
  expiryMonth: number
  expiryYear: number
  status: CardStatus (Activate, Blocked, Expired, Pending)
  brand: CardBrand (Master, Visa)
  tier: CardTier (Gold, Silver, Platinum)
  transactions: Transaction[]
  invoices: Invoice[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Transaction
```typescript
{
  id: string (UUID)
  cardId: string (FK)
  card: Card
  amount: Decimal
  vendor: string
  status: TransactionStatus (Posted, Declined, Refunded)
  invoiceId: string (FK, optional)
  invoice: Invoice
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Invoice
```typescript
{
  id: string (UUID)
  cardId: string (FK)
  card: Card
  transactions: Transaction[]
  invoiceStartDate: DateTime
  invoiceEndDate: DateTime
  invoiceDueDate: DateTime
  totalAmount: Decimal
  mindueAmount: Decimal
  invoiceStatus: InvoiceStatus (Due, Paid, Pending)
  createdAt: DateTime
}
```

## 🔐 Security Features

- **Card Number Masking**: Card numbers are masked in API responses for security
- **Type Safety**: TypeScript prevents runtime type errors
- **Validation**: Input validation in service layer
- **Error Handling**: Sensitive error details not exposed to clients

## 📚 Example API Requests

### Create Company
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp"
  }'
```

### Get Company Overview
```bash
curl -X GET http://localhost:3000/api/companies/:id/overview \
  -H "Content-Type: application/json"
```

### Create Card
```bash
curl -X POST http://localhost:3000/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "uuid-here",
    "cardNumber": "4532123456789012",
    "limit": "5000",
    "expiryMonth": 12,
    "expiryYear": 2026,
    "status": "Activate",
    "brand": "Visa",
    "tier": "Gold"
  }'
```

### Create Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "uuid-here",
    "amount": "150.50",
    "vendor": "Amazon",
    "status": "Posted"
  }'
```

### Generate Invoice
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "uuid-here"
  }'
```

## 🐛 Troubleshooting

**Port already in use**
- Change the port in `src/server.ts`

**Database connection error**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database credentials are correct

**Prisma errors**
- Run `npm run prisma:generate` after schema changes
- Run `npm run prisma:migrate` to sync database

**TypeScript errors**
- Run `npm run build` to check for compilation errors
- Ensure all types are properly imported

## 📄 License

MIT
