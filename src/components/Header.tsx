
import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 md:px-6 lg:px-8 bg-cosmic/80 backdrop-blur-md border-b border-white/10 animate-fade-in">
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="h-12 w-auto mr-6">
            <img 
              src="/lovable-uploads/495eb352-ec66-420f-ad30-2b9f51c77218.png"
              alt="Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:block">
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

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-aurora-red" />
              <span>jane.doe@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-aurora-red" />
              <span>(123) 456-7890</span>
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-2">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
              className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
              hover:bg-aurora-red/20 transition-colors">
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
