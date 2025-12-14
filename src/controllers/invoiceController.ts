import { Request, Response } from 'express';
import { InvoiceService } from '../services';

export class InvoiceController {

    static async getInvoiceById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const invoice = await InvoiceService.getInvoiceById(id);

            res.status(200).json({
                success: true,
                data: invoice,
                message: 'Invoice retrieved successfully'
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving invoice'
            });
        }
    }

    static async getAllInvoices(req: Request, res: Response): Promise<void> {
        try {
            const invoices = await InvoiceService.getAllInvoices();

            res.status(200).json({
                success: true,
                data: invoices,
                message: 'Invoices retrieved successfully',
                count: invoices.length
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving invoices'
            });
        }
    }

    static async generateInvoice(req: Request, res: Response): Promise<void> {
        try {
            const { cardId, interestCharges } = req.body;
            const newInvoice = await InvoiceService.generateInvoice(cardId, interestCharges || 0);

            res.status(201).json({
                success: true,
                data: newInvoice,
                message: 'Invoice generated automatically for the current billing period'
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
                    message: error.message || 'Error generating invoice'
                });
            }
        }
    }

    static async getDueInvoiceByCardId(req: Request, res: Response): Promise<void> {
        try {
            const cardId = req.params.id;
            const dueInvoice = await InvoiceService.getDueInvoiceByCardId(cardId);

            res.status(200).json({
                success: true,
                data: dueInvoice,
                message: 'Due invoice retrieved successfully'
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving due invoice'
            });
        }
    }

    static async updateInvoiceStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { invoiceStatus } = req.body;

            const updatedInvoice = await InvoiceService.updateInvoiceStatus(id, invoiceStatus);

            res.status(200).json({
                success: true,
                data: updatedInvoice,
                message: 'Invoice status updated successfully'
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
                    message: error.message || 'Error updating invoice'
                });
            }
        }
    }
}