import express, { Express } from 'express';
import companyRoutes from './routes/companyRoutes';
import cardRoutes from './routes/cardRoutes';
import transactionRoutes from './routes/transactionRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import { errorHandler } from './middleware';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/companies', companyRoutes);
  app.use('/api/cards', cardRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/invoices', invoiceRoutes);

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
  app.use(errorHandler);

  return app;
};
