import express from 'express';
import cors from 'cors';
import config from './config';
import './config/firebase-admin';
import videosRouter from './routes/videos';

const app = express();

// CORS configuration
app.use(cors({
  origin: config.security.corsOrigin,
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/videos', videosRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});