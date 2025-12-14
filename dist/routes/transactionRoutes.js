"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
// GET transaction by id
router.get('/:id', transactionController_1.TransactionController.getTransactionById);
// POST create a new transaction
router.post('/', transactionController_1.TransactionController.createTransaction);
exports.default = router;
