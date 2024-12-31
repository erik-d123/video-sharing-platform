import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase-admin';
import videosRouter from './routes/videos';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api/videos', videosRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});