import { server } from './server';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
