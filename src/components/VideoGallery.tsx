
import React from 'react';
import { Play } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: "Cinematic Nature",
    description: "A beautiful cinematic nature reel showcasing landscapes",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
  },
  {
    id: 2,
    title: "Urban Life",
    description: "City life captured in slow motion",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4"
  },
  {
    id: 3,
    title: "Ocean Waves",
    description: "Calming footage of ocean waves",
    thumbnail: "https://images.unsplash.com/photo-1518877593221-1f28583780b4",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4"
  }
];

const VideoGallery: React.FC = () => {
  const videoRefs = React.useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleVideoClick = (id: number) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        // Pause all other videos
        Object.values(videoRefs.current).forEach(v => {
          if (v && v !== video && !v.paused) {
            v.pause();
          }
        });
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="glass-panel rounded-xl overflow-hidden animate-fade-in">
            <div className="relative aspect-video cursor-pointer group" onClick={() => handleVideoClick(video.id)}>
              <video 
                ref={el => videoRefs.current[video.id] = el}
                className="w-full h-full object-cover"
                poster={video.thumbnail}
                src={video.videoUrl}
                preload="metadata"
                playsInline
                muted
                loop
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-cosmic/50 group-hover:bg-cosmic/30 transition-colors">
                <div className="h-16 w-16 rounded-full glass-panel flex items-center justify-center">
                  <Play size={28} className="text-white ml-1" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{video.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
