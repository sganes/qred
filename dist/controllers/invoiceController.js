"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const services_1 = require("../services");
class InvoiceController {
    static async getInvoiceById(req, res) {
        try {
            const { id } = req.params;
            const invoice = await services_1.InvoiceService.getInvoiceById(id);
            res.status(200).json({
                success: true,
                data: invoice,
                message: 'Invoice retrieved successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving invoice'
            });
        }
    }
    static async getAllInvoices(req, res) {
        try {
            const invoices = await services_1.InvoiceService.getAllInvoices();
            res.status(200).json({
                success: true,
                data: invoices,
                message: 'Invoices retrieved successfully',
                count: invoices.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving invoices'
            });
        }
    }
    static async generateInvoice(req, res) {
        try {
            const { cardId, interestCharges } = req.body;
            const newInvoice = await services_1.InvoiceService.generateInvoice(cardId, interestCharges || 0);
            res.status(201).json({
                success: true,
                data: newInvoice,
                message: 'Invoice generated automatically for the current billing period'
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
                    message: error.message || 'Error generating invoice'
                });
            }
        }
    }
    static async getDueInvoiceByCardId(req, res) {
        try {
            const cardId = req.params.id;
            const dueInvoice = await services_1.InvoiceService.getDueInvoiceByCardId(cardId);
            res.status(200).json({
                success: true,
                data: dueInvoice,
                message: 'Due invoice retrieved successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving due invoice'
            });
        }
    }
    static async updateInvoiceStatus(req, res) {
        try {
            const { id } = req.params;
            const { invoiceStatus } = req.body;
            const updatedInvoice = await services_1.InvoiceService.updateInvoiceStatus(id, invoiceStatus);
            res.status(200).json({
                success: true,
                data: updatedInvoice,
                message: 'Invoice status updated successfully'
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
                    message: error.message || 'Error updating invoice'
                });
            }
        }
    }
}
exports.InvoiceController = InvoiceController;
