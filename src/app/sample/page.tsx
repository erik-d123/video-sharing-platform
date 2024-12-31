'use client';

export default function SampleVideoPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sample Video</h1>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video 
          controls
          className="w-full h-full"
          poster="https://via.placeholder.com/1280x720"
        >
          <source 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Big Buck Bunny</h2>
        <p className="text-gray-600 mt-2">
          This is a sample video featuring Big Buck Bunny, commonly used for testing video playback.
        </p>
      </div>
    </div>
  );
}