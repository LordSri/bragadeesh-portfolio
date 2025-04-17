
import React, { useState, useEffect, useRef } from 'react';
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
  const [headerDocked, setHeaderDocked] = useState(true);
  const [footerDocked, setFooterDocked] = useState(false);
  const workSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Header docking logic - simplified for linearity
      setHeaderDocked(window.scrollY <= 50);

      // Footer docking logic
      if (footerRef.current) {
        const footerPosition = footerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if footer is at the bottom of viewport
        setFooterDocked(footerPosition.bottom <= windowHeight + 50);
      }
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
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

  return <div className="min-h-screen flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10" style={{
      background: 'radial-gradient(circle at 50% 50%, #1a0a0e 0%, #0a0808 100%)'
    }}>
        {/* Animated particles/stars effect */}
        <div className="stars-container absolute inset-0 opacity-70">
          {[...Array(20)].map((_, i) => <div key={i} className="absolute bg-white rounded-full animate-pulse-slow" style={{
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5 + 0.3
        }} />)}
        </div>
        
        {/* Gradient overlays that move with scroll */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(252,58,87,0.15)_0%,rgba(0,0,0,0)_70%)] opacity-70" style={{
        transform: `translateY(${scrollY * 0.03}px)`
      }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,200,200,0.05)_0%,rgba(0,0,0,0)_70%)] opacity-70" style={{
        transform: `translateY(${-scrollY * 0.02}px)`
      }} />
      </div>

      {/* Header with simplified docking effect - only vertical movement, no horizontal repositioning */}
      <div className={`fixed ${headerDocked ? 'top-0' : 'top-4'} transition-all duration-300 ease-linear z-40 w-full px-4`}>
        <div className={`mx-auto max-w-7xl ${headerDocked ? 'rounded-none' : 'rounded-2xl'} bg-black/60 backdrop-blur-lg border-b border-red-500/20 shadow-lg`}>
          <Header />
        </div>
      </div>
      
      {/* Main content with increased padding for floating header */}
      <div className={`pt-28 w-full`}>
        {/* Hero Section with parallax effect */}
        <section className="py-16 px-4 max-w-7xl mx-auto relative" style={{
        perspective: '1000px'
      }}>
          <div className="text-center mb-16">
            <div className="mb-10 relative inline-block" style={{
            transform: `translateY(${scrollY * 0.08}px) translateZ(${scrollY * 0.05}px)`,
            opacity: Math.max(0, 1 - scrollY * 0.001)
          }}>
              <h2 className="text-4xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 animate-fade-in leading-tight py-4 px-4 my-0 text-center md:text-6xl">
                Capturing Moments, <br className="hidden md:block" /> Creating Memories
              </h2>
              <div className="absolute -inset-1 blur-xl bg-red-500/10 rounded-full -z-10"></div>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in mt-6" style={{
            transform: `translateY(${scrollY * 0.05}px)`
          }}>
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
      
      <div ref={footerRef} className="relative mt-16">
        <Footer footerDocked={footerDocked} />
      </div>
    </div>;
};

export default Index;
