
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} Jane Doe Portfolio. All rights reserved.
            </div>
            
            <div className="text-sm text-gray-500">
              Made with <span className="text-aurora-red">♥</span> using modern web technologies
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
