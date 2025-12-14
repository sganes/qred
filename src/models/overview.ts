import { Prisma } from "@prisma/client";

export type CompanyPayload = Prisma.CompanyGetPayload<{
    include: {
        cards: {
            include: {
                transactions: true;
                _count: {
                    select: { transactions: true }
                },
            };
        };
    };
}>;

export interface CompanyOverviewResponse {
    company: {
        name: string;
    };
    cardImage: {
        maskedCardNumber: string;
        expiryMonth: number;
        expiryYear: number;
        tier: string;
        brand: string;
        status: string;
    };
    remainingSpend: {
        spent: number;
        limit: number;
    };
    latestTransactions: {
        transactions: Array<{
            amount: number;
            vendor: string;
            status: string;
        }>;
        transactionCount: number;
    };
}

