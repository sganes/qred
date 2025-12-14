import { prisma } from '../lib/prisma';
import { TransactionStatus } from '@prisma/client';

export class TransactionService {
    static async getAllTransactions() {
        const transactions = await prisma.transaction.findMany({
            include: {
                card: false
            }
        });

        return transactions;
    }

    static async getTransactionById(id: string) {
        const transaction = await prisma.transaction.findUnique({
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

    static async createTransaction(data: {
        cardId: string;
        amount: string;
        vendor: string;
        status: TransactionStatus;
        currency: string;
    }) {
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

        if (!Object.values(TransactionStatus).includes(data.status)) {
            throw new Error('Invalid transaction status');
        }

        // Verify card exists
        const card = await prisma.card.findUnique({
            where: { id: data.cardId }
        });

        if (!card) {
            throw new Error('Card not found');
        }

        const newTransaction = await prisma.transaction.create({
            data: {
                cardId: data.cardId,
                amount: parseFloat(data.amount),
                vendor: data.vendor,
                status: data.status,
                currency: data.currency,
            },
            include: {
                card: false
            }
        });

        return newTransaction;
    }

    static async getTransactionsByCardId(cardId: string) {
        const transactions = await prisma.transaction.findMany({
            where: { cardId },
            include: {
                card: false
            }
        });

        return transactions;
    }
}
