"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoiceController_1 = require("../controllers/invoiceController");
const router = (0, express_1.Router)();
// GET Invoice by InvoiceId
router.get('/id', invoiceController_1.InvoiceController.getInvoiceById);
// POST Generate a new Invoice
router.post('/', invoiceController_1.InvoiceController.generateInvoice);
exports.default = router;
