'use client';
import { EventEmitter } from 'events';

let viewsEmitter: EventEmitter;
if (typeof window !== 'undefined') {
  viewsEmitter = new EventEmitter();
}

export const sampleVideo = {
  id: 'sample_video',
  title: 'Sample Video',
  userName: 'Sample User',
  userId: 'sample1',
  createdAt: '2024-01-02T17:00:00.000Z',
  views: 0,
  likes: 0,
  thumbnailUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
  videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  description: 'This is a sample video to demonstrate the platform functionality.'
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

export { viewsEmitter };