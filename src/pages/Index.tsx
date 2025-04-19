
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
      <div className="pt-20 md:pt-28 w-full">
        {/* Hero Section */}
        <section className="py-8 md:py-16 px-4 w-full mx-auto relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="mb-6 md:mb-10 relative inline-block">
              <h2 className="text-3xl md:text-4xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 animate-fade-in leading-tight py-4 px-4 my-0 text-center">
                Capturing Moments, <br className="hidden md:block" /> Creating Memories
              </h2>
              <div className="absolute -inset-1 blur-xl bg-red-500/10 rounded-full -z-10"></div>
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in mt-4 md:mt-6">
              Specializing in photography, videography, cinematography, and graphic design to bring your vision to life.
            </p>
          </div>
        </section>
        
        <main id="work" ref={workSectionRef} className="flex-grow w-full mx-auto relative">
          {/* Tab Navigation - Now static */}
          <div className="w-full bg-black/86 py-2 border-y border-white/10 shadow-lg">
            <div className="max-w-[2000px] mx-auto px-4">
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
          
          {/* Content with padding */}
          <div className="px-4 py-6 max-w-[2000px] mx-auto">
            {/* Coming Soon Overlays for inactive tabs */}
            {activeTab !== 'photos' && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/86 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
                  <p className="text-gray-400">This section is currently under development</p>
                </div>
              </div>
            )}
            {renderTabContent()}
          </div>
        </main>
      </div>
      
      <Footer />

      {/* Add script to prevent right-click on images */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('contextmenu', function(e) {
              if (e.target.nodeName === 'IMG') {
                e.preventDefault();
                return false;
              }
            });
            
            // Add smooth scrolling behavior to the document
            document.documentElement.style.scrollBehavior = 'smooth';
          `
        }} 
      />
    </div>
  );
};

export default Index;
