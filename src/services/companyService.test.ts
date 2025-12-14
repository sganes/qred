import { expect } from 'chai';
import sinon from 'sinon';
import { prisma } from '../lib/prisma';
import { CompanyService } from './companyService';

describe('CompanyService', () => {

    afterEach(() => {
        sinon.restore(); // Restore original methods after each test
    });

    it('should get company by ID', async () => {
        const mockCompany = {
            id: 'valid-uuid-1234',
            name: 'Test Company',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'valid-uuid-1234',
                    limit: 50000,
                    expiryMonth: 12,
                    expiryYear: 2025,
                    status: 'active',
                    brand: 'Visa',
                    tier: 'premium',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01'),
                    transactions: [],
                    _count: { transactions: 0 },
                    invoices: []
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        const company = await CompanyService.getCompanyById('valid-uuid-1234');
        expect(company.name).to.equal('Test Company');
        expect(company.cards).to.have.lengthOf(1);
        expect(company.cards[0].cardNumber).to.equal('************3456');
    });

    it('should throw error if company not found', async () => {
        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(null)
        );

        try {
            await CompanyService.getCompanyById('invalid-uuid-0000');
            expect.fail('Expected error was not thrown');
        } catch (error: any) {
            expect(error.message).to.equal('Company not found');
        }
    });

    it('should create a new company', async () => {
        const mockCompanyData = { name: 'New Company' };
        const mockCreatedCompany = {
            id: 'new-company-uuid-5678',
            name: 'New Company',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        sinon.stub(prisma.company, 'create').value(
            sinon.stub().resolves(mockCreatedCompany)
        );

        const company = await CompanyService.createCompany(mockCompanyData);
        expect(company.name).to.equal('New Company');
    });

    it('should throw error when creating company without name', async () => {
        try {
            await CompanyService.createCompany({ name: '' });
            expect.fail('Expected error was not thrown');
        } catch (error: any) {
            expect(error.message).to.equal('Name is required');
        }
    });

    it('should get all companies', async () => {
        const mockCompanies = [
            {
                id: 'company-uuid-1',
                name: 'Company One',
                createdAt: new Date(),
                updatedAt: new Date(),
                cards: [
                    {
                        id: 'card-uuid-1',
                        cardNumber: '3456',
                        companyId: 'company-uuid-1',
                        limit: 30000,
                        expiryMonth: 11,
                        expiryYear: 2024,
                        status: 'active',
                        brand: 'MasterCard',
                        tier: 'standard',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ]
            },
            {
                id: 'company-uuid-2',
                name: 'Company Two',
                createdAt: new Date(),
                updatedAt: new Date(),
                cards: []
            }
        ];

        sinon.stub(prisma.company, 'findMany').value(
            sinon.stub().resolves(mockCompanies)
        );

        const companies = await CompanyService.getAllCompanies();
        expect(companies).to.have.lengthOf(2);
        expect(companies[0].cards[0].cardNumber).to.equal('************3456');
        expect(companies[1].cards).to.be.an('array').that.is.empty;
    });

    it('should get company overview by ID for no transaction and invoice due', async () => {
        const mockCompany = {
            id: 'overview-uuid-1234',
            name: 'Overview Company',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'overview-uuid-1234',
                    limit: 40000,
                    expiryMonth: 10,
                    expiryYear: 2026,
                    status: 'Active',
                    brand: 'Visa',
                    tier: 'Gold',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    transactions: [],
                    _count: { transactions: 0 },
                    invoices: []
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        const overview = await CompanyService.getCompanyOverviewById('overview-uuid-1234');
        
        expect(overview.company.name).to.equal('Overview Company');
        expect(overview.cardImage.id).to.equal('card-uuid-1');
        expect(overview.cardImage.maskedCardNumber).to.equal('************3456');
        expect(overview.cardImage.brand).to.equal('Visa');
        expect(overview.cardImage.tier).to.equal('Gold');
        expect(overview.cardImage.status).to.equal('Active');
        expect(overview.cardImage.expiryMonth).to.equal(10);
        expect(overview.cardImage.expiryYear).to.equal(2026);
        expect(overview.invoiceDue).to.equal(false);
        expect(overview.remainingSpend.spent).to.equal(0);
        expect(overview.remainingSpend.limit).to.equal(40000);
        expect(overview.latestTransactions.transactionCount).to.equal(0);
        expect(overview.latestTransactions.transactions).to.be.an('array').that.is.empty;
    })

    it('should get company overview by ID for no transaction and invoice due', async () => {
        const mockCompany = {
            id: 'overview-uuid-1234',
            name: 'Overview Company',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'overview-uuid-1234',
                    limit: 40000,
                    expiryMonth: 10,
                    expiryYear: 2026,
                    status: 'Active',
                    brand: 'Visa',
                    tier: 'Gold',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    transactions: [
                        {
                            id: 'txn-uuid-1',
                            amount: 1500,
                            vendor: 'Vendor A',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: 'txn-uuid-2',
                            amount: 2500,
                            vendor: 'Vendor B',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ],
                    _count: { transactions: 2 },
                    invoices: []
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        sinon.stub(prisma.transaction, 'aggregate').value(
            sinon.stub().resolves({ _sum: { amount: 4000 } })
        );

        const overview = await CompanyService.getCompanyOverviewById('overview-uuid-1234');
        expect(overview.company.name).to.equal('Overview Company');
        expect(overview.cardImage.maskedCardNumber).to.equal('************3456');
        expect(overview.cardImage.brand).to.equal('Visa');
        expect(overview.cardImage.tier).to.equal('Gold');
        expect(overview.cardImage.status).to.equal('Active');
        expect(overview.cardImage.expiryMonth).to.equal(10);
        expect(overview.cardImage.expiryYear).to.equal(2026);
        expect(overview.invoiceDue).to.equal(false);
        expect(overview.remainingSpend.spent).to.equal(4000);
        expect(overview.remainingSpend.limit).to.equal(40000);
        expect(overview.latestTransactions.transactionCount).to.equal(0);
        expect(overview.latestTransactions.transactions).lengthOf(2);
    });

    it('should get company overview - transaction spent amount only for Posted transactions', async () => {
        const mockCompany = {
            id: 'overview-uuid-1234',
            name: 'Overview Company',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'overview-uuid-1234',
                    limit: 40000,
                    expiryMonth: 10,
                    expiryYear: 2026,
                    status: 'Active',
                    brand: 'Visa',
                    tier: 'Gold',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    transactions: [
                        {
                            id: 'txn-uuid-1',
                            amount: 1500,
                            vendor: 'Vendor A',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: 'txn-uuid-2',
                            amount: 2500,
                            vendor: 'Vendor B',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: 'txn-uuid-3',
                            amount: 1000,
                            vendor: 'Vendor C',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: 'txn-uuid-4',
                            amount: 500,
                            vendor: 'Vendor D',
                            status: 'Declined',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, {
                            id: 'txn-uuid-5',
                            amount: 2000,
                            vendor: 'Vendor E',
                            status: 'Pending',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ],
                    _count: { transactions: 5 },
                    invoices: []
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        sinon.stub(prisma.transaction, 'aggregate').value(
            sinon.stub().resolves({ _sum: { amount: 4000 } })
        );

        const overview = await CompanyService.getCompanyOverviewById('overview-uuid-1234');
        expect(overview.company.name).to.equal('Overview Company');
        expect(overview.remainingSpend.spent).to.equal(4000);
        expect(overview.remainingSpend.limit).to.equal(40000);
    });

    it('should get company overview - transaction count correctly', async () => {
        //the transactions fetched for display is 3 and the pending transactions which are more to be dispalyed is 7
        const mockCompany = {
            id: 'overview-uuid-1234',
            name: 'Overview Company',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'overview-uuid-1234',
                    limit: 40000,
                    expiryMonth: 10,
                    expiryYear: 2026,
                    status: 'Active',
                    brand: 'Visa',
                    tier: 'Gold',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    transactions: [
                        {
                            id: 'txn-uuid-1',
                            amount: 1500,
                            vendor: 'Vendor A',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: 'txn-uuid-2',
                            amount: 2500,
                            vendor: 'Vendor B',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: 'txn-uuid-3',
                            amount: 1000,
                            vendor: 'Vendor C',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ],
                    _count: { transactions: 10 },
                    invoices: []
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        sinon.stub(prisma.transaction, 'aggregate').value(
            sinon.stub().resolves({ _sum: { amount: 4000 } })
        );

        const overview = await CompanyService.getCompanyOverviewById('overview-uuid-1234');
        expect(overview.company.name).to.equal('Overview Company');
        expect(overview.latestTransactions.transactionCount).to.equal(7);
        expect(overview.latestTransactions.transactions).lengthOf(3);
    });

    it('should get company overview - invoice should be false when there is no due invoice', async () => {
        const mockCompany = {
            id: 'overview-uuid-1234',
            name: 'Overview Company',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'overview-uuid-1234',
                    limit: 40000,
                    expiryMonth: 10,
                    expiryYear: 2026,
                    status: 'Active',
                    brand: 'Visa',
                    tier: 'Gold',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    transactions: [
                        {
                            id: 'txn-uuid-1',
                            amount: 1500,
                            vendor: 'Vendor A',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                    ],
                    _count: { transactions: 10 },
                    invoices: []
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        sinon.stub(prisma.transaction, 'aggregate').value(
            sinon.stub().resolves({ _sum: { amount: 4000 } })
        );

        const overview = await CompanyService.getCompanyOverviewById('overview-uuid-1234');
        expect(overview.company.name).to.equal('Overview Company');
        expect(overview.invoiceDue).to.equal(false);
    });

    it('should get company overview - invoice should be true when there is a due invoice', async () => {
        const mockCompany = {
            id: 'overview-uuid-1234',
            name: 'Overview Company',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [
                {
                    id: 'card-uuid-1',
                    cardNumber: '3456',
                    companyId: 'overview-uuid-1234',
                    limit: 40000,
                    expiryMonth: 10,
                    expiryYear: 2026,
                    status: 'Active',
                    brand: 'Visa',
                    tier: 'Gold',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    transactions: [
                        {
                            id: 'txn-uuid-1',
                            amount: 1500,
                            vendor: 'Vendor A',
                            status: 'Posted',
                            cardId: 'card-uuid-1',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                    ],
                    _count: { transactions: 10 },
                    invoices: [
                        {
                            id: 'invoice-uuid-1',
                            cardId: 'card-uuid-1',
                            totalAmount: 1500,
                            interestCharges: 0,
                            invoiceStatus: 'Due',
                        }
                    ]
                }
            ]
        };

        sinon.stub(prisma.company, 'findUnique').value(
            sinon.stub().resolves(mockCompany)
        );

        sinon.stub(prisma.transaction, 'aggregate').value(
            sinon.stub().resolves({ _sum: { amount: 4000 } })
        );

        const overview = await CompanyService.getCompanyOverviewById('overview-uuid-1234');
        expect(overview.company.name).to.equal('Overview Company');
        expect(overview.invoiceDue).to.equal(true);
    });

});