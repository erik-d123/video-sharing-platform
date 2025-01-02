import express from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

const router = express.Router();
const pubsub = new PubSub();
const db = getFirestore();
const bucket = getStorage().bucket();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Videos route is working!' });
});

// Get upload URL
router.post('/upload-url', async (req, res) => {
  console.log('Received upload URL request:', req.body);
  try {
    const { fileName, contentType } = req.body;
    
    if (!fileName || !contentType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const filePath = `videos/${fileName}`;

    const [url] = await bucket.file(filePath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    console.log('Generated signed URL for:', filePath);
    res.json({ url, filePath });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Process video
router.post('/process', async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Missing videoId' });
    }

    // For now, just return success
    res.json({ message: 'Video processing started' });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

export default router;