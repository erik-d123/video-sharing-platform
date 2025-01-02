import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase-admin';
import videosRouter from './routes/videos';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/videos', videosRouter);

const PORT = 3002; // Changed to 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});