"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const services_1 = require("../services");
class CompanyController {
    static async getCompanyById(req, res) {
        try {
            const { id } = req.params;
            const company = await services_1.CompanyService.getCompanyById(id);
            res.status(200).json({
                success: true,
                data: company,
                message: 'Company retrieved successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving company'
            });
        }
    }
    static async createCompany(req, res) {
        try {
            const { name } = req.body;
            const newCompany = await services_1.CompanyService.createCompany(name);
            res.status(201).json({
                success: true,
                data: newCompany,
                message: 'Company created successfully'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error creating company'
            });
        }
    }
    static async getAllCompanies(req, res) {
        try {
            const companies = await services_1.CompanyService.getAllCompanies();
            res.status(200).json({
                success: true,
                data: companies,
                message: 'Companies retrieved successfully',
                count: companies.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving companies'
            });
        }
    }
    static async getCompanyOverviewById(req, res) {
        try {
            const { id } = req.params;
            const companyOverview = await services_1.CompanyService.getCompanyOverviewById(id);
            res.status(200).json({
                success: true,
                data: companyOverview,
                message: 'Company overview retrieved successfully'
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving company overview'
            });
        }
    }
}
exports.CompanyController = CompanyController;
