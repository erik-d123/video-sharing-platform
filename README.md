# VideoShare Platform

A modern, full-stack video sharing platform built with Next.js and Firebase. This platform allows users to upload, share, and interact with videos in a familiar social media format, featuring real-time updates and a responsive design.

## Features

- **User Authentication**
  - Google sign-in integra
  - tion
  - Protected routes and content
  - User profiles with uploaded videos

- **Video Management**
  - Video upload with thumbnail generation
  - Real-time view counting
  - Like/Dislike functionality
  - Comment system
  - Custom video player

- **Search & Discovery**
  - Search functionality for videos
  - Video sorting by views, likes, and date
  - Profile-based video filtering

- **Real-time Updates**
  - Live view count updates
  - Instant like/dislike reflection
  - Real-time comment updates

## Technical Stack

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Client SDK

### Backend
- Node.js
- Express
- Firebase Admin SDK
- TypeScript

### Storage & Database
- Firebase Storage (video and thumbnail storage)
- Firestore (metadata and user data)
- Google Cloud Platform

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase project with Storage and Firestore enabled
- Google Cloud Platform account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-sharing-platform.git
cd video-sharing-platform
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:

Frontend (.env.local):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Backend (.env):
```env
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

4. Start the development servers:

```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend server
cd ..
npm run dev
```

## Usage

1. Visit `http://localhost:3000` to access the platform
2. Sign in with Google
3. Upload videos using the upload button in the navigation bar
4. Interact with videos through likes, comments, and views
5. Visit profiles to see user-specific video collections

## API Endpoints

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos/upload-url` - Get signed URL for video upload
- `POST /api/videos/process` - Process uploaded video

### Authentication
- Protected routes using Firebase Authentication
- Client-side session management

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   └── server.ts
│   └── scripts/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   └── utils/
└── public/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Firebase for authentication and storage solutions
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors who have helped shape this project
