"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const middleware_1 = require("./middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Routes
    app.use('/api/companies', companyRoutes_1.default);
    app.use('/api/cards', cardRoutes_1.default);
    app.use('/api/transactions', transactionRoutes_1.default);
    app.use('/api/invoices', invoiceRoutes_1.default);
    // Health check route
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString()
        });
    });
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    });
    // Error handling middleware (must be last)
    app.use(middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
