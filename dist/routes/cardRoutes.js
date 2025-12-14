"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardController_1 = require("../controllers/cardController");
const transactionController_1 = require("../controllers/transactionController");
const invoiceController_1 = require("../controllers/invoiceController");
const router = (0, express_1.Router)();
// GET card by id
router.get('/:id', cardController_1.CardController.getCardById);
// GET all transactions for the cardId
router.get('/:id/transactions', transactionController_1.TransactionController.getTransactionsByCardId);
// GET Due invoice for the cardId
router.get('/:id/invoice', invoiceController_1.InvoiceController.getDueInvoiceByCardId);
// POST create a new card
router.post('/', cardController_1.CardController.createCard);
// Patch update the creditcard status
router.patch('/:id/status', cardController_1.CardController.updateCardStatus);
exports.default = router;
