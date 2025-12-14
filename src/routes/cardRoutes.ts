import { Router } from 'express';
import { CardController } from '../controllers/cardController';
import { TransactionController } from '../controllers/transactionController';
import { InvoiceController } from '../controllers/invoiceController';

const router = Router();

// GET card by id
router.get('/:id', CardController.getCardById);

// GET all transactions for the cardId
router.get('/:id/transactions', TransactionController.getTransactionsByCardId);

// GET Due invoice for the cardId
router.get('/:id/invoice', InvoiceController.getDueInvoiceByCardId);

// POST create a new card
router.post('/', CardController.createCard);

// Patch update the creditcard status
router.patch('/:id/status', CardController.updateCardStatus);

export default router;