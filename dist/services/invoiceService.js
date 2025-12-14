"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
class InvoiceService {
    static async getInvoiceById(id) {
        const invoice = await prisma_1.prisma.invoice.findUnique({
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
        const invoices = await prisma_1.prisma.invoice.findMany({
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
    static async generateInvoice(cardId, interestCharges = 0) {
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        // Verify card exists
        const card = await prisma_1.prisma.card.findUnique({
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
        const transactions = await prisma_1.prisma.transaction.findMany({
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
        const newInvoice = await prisma_1.prisma.invoice.create({
            data: {
                cardId,
                invoiceStartDate,
                invoiceEndDate,
                invoiceDueDate,
                totalAmount: parseFloat(totalAmount.toString()),
                mindueAmount: parseFloat(mindueAmount.toString()),
                invoiceStatus: client_1.InvoiceStatus.Due,
            }
        });
        // Link transactions to invoice
        await prisma_1.prisma.transaction.updateMany({
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
    static async getDueInvoiceByCardId(cardId) {
        const dueInvoice = await prisma_1.prisma.invoice.findFirst({
            where: {
                cardId,
                invoiceStatus: client_1.InvoiceStatus.Due
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
    static async updateInvoiceStatus(id, status) {
        if (!Object.values(client_1.InvoiceStatus).includes(status)) {
            throw new Error('Invalid invoice status');
        }
        const updatedInvoice = await prisma_1.prisma.invoice.update({
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
exports.InvoiceService = InvoiceService;
