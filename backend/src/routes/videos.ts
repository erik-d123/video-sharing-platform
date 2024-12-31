import express, { Request, Response, Router } from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { db, storage } from '../config/firebase-admin';

const router: Router = express.Router();
const pubsub = new PubSub();
const bucket = storage.bucket();

// Topic name for video processing
const VIDEO_PROCESSING_TOPIC = 'video-processing';

type ProcessVideoRequest = {
  videoId: string;
};

type UploadUrlRequest = {
  fileName: string;
  contentType: string;
};

// Process video after upload
router.post(
  '/process',
  (req: Request<{}, {}, ProcessVideoRequest>, res: Response) => {
    const { videoId } = req.body;
    
    try {
      // Get video data from Firestore
      db.collection('videos')
        .doc(videoId)
        .get()
        .then((videoDoc) => {
          const videoData = videoDoc.data();

          if (!videoData) {
            return res.status(404).json({ error: 'Video not found' });
          }

          // Publish message to Pub/Sub for processing
          const message = {
            videoId,
            videoUrl: videoData.videoUrl,
          };

          const messageBuffer = Buffer.from(JSON.stringify(message));
          pubsub
            .topic(VIDEO_PROCESSING_TOPIC)
            .publish(messageBuffer)
            .then(() => {
              res.json({ message: 'Video processing started' });
            })
            .catch((error) => {
              console.error('Error publishing to Pub/Sub:', error);
              res.status(500).json({ error: 'Failed to process video' });
            });
        })
        .catch((error) => {
          console.error('Error getting video data:', error);
          res.status(500).json({ error: 'Failed to get video data' });
        });
    } catch (error) {
      console.error('Error processing video:', error);
      res.status(500).json({ error: 'Failed to process video' });
    }
  }
);

// Get signed URL for video upload
router.post(
  '/upload-url',
  (req: Request<{}, {}, UploadUrlRequest>, res: Response) => {
    const { fileName, contentType } = req.body;
    const filePath = `videos/${fileName}`;

    try {
      bucket
        .file(filePath)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          contentType,
        })
        .then(([url]) => {
          res.json({ url, filePath });
        })
        .catch((error) => {
          console.error('Error generating upload URL:', error);
          res.status(500).json({ error: 'Failed to generate upload URL' });
        });
    } catch (error) {
      console.error('Error generating upload URL:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  }
);

export default router;