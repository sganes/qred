import { Request, Response } from 'express';
import { CompanyService } from '../services';
import { CompanyOverviewResponse } from '../models/overview';

export class CompanyController {

    static async getCompanyById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const company = await CompanyService.getCompanyById(id);

            res.status(200).json({
                success: true,
                data: company,
                message: 'Company retrieved successfully'
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving company'
            });
        }
    }

    static async createCompany(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const newCompany = await CompanyService.createCompany({
                name
            });
            res.status(201).json({
                success: true,
                data: newCompany,
                message: 'Company created successfully'
            });
        } catch (error: any) {
            console.log(error)
            res.status(400).json({
                success: false,
                message: error.message || 'Error creating company'
            });
        }
    }

    static async getAllCompanies(req: Request, res: Response): Promise<void> {
        try {
            const companies = await CompanyService.getAllCompanies();

            res.status(200).json({
                success: true,
                data: companies,
                message: 'Companies retrieved successfully',
                count: companies.length
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error retrieving companies'
            });
        }
    }

    static async getCompanyOverviewById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const companyOverview: CompanyOverviewResponse = await CompanyService.getCompanyOverviewById(id);
            res.status(200).json({
                success: true,
                data: companyOverview,
                message: 'Company overview retrieved successfully'
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'Error retrieving company overview'
            });
        }
    }
}
