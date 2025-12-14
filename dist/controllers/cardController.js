"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const services_1 = require("../services");
class CardController {
    static async getCardById(req, res) {
        try {
            const { id } = req.params;
            const card = await services_1.CardService.getCardById(id);
            res.status(200).json({
                success: true,
                data: card,
                message: 'Card retrieved successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving card'
            });
        }
    }
    static async getAllCards(req, res) {
        try {
            const cards = await services_1.CardService.getAllCards();
            res.status(200).json({
                success: true,
                data: cards,
                message: 'Cards retrieved successfully',
                count: cards.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving cards'
            });
        }
    }
    static async createCard(req, res) {
        try {
            const { companyId, limit, expiryMonth, expiryYear, status, brand, cardNumber, tier } = req.body;
            const newCard = await services_1.CardService.createCard({
                companyId,
                limit,
                expiryMonth,
                expiryYear,
                status,
                brand,
                cardNumber,
                tier
            });
            res.status(201).json({
                success: true,
                data: newCard,
                message: 'Card created successfully'
            });
        }
        catch (error) {
            if (error.message.includes('Company not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Error creating card'
                });
            }
        }
    }
    static async updateCardStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedCard = await services_1.CardService.updateCardStatus(id, status);
            res.status(200).json({
                success: true,
                data: updatedCard,
                message: 'Card status updated successfully'
            });
        }
        catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Error updating card'
                });
            }
        }
    }
}
exports.CardController = CardController;
