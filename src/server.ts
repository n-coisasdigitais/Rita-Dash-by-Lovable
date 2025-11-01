import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import keywordsRouter from './routes/keywords';
import metricsRouter from './routes/metrics';
import hourlyRouter from './routes/hourly';
import geographicRouter from './routes/geographic';
import audienceRouter from './routes/audience';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
app.use((req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (!apiKey || apiKey !== process.env.MIDDLEWARE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/sync/keywords', keywordsRouter);
app.use('/sync/metrics', metricsRouter);
app.use('/sync/hourly-metrics', hourlyRouter);
app.use('/sync/geographic-metrics', geographicRouter);
app.use('/sync/audience-insights', audienceRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Middleware running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
