import { prisma } from '../lib/prisma';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceService {
    static async getInvoiceById(id: string) {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                card: {
                    include: {
                        company: true
                    }
                },
                transactions: true
            }
        });

        if (!invoice) {
            throw new Error('Invoice not found');
        }

        return invoice;
    }

    static async getAllInvoices() {
        const invoices = await prisma.invoice.findMany({
            include: {
                card: {
                    include: {
                        company: true
                    }
                },
                transactions: true
            }
        });

        return invoices;
    }

    static async generateInvoice(cardId: string, interestCharges: number = 0) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }

        // Verify card exists
        const card = await prisma.card.findUnique({
            where: { id: cardId }
        });

        if (!card) {
            throw new Error('Card not found');
        }

        // Generate invoice dates automatically
        const invoiceStartDate = new Date();
        invoiceStartDate.setDate(1);
        invoiceStartDate.setHours(0, 0, 0, 0);

        const invoiceEndDate = new Date();
        invoiceEndDate.setMonth(invoiceEndDate.getMonth() + 1);
        invoiceEndDate.setDate(0);
        invoiceEndDate.setHours(23, 59, 59, 999);

        const invoiceDueDate = new Date();
        invoiceDueDate.setMonth(invoiceDueDate.getMonth() + 1);
        invoiceDueDate.setDate(15);
        invoiceDueDate.setHours(0, 0, 0, 0);

        // Calculate total amount from transactions for the date range
        const transactions = await prisma.transaction.findMany({
            where: {
                cardId,
                createdAt: {
                    gte: invoiceStartDate,
                    lte: invoiceEndDate
                }
            }
        });

        const totalAmount = transactions.reduce((sum, transaction) => {
            return sum + parseFloat(transaction.amount.toString());
        }, 0);

        // Calculate minimum due amount
        const mindueAmount = Math.max(totalAmount * 0.1, 50);

        const newInvoice = await prisma.invoice.create({
            data: {
                cardId,
                invoiceStartDate,
                invoiceEndDate,
                invoiceDueDate,
                totalAmount: parseFloat(totalAmount.toString()),
                mindueAmount: parseFloat(mindueAmount.toString()),
                invoiceStatus: InvoiceStatus.Due,
            }
        });

        // Link transactions to invoice
        await prisma.transaction.updateMany({
            where: {
                cardId,
                createdAt: {
                    gte: invoiceStartDate,
                    lte: invoiceEndDate
                }
            },
            data: {
                invoiceId: newInvoice.id
            }
        });

        // Fetch and return the complete invoice with relationships
        return await this.getInvoiceById(newInvoice.id);
    }

    static async getDueInvoiceByCardId(cardId: string) {
        const dueInvoice = await prisma.invoice.findFirst({
            where: {
                cardId,
                invoiceStatus: InvoiceStatus.Due
            },
            include: {
                card: {
                    include: {
                        company: true
                    }
                },
                transactions: true
            },
            orderBy: {
                invoiceDueDate: 'asc'
            }
        });

        if (!dueInvoice) {
            throw new Error('No due invoice found for this card');
        }

        return dueInvoice;
    }

    static async updateInvoiceStatus(id: string, status: InvoiceStatus) {
        if (!Object.values(InvoiceStatus).includes(status)) {
            throw new Error('Invalid invoice status');
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: { invoiceStatus: status },
            include: {
                card: {
                    include: {
                        company: true
                    }
                },
                transactions: true
            }
        });

        return updatedInvoice;
    }
}
