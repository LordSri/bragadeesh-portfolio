import React from 'react';
import { Instagram, Award, MessageSquare, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="w-full bg-black/80 backdrop-blur-xl border-t border-white/10 mt-24">
      {/* About section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div id="about" className="glass-morphism rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 leading-relaxed">
                I am a creative professional with a passion for visual storytelling. My work spans across photography, 
                videography, cinematography, and graphic design, always striving to capture moments and emotions 
                that resonate with audiences.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                With over 5 years of experience in the industry, I've had the opportunity to work with various clients, 
                from small businesses to major brands, helping them tell their stories through compelling visual content.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold text-white">Experience</h3>
              <div className="space-y-2">
                <div className="glass-morphism p-3 rounded-lg">
                  <h4 className="font-medium">Senior Photographer</h4>
                  <p className="text-sm text-gray-400">Creative Studio • 2020-Present</p>
                </div>
                <div className="glass-morphism p-3 rounded-lg px-[13px] my-[17px] py-[12px]">
                  <h4 className="font-medium">Videographer</h4>
                  <p className="text-sm text-gray-400">Media Productions • 2018-2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact section */}
      <div className="bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto p-8">
          <div id="contact" className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Let's Connect</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Jane Doe</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Creative professional specializing in photography, videography, cinematography, and graphic design.
                </p>
                <p className="text-sm text-gray-400">
                  Based in New York, NY<br />
                  Available for projects worldwide
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="mailto:jane.doe@example.com" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                    <div className="h-10 w-10 rounded-full glass-morphism flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Mail size={18} />
                    </div>
                    <span>Send me an email</span>
                  </a>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                    <div className="h-10 w-10 rounded-full glass-morphism flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <MessageSquare size={18} />
                    </div>
                    <span>Message on WhatsApp</span>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Follow Me</h3>
                <div className="flex gap-3 flex-wrap">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full glass-morphism flex items-center justify-center 
                    hover:bg-white/20 transition-all hover:scale-110">
                    <Instagram size={20} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full glass-morphism flex items-center justify-center 
                    hover:bg-white/20 transition-all hover:scale-110">
                    <Award size={20} />
                  </a>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full glass-morphism flex items-center justify-center 
                    hover:bg-white/20 transition-all hover:scale-110">
                    <MessageSquare size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            <Separator className="my-6 bg-white/10" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>
                © {currentYear} Jane Doe Portfolio. All rights reserved.
              </div>
              
              <div className="flex items-center">
                <span className="mr-1">Created with</span>
                <span className="text-red-500 mx-1">♥</span>
                <span>and modern web technologies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;