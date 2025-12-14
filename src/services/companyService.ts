import { prisma } from '../lib/prisma';
import { maskCardNumber } from '../lib/helpers';
import { CompanyOverviewResponse, CompanyPayload } from '../models/overview';
import { Prisma, InvoiceStatus } from "@prisma/client";
import { isDataView } from 'util/types';

export class CompanyService {
    static async getCompanyById(id: string) {
        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                cards: true
            }
        });

        console.log(company)
        if (!company) {
            throw new Error('Company not found');
        }

        // Mask card numbers
        company.cards = company.cards.map(card => ({
            ...card,
            cardNumber: maskCardNumber(card.cardNumber)
        }));

        return company;
    }

    static async createCompany(data: {
            name: string;
        }) {
        if (!data.name) {
            throw new Error('Name is required');
        }

        const newCompany = await prisma.company.create({
            data,
            include: {
                cards: true
            }
        });

        return newCompany;
    }

    static async getAllCompanies() {
        const companies = await prisma.company.findMany({
            include: {
                cards: true
            }
        });

        return companies.map(company => ({
            ...company,
            cards: company.cards.map(card => ({
                ...card,
                cardNumber: maskCardNumber(card.cardNumber)
            }))
        }));
    }

    static async getCompanyOverviewById(id: string): Promise<CompanyOverviewResponse> {
        const company: CompanyPayload | null = await prisma.company.findUnique({
            where: { id },
            include: {
                cards: {
                    take: 1,
                    orderBy: { createdAt: 'asc' },
                    include: {
                        transactions: {
                            take: 3,
                            orderBy: { createdAt: 'desc' }
                        },
                        _count: {
                            select: { transactions: true }
                        },
                        invoices: {
                            take: 1,
                            where: { invoiceStatus: InvoiceStatus.Due },
                        }
                    }
                }
            }
        });

        if (!company) {
            throw new Error('Company not found');
        }

        const spentAmountAggregate = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                card: {
                    id: company?.cards[0]?.id
                },
                status: 'Posted'
            }
        });

        const spentAmount: number = Number(spentAmountAggregate._sum.amount ?? 0);

        return overviewResponse(company, spentAmount);
    }
}

function overviewResponse(company: CompanyPayload, spentAmount: number): CompanyOverviewResponse {
    const card = company.cards[0] as typeof company.cards[0]

    const cardImage = {
            id: card?.id,
            brand: card?.brand,
            tier: card?.tier,
            status: card?.status,
            maskedCardNumber: card?.cardNumber ? maskCardNumber(card.cardNumber) : undefined,
            expiryMonth: card?.expiryMonth,
            expiryYear: card?.expiryYear
    }

    const transactions = card?.transactions || [];

    return {
        company: {
            name: company.name
        },
        cardImage, 
        latestTransactions: {
            transactions: transactions.map((txn) => ({
                amount: Number(txn.amount),
                vendor: txn.vendor,
                status: txn.status
            })),
            transactionCount: card?._count.transactions ? card._count.transactions - card.transactions.length : 0
        },
        remainingSpend: {
            spent: spentAmount,
            limit: Number(card?.limit) || 0,
        },
        invoiceDue: card?.invoices.length > 0
    };
}
