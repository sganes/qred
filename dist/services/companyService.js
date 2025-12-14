"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const prisma_1 = require("../lib/prisma");
const helpers_1 = require("../lib/helpers");
class CompanyService {
    static async getCompanyById(id) {
        const company = await prisma_1.prisma.company.findUnique({
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
            cardNumber: (0, helpers_1.maskCardNumber)(card.cardNumber)
        }));
        return company;
    }
    static async createCompany(name) {
        if (!name) {
            throw new Error('Name is required');
        }
        const newCompany = await prisma_1.prisma.company.create({
            data: { name },
            include: {
                cards: true
            }
        });
        return newCompany;
    }
    static async getAllCompanies() {
        const companies = await prisma_1.prisma.company.findMany({
            include: {
                cards: true
            }
        });
        return companies.map(company => ({
            ...company,
            cards: company.cards.map(card => ({
                ...card,
                cardNumber: (0, helpers_1.maskCardNumber)(card.cardNumber)
            }))
        }));
    }
    static async getCompanyOverviewById(id) {
        const company = await prisma_1.prisma.company.findUnique({
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
        const spentAmountAggregate = await prisma_1.prisma.transaction.aggregate({
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
exports.CompanyService = CompanyService;
function overviewResponse(company, spentAmount) {
    const card = company.cards[0];
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
            maskedCardNumber: (0, helpers_1.maskCardNumber)(card.cardNumber),
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
