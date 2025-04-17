
import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import PhotoGallery from '@/components/PhotoGallery';
import VideoGallery from '@/components/VideoGallery';
import CinematographyTab from '@/components/CinematographyTab';
import GraphicDesignTab from '@/components/GraphicDesignTab';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const workSectionRef = useRef<HTMLDivElement>(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'photos':
        return <PhotoGallery />;
      case 'videography':
        return <VideoGallery />;
      case 'cinematography':
        return <CinematographyTab />;
      case 'graphic-design':
        return <GraphicDesignTab />;
      default:
        return <PhotoGallery />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10" style={{
        background: 'radial-gradient(circle at 50% 50%, #1a0a0e 0%, #0a0808 100%)'
      }}>
        {/* Animated particles/stars effect */}
        <div className="stars-container absolute inset-0 opacity-70">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full animate-pulse-slow" style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.3
            }} />
          ))}
        </div>
        
        {/* Static gradient overlays for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,58,87,0.15)_0%,rgba(0,0,0,0)_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,200,200,0.05)_0%,rgba(0,0,0,0)_70%)] opacity-70" />
      </div>

      {/* Header */}
      <Header />
      
      {/* Main content with increased padding for header */}
      <div className="pt-28 w-full">
        {/* Hero Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="mb-10 relative inline-block">
              <h2 className="text-4xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 animate-fade-in leading-tight py-4 px-4 my-0 text-center md:text-6xl">
                Capturing Moments, <br className="hidden md:block" /> Creating Memories
              </h2>
              <div className="absolute -inset-1 blur-xl bg-red-500/10 rounded-full -z-10"></div>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in mt-6">
              Specializing in photography, videography, cinematography, and graphic design to bring your vision to life.
            </p>
          </div>
        </section>
        
        <main id="work" ref={workSectionRef} className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 relative">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="mt-8 mb-16">
            {renderTabContent()}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
