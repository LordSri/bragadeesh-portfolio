
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="glass-panel rounded-xl p-4 backdrop-blur-md border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-sm text-gray-400">
              © {currentYear} Jane Doe Portfolio. All rights reserved.
            </div>
            
            <div className="text-xs text-gray-500 flex items-center">
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
