
import React from 'react';
import { Instagram, Linkedin, Twitter, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-panel rounded-xl p-8 backdrop-blur-md border border-white/5">
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
              <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-aurora-red" />
                  <a href="mailto:jane.doe@example.com" className="hover:text-white transition-colors">
                    jane.doe@example.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-aurora-red">☎</span>
                  <a href="tel:+11234567890" className="hover:text-white transition-colors">
                    (123) 456-7890
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Connect</h3>
              <div className="flex gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                  className="h-10 w-10 rounded-full glass-panel flex items-center justify-center 
                  hover:bg-aurora-red/20 transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                  className="h-10 w-10 rounded-full glass-panel flex items-center justify-center 
                  hover:bg-aurora-red/20 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                  className="h-10 w-10 rounded-full glass-panel flex items-center justify-center 
                  hover:bg-aurora-red/20 transition-colors">
                  <Twitter size={18} />
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
              <span className="text-aurora-red mx-1">♥</span>
              <span>and modern web technologies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
