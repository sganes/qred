-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('Activate', 'Blocked', 'Expired', 'Pending');

-- CreateEnum
CREATE TYPE "CardBrand" AS ENUM ('Master', 'Visa');

-- CreateEnum
CREATE TYPE "CardTier" AS ENUM ('Gold', 'Silver', 'Platinum');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Posted', 'Declined', 'Refunded', 'Settled');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Paid', 'Due', 'Overdue');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "limit" DECIMAL(10,2) NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SEK',
    "status" "CardStatus" NOT NULL,
    "brand" "CardBrand" NOT NULL,
    "cardNumber" VARCHAR(4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tier" "CardTier" NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "vendor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SEK',
    "status" "TransactionStatus" NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "invoiceStartDate" TIMESTAMP(3) NOT NULL,
    "invoiceEndDate" TIMESTAMP(3) NOT NULL,
    "invoiceDueDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "mindueAmount" DECIMAL(10,2) NOT NULL,
    "invoiceStatus" "InvoiceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cards_companyId_idx" ON "cards"("companyId");

-- CreateIndex
CREATE INDEX "transactions_cardId_idx" ON "transactions"("cardId");

-- CreateIndex
CREATE INDEX "transactions_cardId_createdAt_idx" ON "transactions"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "transactions_cardId_status_idx" ON "transactions"("cardId", "status");

-- CreateIndex
CREATE INDEX "invoices_cardId_idx" ON "invoices"("cardId");

-- CreateIndex
CREATE INDEX "invoices_cardId_invoiceStatus_idx" ON "invoices"("cardId", "invoiceStatus");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
