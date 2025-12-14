"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
// GET all companies
router.get('/', companyController_1.CompanyController.getAllCompanies);
// GET company overview by id
router.get('/:id', companyController_1.CompanyController.getCompanyById);
// GET company overview by id
router.get('/:id/overview', companyController_1.CompanyController.getCompanyOverviewById);
// POST create a new company
router.post('/', companyController_1.CompanyController.createCompany);
exports.default = router;
