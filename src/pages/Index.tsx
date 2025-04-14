
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import PhotoGallery from '@/components/PhotoGallery';
import VideoGallery from '@/components/VideoGallery';
import CinematographyTab from '@/components/CinematographyTab';
import GraphicDesignTab from '@/components/GraphicDesignTab';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      <div 
        className="fixed inset-0 -z-10 bg-cosmic" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a12 100%)',
          backgroundSize: '200% 200%',
          backgroundPosition: `${50 + scrollY * 0.02}% ${50 + scrollY * 0.02}%`
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,58,87,0.08)_0%,rgba(0,0,0,0)_70%)] opacity-70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(58,87,252,0.05)_0%,rgba(0,0,0,0)_70%)] opacity-70" 
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>
      </div>

      <Header />
      
      {/* Main content with padding for fixed header */}
      <div className="pt-20 w-full">
        {/* Hero Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 animate-fade-in">
              Capturing Moments, <br className="hidden md:block" /> Creating Memories
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
              Specializing in photography, videography, cinematography, and graphic design to bring your vision to life.
            </p>
          </div>
        </section>
        
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
          <div className="w-full overflow-x-auto">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <div className="mt-4 mb-8">
            {renderTabContent()}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
