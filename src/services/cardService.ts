import { prisma } from '../lib/prisma';
import { CardStatus, CardBrand, CardTier } from '@prisma/client';
import { isValidLastFourDigits, maskCardNumber } from '../lib/helpers';

export class CardService {
    static async getCardById(id: string) {
        const card = await prisma.card.findUnique({
            where: { id },
            include: {
                company: true
            }
        });

        if (!card) {
            throw new Error('Card not found');
        }

        return {
            ...card,
            cardNumber: maskCardNumber(card.cardNumber)
        };
    }

    static async getAllCards() {
        const cards = await prisma.card.findMany({
            include: {
                company: true
            }
        });

        return cards.map(card => ({
            ...card,
            cardNumber: maskCardNumber(card.cardNumber)
        }));
    }

    static async createCard(data: {
        companyId: string;
        limit: string;
        expiryMonth: string;
        expiryYear: string;
        status: CardStatus;
        brand: CardBrand;
        cardNumber: string;
        tier: CardTier;
        currency: string;
    }) {
        // Validation
        if (!data.companyId) {
            throw new Error('Company ID is required');
        }

        if (!Object.values(CardStatus).includes(data.status)) {
            throw new Error('Invalid card status');
        }

        if (!Object.values(CardBrand).includes(data.brand)) {
            throw new Error('Invalid card brand');
        }

        if (!Object.values(CardTier).includes(data.tier)) {
            throw new Error('Invalid card tier');
        }

        if (!isValidLastFourDigits(data.cardNumber.slice(-4))) {
            throw new Error('Invalid last four digits');
        }

        // Verify company exists
        const company = await prisma.company.findUnique({
            where: { id: data.companyId }
        });

        if (!company) {
            throw new Error('Company not found');
        }

        const newCard = await prisma.card.create({
            data: {
                companyId: data.companyId,
                limit: parseFloat(data.limit),
                expiryMonth: parseInt(data.expiryMonth),
                expiryYear: parseInt(data.expiryYear),
                status: data.status,
                brand: data.brand,
                cardNumber: data.cardNumber,
                tier: data.tier
            },
            include: {
                company: true
            }
        });

        return {
            ...newCard,
            cardNumber: maskCardNumber(newCard.cardNumber)
        };
    }

    static async updateCardStatus(id: string, status: CardStatus) {
        if (!Object.values(CardStatus).includes(status)) {
            throw new Error('Invalid card status');
        }

        const updatedCard = await prisma.card.update({
            where: { id },
            data: { status },
            include: {
                company: true
            }
        });

        return {
            ...updatedCard,
            cardNumber: maskCardNumber(updatedCard.cardNumber)
        };
    }
}
