import { Router } from 'express';
import { InvoiceController } from '../controllers/invoiceController';

const router = Router();

// GET Invoice by InvoiceId
router.get('/id', InvoiceController.getInvoiceById);

// POST Generate a new Invoice
router.post('/', InvoiceController.generateInvoice);

export default router;
