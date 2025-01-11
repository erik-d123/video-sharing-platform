# VideoShare Platform

A full-stack video sharing platform built with Next.js and Firebase. Users can upload, share, and interact with videos through a modern, responsive interface. Features include real-time view counting, comments, and likes/dislikes, creating an engaging social media experience.

## Features

- **User Authentication**
  - Seamless Google sign-in integration
  - Protected routes for authenticated users
  - Personalized user profiles displaying uploaded videos

- **Video Management**
  - Direct video upload with automatic thumbnail generation
  - Accurate real-time view counting
  - Like/Dislike system with instant updates
  - Interactive comment section with real-time updates
  - Custom video player interface

- **Search & Discovery**
  - Instant video search functionality
  - Multiple sorting options (views/likes/date)
  - User profile filtering

## Getting Started

### Prerequisites

- Node.js v14 or later
- Firebase project configured with:
  - Authentication (Google provider enabled)
  - Firestore Database
  - Storage
  - Service Account credentials

### Installation

1. Clone and set up:
```bash
# Clone the repository
git clone https://github.com/yourusername/video-sharing-platform.git
cd video-sharing-platform

# Install all dependencies from root directory
npm run dev
```

2. Configure Firebase:

Create `.env.local` in root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB7q92wEWYC7AUYPpMgoCXu4sTDKZDjQRM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=video-sharing-platform-cc4e2.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=video-sharing-platform-cc4e2
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=video-sharing-platform-cc4e2.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=707297759354
NEXT_PUBLIC_FIREBASE_APP_ID=1:707297759354:web:671624a5f56b40473c6bc3
```

Create `.env` in backend directory:
```env
PORT=3001
FIREBASE_PROJECT_ID=video-sharing-platform-cc4e2
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-vk5g0@video-sharing-platform-cc4e2.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_STORAGE_BUCKET=video-sharing-platform-cc4e2.firebasestorage.app
```

### Running Locally

Run the development server:
```bash
npm run dev
```

This starts both frontend and backend servers:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

## Technical Architecture

### Frontend
- Next.js 13 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Firebase Client SDK for authentication and storage

### Backend
- Express.js server
- Firebase Admin SDK
- TypeScript
- Real-time database listeners

### Database & Storage
- Firestore for storing:
  - User profiles
  - Video metadata
  - Comments
  - Like/dislike data
- Firebase Storage for video files and thumbnails

## Core Features Explained

### Video Upload Process
1. User uploads video file
2. Automatic thumbnail generation from video
3. File storage in Firebase Storage
4. Metadata storage in Firestore

### View Counting System
- Real-time view updates
- View count increments on each unique video load
- Firestore transactions for accuracy

### Comment System
- Real-time comment updates
- Nested comment structure
- User information integration

## Project Structure
```
├── backend/                  # Express server
│   ├── src/
│   │   ├── config/          # Firebase admin config
│   │   ├── routes/          # API routes
│   │   └── server.ts        # Server entry
│   └── scripts/             # Utility scripts
├── src/                     # Frontend source
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Firebase config
│   └── utils/               # Utility functions
└── public/                  # Static files
```

## Development

### Available Scripts

```bash
# Run development server
npm run dev

# Run backend only
cd backend
npm run dev

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
