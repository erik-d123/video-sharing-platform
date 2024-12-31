'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

export default function UploadForm() {
 const [file, setFile] = useState<File | null>(null);
 const [thumbnail, setThumbnail] = useState<File | null>(null);
 const [autoThumbnail, setAutoThumbnail] = useState(true);
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [uploading, setUploading] = useState(false);
 const [progress, setProgress] = useState(0);
 const [error, setError] = useState('');
 const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
 const videoRef = useRef<HTMLVideoElement>(null);
 
 const router = useRouter();
 const { user } = useAuth();

 const generateThumbnail = async (videoFile: File): Promise<string> => {
   return new Promise((resolve) => {
     const video = document.createElement('video');
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');

     video.onloadedmetadata = () => {
       // Generate thumbnail at 25% of the video duration
       video.currentTime = video.duration * 0.25;
     };

     video.onseeked = () => {
       canvas.width = video.videoWidth;
       canvas.height = video.videoHeight;
       ctx?.drawImage(video, 0, 0);
       canvas.toBlob((blob) => {
         if (blob) {
           const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
           setThumbnail(thumbnailFile);
           const previewUrl = URL.createObjectURL(blob);
           setThumbnailPreview(previewUrl);
           resolve(previewUrl);
         }
       }, 'image/jpeg', 0.7);
     };

     video.src = URL.createObjectURL(videoFile);
   });
 };

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const selectedFile = e.target.files?.[0];
   if (selectedFile && selectedFile.type.startsWith('video/')) {
     setFile(selectedFile);
     if (autoThumbnail) {
       await generateThumbnail(selectedFile);
     }
   }
 };

 const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const selectedFile = e.target.files?.[0];
   if (selectedFile && selectedFile.type.startsWith('image/')) {
     setThumbnail(selectedFile);
     setThumbnailPreview(URL.createObjectURL(selectedFile));
     setAutoThumbnail(false);
   }
 };

 const getUploadUrl = async (fileName: string, contentType: string) => {
   try {
     const response = await fetch('http://localhost:3001/api/videos/upload-url', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ fileName, contentType }),
     });
     if (!response.ok) {
       throw new Error('Failed to get upload URL');
     }
     return response.json();
   } catch (error) {
     console.error('Error getting upload URL:', error);
     throw error;
   }
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!file || !user || !thumbnail) return;

   try {
     setUploading(true);
     setError('');

     // Generate unique filenames
     const videoExtension = file.name.split('.').pop();
     const videoFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${videoExtension}`;
     const thumbnailFileName = `thumbnail-${videoFileName.split('.')[0]}.jpg`;
     
     // Upload video
     const { url: videoUrl, filePath: videoPath } = await getUploadUrl(videoFileName, file.type);
     await fetch(videoUrl, {
       method: 'PUT',
       body: file,
       headers: {
         'Content-Type': file.type,
       },
     });

     // Upload thumbnail
     const { url: thumbnailUrl, filePath: thumbnailPath } = await getUploadUrl(thumbnailFileName, thumbnail.type);
     await fetch(thumbnailUrl, {
       method: 'PUT',
       body: thumbnail,
       headers: {
         'Content-Type': thumbnail.type,
       },
     });

     // Save metadata to Firestore
     const videoData = {
       title,
       description,
       videoUrl: `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/${videoPath}`,
       thumbnailUrl: `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/${thumbnailPath}`,
       userId: user.uid,
       userName: user.displayName || user.email,
       createdAt: new Date().toISOString(),
       views: 0,
       likes: 0,
       status: 'processing'
     };

     const docRef = await addDoc(collection(db, 'videos'), videoData);

     // Trigger video processing
     await fetch('http://localhost:3001/api/videos/process', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ videoId: docRef.id }),
     });

     setUploading(false);
     router.push('/');
   } catch (err) {
     setError(err instanceof Error ? err.message : 'Upload failed');
     setUploading(false);
     console.error('Upload error:', err);
   }
 };

 return (
   <div className="max-w-2xl mx-auto p-4">
     {error && (
       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
         {error}
       </div>
     )}

     <form onSubmit={handleSubmit} className="space-y-6">
       <div>
         <label className="block text-sm font-medium text-gray-700">Video File</label>
         <input
           type="file"
           accept="video/*"
           onChange={handleFileChange}
           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
           required
         />
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
         <div className="mt-2 space-y-2">
           <div className="flex items-center space-x-4">
             <input
               type="file"
               accept="image/*"
               onChange={handleThumbnailChange}
               disabled={autoThumbnail}
               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
             />
             <label className="inline-flex items-center">
               <input
                 type="checkbox"
                 checked={autoThumbnail}
                 onChange={(e) => setAutoThumbnail(e.target.checked)}
                 className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
               />
               <span className="ml-2 text-sm text-gray-600">Auto-generate</span>
             </label>
           </div>
           {thumbnailPreview && (
             <div className="mt-2">
               <img
                 src={thumbnailPreview}
                 alt="Thumbnail preview"
                 className="max-h-40 rounded-lg"
               />
             </div>
           )}
         </div>
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700">Title</label>
         <input
           type="text"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
           required
         />
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700">Description</label>
         <textarea
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           rows={4}
           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
         />
       </div>

       {uploading && (
         <div className="space-y-2">
           <div className="w-full bg-gray-200 rounded-full h-2.5">
             <div 
               className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
               style={{ width: `${progress}%` }}
             ></div>
           </div>
           <p className="text-sm text-gray-600 text-center">{progress.toFixed(0)}% uploaded</p>
         </div>
       )}

       <button
         type="submit"
         disabled={uploading}
         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
       >
         {uploading ? 'Uploading...' : 'Upload Video'}
       </button>
     </form>
   </div>
 );
}