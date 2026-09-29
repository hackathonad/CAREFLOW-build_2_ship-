import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/apiRouter.js';

const app = express();

// Security and Cross-Origin Configuration
const allowedDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (such as mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (config.nodeEnv === 'development') {
        // In local development, permit Vite and localhost variations
        if (allowedDevOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
          return callback(null, true);
        }
      }

      // In production or staging, allow explicitly configured frontend URL and Vercel deployments
      if (
        origin === config.frontendUrl ||
        origin.endsWith('.vercel.app') ||
        allowedDevOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(requestLogger);

// API Base Router
app.use('/api', apiRouter);

// Root info route
app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({
    name: 'CareFlow AI Backend API',
    version: '1.0.0',
    theme: 'Smart Automation - Hospital Operations',
    health: '/api/health',
    docs: 'Refer to /careflow-ai/README.md for operational guidelines.',
  });
});

// Centralized error handling
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 CareFlow AI Hospital Operations Server Active`);
  console.log(`📡 Listening on: http://localhost:${config.port}`);
  console.log(`🩺 Mode: ${config.nodeEnv}`);
  console.log(`🤖 AI Engine: ${config.hasGemini ? 'Google Gemini (gemini-3.5-flash)' : 'Groq / Deterministic NLP'}`);
  console.log(`🗄️ Database: ${config.hasSupabase ? 'Supabase PostgreSQL' : 'Synthetic High-Fidelity Store'}`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
