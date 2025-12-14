import { prisma } from '../lib/prisma';
import { maskCardNumber } from '../lib/helpers';
import { CompanyOverviewResponse, CompanyPayload } from '../models/overview';
import { Prisma } from "@prisma/client";

export class CompanyService {
    static async getCompanyById(id: string) {
        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                cards: true
            }
        });

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

    static async createCompany(name: string) {
        if (!name) {
            throw new Error('Name is required');
        }

        const newCompany = await prisma.company.create({
            data: { name },
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
                            take: 5,
                            orderBy: { createdAt: 'desc' }
                        },
                        _count: {
                            select: { transactions: true }
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

        const spentAmount = spentAmountAggregate._sum.amount ?? 0;

        return overviewResponse(company, Number(spentAmount));
    }
}

function overviewResponse(company: CompanyPayload, spentAmount: number): CompanyOverviewResponse {
    const card = company.cards[0] as typeof company.cards[0]
    if (!card) {
        throw new Error('No cards found for this company');
    }
    return {
        company: {
            name: company.name
        },
        cardImage: {
            brand: card.brand,
            tier: card.tier,
            status: card.status,
            maskedCardNumber: maskCardNumber(card.cardNumber),
            expiryMonth: card.expiryMonth,
            expiryYear: card.expiryYear
        },

        latestTransactions: {
            transactions: card.transactions.map((txn) => ({
                amount: Number(txn.amount),
                vendor: txn.vendor,
                status: txn.status
            })),
            transactionCount: card._count.transactions - card.transactions.length
        },
        remainingSpend: {
            spent: spentAmount,
            limit: Number(card.limit)
        }
    };
}