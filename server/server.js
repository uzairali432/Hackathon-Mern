import app from './app.js';
import { config } from './config/environment.js';
import { connectDatabase } from './config/database.js';

(async () => {
  try {
    // Connect to MongoDB
    try {
      await connectDatabase();
      console.log('[Server] Connected to MongoDB');
    } catch (error) {
      console.warn(`[Server] Continuing without MongoDB: ${error.message}`);
    }

    // Start the server
    app.listen(config.port, () => {
      console.log(`[Server] Running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
})();
