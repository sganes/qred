import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';

const router = Router();

// GET transaction by id
router.get('/:id', TransactionController.getTransactionById);

// POST create a new transaction
router.post('/', TransactionController.createTransaction);

export default router;
