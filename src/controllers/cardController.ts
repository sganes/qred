import { Request, Response } from 'express';
import { CardService } from '../services';

export class CardController {

    static async getCardById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const card = await CardService.getCardById(id);

            res.status(200).json({
                success: true,
                data: card,
                message: 'Card retrieved successfully'
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving card'
            });
        }
    }

    static async getAllCards(req: Request, res: Response): Promise<void> {
        try {
            const cards = await CardService.getAllCards();

            res.status(200).json({
                success: true,
                data: cards,
                message: 'Cards retrieved successfully',
                count: cards.length
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving cards'
            });
        }
    }

    static async createCard(req: Request, res: Response): Promise<void> {
        try {
            const { companyId, limit, expiryMonth, expiryYear, status, brand, cardNumber, tier, currency } = req.body;

            const newCard = await CardService.createCard({
                companyId,
                limit,
                expiryMonth,
                expiryYear,
                status,
                brand,
                cardNumber,
                tier,
                currency,
            });

            res.status(201).json({
                success: true,
                data: newCard,
                message: 'Card created successfully'
            });
        } catch (error: any) {
            if (error.message.includes('Company not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Error creating card'
                });
            }
        }
    }

    static async updateCardStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updatedCard = await CardService.updateCardStatus(id, status);

            res.status(200).json({
                success: true,
                data: updatedCard,
                message: 'Card status updated successfully'
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Error updating card'
                });
            }
        }
    }
}
