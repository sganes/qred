import { Router } from 'express';
import { CompanyController } from '../controllers/companyController';

const router = Router();

// GET all companies
router.get('/', CompanyController.getAllCompanies);

// GET company overview by id
router.get('/:id', CompanyController.getCompanyById);

// GET company overview by id
router.get('/:id/overview', CompanyController.getCompanyOverviewById);

// POST create a new company
router.post('/', CompanyController.createCompany);

export default router;
