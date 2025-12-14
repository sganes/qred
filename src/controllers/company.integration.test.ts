import { expect } from 'chai';
import request from 'supertest';
import { setupDatabase } from '../test/testSetup';
import { createApp } from '../app';
import { CompanyOverviewResponse } from '../models/overview';
import { seedCard, seedTransaction, clearDatabase } from '../test/seed';

const app = createApp();

describe('Companies endpoint', () => {
  let companyId: string;

  before(async function () {
    this.timeout(30000);
    await setupDatabase();
  });

  after(async function () {
    this.timeout(10000);
    await clearDatabase();
  });

  it('should create a new company with 201 status code', async () => {
    const res = await request(app)
      .post('/api/companies')
      .send({ name: 'NewCompany' })
      .expect(201);

    expect(res.body).to.have.property('success', true);
    expect(res.body).to.have.property('message', 'Company created successfully');
    expect(res.body).to.have.property('data').that.is.an('object');
    expect(res.body.data).to.have.property('name', 'NewCompany');

    companyId = res.body.data.id;
  });

  it('should get a company by ID with 200 status code', async () => {
    const companiesRes = await request(app)
      .get(`/api/companies/${companyId}`)
      .expect(200);
    expect(companiesRes.body).to.have.property('success', true);
    expect(companiesRes.body.data.name).to.equal('NewCompany');
  });

  it('should get company overview with 200 status code', async () => {
    const card = await seedCard(companyId, {
      "limit": 30000,
      "expiryMonth": 10,
      "expiryYear": 2028,
      "status": "Pending",
      "brand": "Master",
      "cardNumber": "1235",
      "tier": "Gold"
    });

    await seedTransaction(card.id);

    const res = await request(app)
      .get(`/api/companies/${companyId}/overview`)
      .expect(200);

    const overview: CompanyOverviewResponse = res.body.data;
    console.log(overview)
    expect(res.body).to.have.property('success', true);
    expect(overview.company.name).to.equal('NewCompany');
    expect(overview.cardImage.maskedCardNumber).to.equal('************1235');
    expect(overview.latestTransactions.transactions).to.be.an('array').that.has.lengthOf(3);
    expect(overview.latestTransactions.transactionCount).to.equal(3);
    expect(overview.remainingSpend.spent).to.equal(15000);
    expect(overview.remainingSpend.limit).to.equal(30000);
    expect(overview.cardImage.brand).to.equal('Master');
    expect(overview.cardImage.tier).to.equal('Gold');
    expect(overview.cardImage.status).to.equal('Pending');
    expect(overview.invoiceDue).to.equal(false);
  });

  it('should thow 404 while getting the overview of a non-existent company', async () => {
    const res = await request(app)
      .get(`/api/companies/nonExistentCompanyId/overview`)
      .expect(404);
    expect(res.body).to.have.property('success', false);
  });

});