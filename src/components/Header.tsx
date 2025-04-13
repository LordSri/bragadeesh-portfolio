
import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="relative w-full px-4 md:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-auto">
            <img 
              src="/lovable-uploads/495eb352-ec66-420f-ad30-2b9f51c77218.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 md:p-8 mt-6 backdrop-blur-xl border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-glow bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Jane Doe</h1>
              <p className="text-lg text-gray-300 mb-4">Creative Professional</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-aurora-red" />
                  <span>jane.doe@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-aurora-red" />
                  <span>(123) 456-7890</span>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu - Inspired by sudhirshivaram.com */}
            <NavigationMenu className="mt-4 md:mt-0">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">Work</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[220px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex flex-col h-full w-full select-none space-y-2 rounded-md bg-white/5 p-4 hover:bg-white/10 transition-colors"
                            href="#"
                          >
                            <div className="text-lg font-medium text-white">Portfolio</div>
                            <p className="text-sm text-gray-300">
                              View my latest creative work and projects
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full glass-panel flex items-center justify-center 
                hover:bg-aurora-red/20 transition-colors">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
