// src/components/video/VideoInteraction.tsx

'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistance } from 'date-fns';
import { doc, setDoc, deleteDoc, updateDoc, getDoc, collection, addDoc, increment, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Comment {
 id: string;
 text: string;
 userId: string;
 userName: string;
 userImage: string;
 createdAt: string;
}

interface VideoInteractionProps {
 videoId: string;
}

export default function VideoInteraction({ videoId }: VideoInteractionProps) {
 const { user } = useAuth();
 const [likes, setLikes] = useState(0);
 const [dislikes, setDislikes] = useState(0);
 const [liked, setLiked] = useState(false);
 const [disliked, setDisliked] = useState(false);
 const [comment, setComment] = useState('');
 const [comments, setComments] = useState<Comment[]>([]);

 useEffect(() => {
   const initVideo = async () => {
     const videoRef = doc(db, 'videos', videoId);
     const videoDoc = await getDoc(videoRef);
     if (!videoDoc.exists()) {
       await setDoc(videoRef, {
         likes: 0,
         dislikes: 0,
         createdAt: new Date().toISOString()
       });
     }
   };
   
   initVideo();

   const videoRef = doc(db, 'videos', videoId);
   const unsubVideo = onSnapshot(videoRef, (doc) => {
     if (doc.exists()) {
       const data = doc.data();
       setLikes(data.likes || 0);
       setDislikes(data.dislikes || 0);
     }
   });

   const commentsRef = query(
     collection(db, 'comments'),
     where('videoId', '==', videoId)
   );

   const unsubComments = onSnapshot(commentsRef, (snapshot) => {
     const newComments = snapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     } as Comment));
     setComments(newComments);
   });

   if (user) {
     const checkReactions = async () => {
       const likeRef = doc(db, 'likes', `${user.uid}_${videoId}`);
       const dislikeRef = doc(db, 'dislikes', `${user.uid}_${videoId}`);
       
       const [likeDoc, dislikeDoc] = await Promise.all([
         getDoc(likeRef),
         getDoc(dislikeRef)
       ]);
       
       setLiked(likeDoc.exists());
       setDisliked(dislikeDoc.exists());
     };
     checkReactions();
   }

   return () => {
     unsubVideo();
     unsubComments();
   };
 }, [videoId, user]);

 const handleLike = async () => {
   if (!user) {
     alert('Please sign in to like videos');
     return;
   }

   const likeRef = doc(db, 'likes', `${user.uid}_${videoId}`);
   const dislikeRef = doc(db, 'dislikes', `${user.uid}_${videoId}`);
   const videoRef = doc(db, 'videos', videoId);

   try {
     // First check if video document exists
     const videoDoc = await getDoc(videoRef);
     if (!videoDoc.exists()) {
       // Create the video document if it doesn't exist
       await setDoc(videoRef, {
         likes: 0,
         dislikes: 0,
         createdAt: new Date().toISOString()
       });
     }

     if (liked) {
       await deleteDoc(likeRef);
       await updateDoc(videoRef, {
         likes: increment(-1)
       });
       setLiked(false);
     } else {
       await setDoc(likeRef, {
         userId: user.uid,
         createdAt: new Date().toISOString()
       });
       await updateDoc(videoRef, {
         likes: increment(1)
       });
       setLiked(true);

       if (disliked) {
         await deleteDoc(dislikeRef);
         await updateDoc(videoRef, {
           dislikes: increment(-1)
         });
         setDisliked(false);
       }
     }
   } catch (error) {
     console.error('Error updating like:', error);
   }
 };

 const handleDislike = async () => {
   if (!user) {
     alert('Please sign in to dislike videos');
     return;
   }

   const likeRef = doc(db, 'likes', `${user.uid}_${videoId}`);
   const dislikeRef = doc(db, 'dislikes', `${user.uid}_${videoId}`);
   const videoRef = doc(db, 'videos', videoId);

   try {
     // First check if video document exists
     const videoDoc = await getDoc(videoRef);
     if (!videoDoc.exists()) {
       // Create the video document if it doesn't exist
       await setDoc(videoRef, {
         likes: 0,
         dislikes: 0,
         createdAt: new Date().toISOString()
       });
     }

     if (disliked) {
       await deleteDoc(dislikeRef);
       await updateDoc(videoRef, {
         dislikes: increment(-1)
       });
       setDisliked(false);
     } else {
       await setDoc(dislikeRef, {
         userId: user.uid,
         createdAt: new Date().toISOString()
       });
       await updateDoc(videoRef, {
         dislikes: increment(1)
       });
       setDisliked(true);

       if (liked) {
         await deleteDoc(likeRef);
         await updateDoc(videoRef, {
           likes: increment(-1)
         });
         setLiked(false);
       }
     }
   } catch (error) {
     console.error('Error updating dislike:', error);
   }
 };

 const handleComment = async () => {
   if (!user || !comment.trim()) return;

   try {
     await addDoc(collection(db, 'comments'), {
       videoId,
       userId: user.uid,
       userName: user.displayName || user.email || 'Anonymous',
       userImage: user.photoURL || 'https://via.placeholder.com/40',
       text: comment.trim(),
       createdAt: new Date().toISOString()
     });
     setComment('');
   } catch (error) {
     console.error('Error adding comment:', error);
   }
 };

 return (
   <div className="space-y-6">
     <div className="flex items-center space-x-4">
       <button
         onClick={handleLike}
         className={`flex items-center space-x-1 ${
           liked ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
         }`}
       >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
         </svg>
         <span>{likes}</span>
       </button>

       <button
         onClick={handleDislike}
         className={`flex items-center space-x-1 ${
           disliked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
         }`}
       >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={disliked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
         </svg>
         <span>{dislikes}</span>
       </button>
     </div>

     <div className="border-t border-gray-200 pt-6">
       <h3 className="text-lg font-semibold mb-4">Comments</h3>
       {user ? (
         <div className="flex space-x-3">
           <img 
             src={user.photoURL || 'https://via.placeholder.com/40'} 
             alt={user.displayName || 'User'} 
             className="w-10 h-10 rounded-full"
           />
           <div className="flex-1">
             <textarea
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Add a comment..."
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
               rows={3}
             />
             <div className="mt-2 flex justify-end">
               <button
                 onClick={handleComment}
                 disabled={!comment.trim()}
                 className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
               >
                 Comment
               </button>
             </div>
           </div>
         </div>
       ) : (
         <p className="text-gray-600">Please sign in to comment</p>
       )}

       <div className="mt-6 space-y-4">
         {comments.map((comment) => (
           <div key={comment.id} className="flex space-x-3">
             <img 
               src={comment.userImage} 
               alt={comment.userName} 
               className="w-10 h-10 rounded-full"
             />
             <div>
               <div className="flex items-center space-x-2">
                 <span className="font-medium">{comment.userName}</span>
                 <span className="text-gray-500 text-sm">
                   {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                 </span>
               </div>
               <p className="text-gray-700 mt-1">{comment.text}</p>
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );
}