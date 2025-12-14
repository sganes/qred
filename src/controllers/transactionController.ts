import { Request, Response } from 'express';
import { TransactionService } from '../services';

export class TransactionController {

    static async getAllTransactions(req: Request, res: Response): Promise<void> {
        try {
            const transactions = await TransactionService.getAllTransactions();

            res.status(200).json({
                success: true,
                data: transactions,
                message: 'Transactions retrieved successfully',
                count: transactions.length
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions'
            });
        }
    }

    static async getTransactionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const transaction = await TransactionService.getTransactionById(id);

            res.status(200).json({
                success: true,
                data: transaction,
                message: 'Transaction retrieved successfully'
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving transaction'
            });
        }
    }

    static async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const { cardId, amount, vendor, status } = req.body;

            const newTransaction = await TransactionService.createTransaction({
                cardId,
                amount,
                vendor,
                status
            });

            res.status(201).json({
                success: true,
                data: newTransaction,
                message: 'Transaction created successfully'
            });
        } catch (error: any) {
            if (error.message.includes('Card not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Error creating transaction'
                });
            }
        }
    }

    static async getTransactionsByCardId(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const transactions = await TransactionService.getTransactionsByCardId(id);

            res.status(200).json({
                success: true,
                data: transactions,
                message: 'Transactions retrieved successfully',
                count: transactions.length
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions for the card'
            });
        }
    }
}
