"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class TransactionService {
    static async getAllTransactions() {
        const transactions = await prisma_1.prisma.transaction.findMany({
            include: {
                card: false
            }
        });
        return transactions;
    }
    static async getTransactionById(id) {
        const transaction = await prisma_1.prisma.transaction.findUnique({
            where: { id },
            include: {
                card: false
            }
        });
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        return transaction;
    }
    static async createTransaction(data) {
        // Validation
        if (!data.cardId) {
            throw new Error('Card ID is required');
        }
        if (!data.amount) {
            throw new Error('Amount is required');
        }
        if (!data.vendor) {
            throw new Error('Vendor is required');
        }
        if (!Object.values(client_1.TransactionStatus).includes(data.status)) {
            throw new Error('Invalid transaction status');
        }
        // Verify card exists
        const card = await prisma_1.prisma.card.findUnique({
            where: { id: data.cardId }
        });
        if (!card) {
            throw new Error('Card not found');
        }
        const newTransaction = await prisma_1.prisma.transaction.create({
            data: {
                cardId: data.cardId,
                amount: parseFloat(data.amount),
                vendor: data.vendor,
                status: data.status
            },
            include: {
                card: false
            }
        });
        return newTransaction;
    }
    static async getTransactionsByCardId(cardId) {
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: { cardId },
            include: {
                card: false
            }
        });
        return transactions;
    }
}
exports.TransactionService = TransactionService;
