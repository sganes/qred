import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

const companyId = uuid();
console.log(`Seeding data for company ID: ${companyId}`);

async function main() {
    console.log("Seeding database...");
    const company = await seedCompany("NewCompany", companyId);
    const card = await seedCard(company.id, {
        "limit": 30000,
        "expiryMonth": 10,
        "expiryYear": 2028,
        "status": "Pending",
        "brand": "Master",
        "cardNumber": "1235",
        "tier": "Gold"
    });
    await seedTransaction(card.id);
    console.log("Seeding completed.");
}

export async function seedCompany(name: string, id?: string) {
    return prisma.company.create({
        data: {
            name,
            id: id || uuid()
        }
    });
}

export async function seedCard(companyId: string, cardData: any) {
    return prisma.card.create({
        data: {
            companyId,
            ...cardData
        }
    });
}

export async function seedTransaction(cardId: string) {
    const transactions = [];
    for (let i = 0; i < 5; i++) {
        transactions.push(
            prisma.transaction.create({
                data: {
                    "cardId": cardId,
                    "amount": 1000 + (i * 1000),
                    "vendor": `Vendor ${i + 1}`,
                    "status": "Posted"
                }
            })
        );
    }
    await prisma.transaction.create({
        data: {
            "cardId": cardId,
            "amount": 6000,
            "vendor": `Vendor 6`,
            "status": "Declined"
        }
    })
    await Promise.all(transactions);
}

export async function clearDatabase() {
    console.log("Clearing database...");
    await prisma.transaction.deleteMany();
    await prisma.card.deleteMany();
    await prisma.company.deleteMany();
    console.log("Database cleared.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
