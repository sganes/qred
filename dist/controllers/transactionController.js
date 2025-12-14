"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const services_1 = require("../services");
class TransactionController {
    static async getAllTransactions(req, res) {
        try {
            const transactions = await services_1.TransactionService.getAllTransactions();
            res.status(200).json({
                success: true,
                data: transactions,
                message: 'Transactions retrieved successfully',
                count: transactions.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions'
            });
        }
    }
    static async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            const transaction = await services_1.TransactionService.getTransactionById(id);
            res.status(200).json({
                success: true,
                data: transaction,
                message: 'Transaction retrieved successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving transaction'
            });
        }
    }
    static async createTransaction(req, res) {
        try {
            const { cardId, amount, vendor, status } = req.body;
            const newTransaction = await services_1.TransactionService.createTransaction({
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
        }
        catch (error) {
            if (error.message.includes('Card not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Error creating transaction'
                });
            }
        }
    }
    static async getTransactionsByCardId(req, res) {
        try {
            const { id } = req.params;
            const transactions = await services_1.TransactionService.getTransactionsByCardId(id);
            res.status(200).json({
                success: true,
                data: transactions,
                message: 'Transactions retrieved successfully',
                count: transactions.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving transactions for the card'
            });
        }
    }
}
exports.TransactionController = TransactionController;
