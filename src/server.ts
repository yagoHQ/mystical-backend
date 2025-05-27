import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { prisma } from './utils/prisma';
import dotenv from 'dotenv';
import { corsOptions } from './utils/corsOptions';
import { logger } from './utils/logger';
import router from './routes/routes';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(
  morgan('tiny', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(express.json());

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', router);

const serverInstance = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const server = app;

export { app, server };
