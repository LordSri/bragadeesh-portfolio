
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
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 mt-6">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-4 mb-8">
          {renderTabContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
