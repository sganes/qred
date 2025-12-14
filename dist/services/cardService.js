"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
const helpers_1 = require("../lib/helpers");
class CardService {
    static async getCardById(id) {
        const card = await prisma_1.prisma.card.findUnique({
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
            cardNumber: (0, helpers_1.maskCardNumber)(card.cardNumber)
        };
    }
    static async getAllCards() {
        const cards = await prisma_1.prisma.card.findMany({
            include: {
                company: true
            }
        });
        return cards.map(card => ({
            ...card,
            cardNumber: (0, helpers_1.maskCardNumber)(card.cardNumber)
        }));
    }
    static async createCard(data) {
        // Validation
        if (!data.companyId) {
            throw new Error('Company ID is required');
        }
        if (!Object.values(client_1.CardStatus).includes(data.status)) {
            throw new Error('Invalid card status');
        }
        if (!Object.values(client_1.CardBrand).includes(data.brand)) {
            throw new Error('Invalid card brand');
        }
        if (!Object.values(client_1.CardTier).includes(data.tier)) {
            throw new Error('Invalid card tier');
        }
        if (!(0, helpers_1.isValidLastFourDigits)(data.cardNumber.slice(-4))) {
            throw new Error('Invalid last four digits');
        }
        // Verify company exists
        const company = await prisma_1.prisma.company.findUnique({
            where: { id: data.companyId }
        });
        if (!company) {
            throw new Error('Company not found');
        }
        const newCard = await prisma_1.prisma.card.create({
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
            cardNumber: (0, helpers_1.maskCardNumber)(newCard.cardNumber)
        };
    }
    static async updateCardStatus(id, status) {
        if (!Object.values(client_1.CardStatus).includes(status)) {
            throw new Error('Invalid card status');
        }
        const updatedCard = await prisma_1.prisma.card.update({
            where: { id },
            data: { status },
            include: {
                company: true
            }
        });
        return {
            ...updatedCard,
            cardNumber: (0, helpers_1.maskCardNumber)(updatedCard.cardNumber)
        };
    }
}
exports.CardService = CardService;
