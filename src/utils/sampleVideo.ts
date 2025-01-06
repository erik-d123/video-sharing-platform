'use client';
import { EventEmitter } from 'events';

let viewsEmitter: EventEmitter;
if (typeof window !== 'undefined') {
  viewsEmitter = new EventEmitter();
}

const SAMPLE_USER_ID = 'sample1';

export const sampleVideo = {
  id: 'sample_video',
  title: 'Sample Video',
  userName: 'Sample User',
  userId: SAMPLE_USER_ID,
  createdAt: '2024-01-02T17:00:00.000Z',
  views: 0,
  likes: 0,
  thumbnailUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
  videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  description: 'This is a sample video to demonstrate the platform functionality.'
};

export const sampleUser = {
  id: SAMPLE_USER_ID,
  displayName: 'Sample User',
  email: 'sample@example.com',
  photoURL: 'https://robohash.org/sample1?set=set4' // Using Robohash for reliable avatar
};

export const getSampleVideoViews = () => {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('sample_video_views') || '0');
};

export const incrementSampleVideoViews = () => {
  const currentViews = getSampleVideoViews();
  const newViews = currentViews + 1;
  localStorage.setItem('sample_video_views', newViews.toString());
  if (viewsEmitter) {
    viewsEmitter.emit('viewsUpdated', newViews);
  }
  return newViews;
};