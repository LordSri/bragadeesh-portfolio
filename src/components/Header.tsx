
import React from 'react';
import { Instagram, Award, MessageSquare } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 md:px-6 lg:px-8 bg-cosmic/80 backdrop-blur-md border-b border-white/10 animate-fade-in">
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="h-10 w-auto">
            <img 
              src="/lovable-uploads/495eb352-ec66-420f-ad30-2b9f51c77218.png"
              alt="Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => scrollToSection('work')}
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10 cursor-pointer")}
                >
                  Work
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => scrollToSection('about')}
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10 cursor-pointer")}
                >
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  onClick={() => scrollToSection('contact')}
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10 cursor-pointer")}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Social Icons */}
          <div className="flex gap-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
              className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
              hover:bg-aurora-red/20 transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" 
              className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
              hover:bg-aurora-red/20 transition-colors">
              <Award size={16} />
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" 
              className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
              hover:bg-aurora-red/20 transition-colors">
              <MessageSquare size={16} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
