
import React, { useState } from 'react';
import { Instagram, Award, MessageSquare, Menu } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu if it's open
    setIsOpen(false);
  };

  const NavigationLinks = () => (
    <>
      <div className="cursor-pointer" onClick={() => scrollToSection('work')}>
        Work
      </div>
      <div className="cursor-pointer" onClick={() => scrollToSection('about')}>
        About
      </div>
      <div className="cursor-pointer" onClick={() => scrollToSection('contact')}>
        Contact
      </div>
    </>
  );

  const SocialIcons = () => (
    <div className="flex gap-3 items-center">
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
        className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
        hover:bg-white/20 transition-colors">
        <Instagram size={16} />
      </a>
      <a href="#" target="_blank" rel="noopener noreferrer" 
        className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
        hover:bg-white/20 transition-colors">
        <Award size={16} />
      </a>
      <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" 
        className="h-8 w-8 rounded-full glass-panel flex items-center justify-center 
        hover:bg-white/20 transition-colors">
        <MessageSquare size={16} />
      </a>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40">
      <div className="w-full backdrop-blur-xl bg-black/50 border-b border-white/10 shadow-lg">
        <div className="max-w-[2000px] mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-8 md:h-10 w-auto">
              <img 
                src="/lovable-uploads/495eb352-ec66-420f-ad30-2b9f51c77218.png"
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-end space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
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
            <SocialIcons />
          </div>
          
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="h-9 w-9 rounded-full glass-panel flex items-center justify-center">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] bg-black/95 backdrop-blur-xl border-l border-white/10 p-0">
                <div className="flex flex-col h-full p-6">
                  <div className="flex justify-end mb-8">
                    {/* Removed the duplicate X button here */}
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="h-9 w-9 rounded-full glass-panel flex items-center justify-center"
                    >
                      <img 
                        src="/lovable-uploads/7fda52d4-7cb3-4647-ab16-3706a07e11e9.png" 
                        alt="Close" 
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                  
                  <nav className="flex flex-col space-y-6 text-lg font-medium text-white">
                    <NavigationLinks />
                  </nav>
                  
                  <div className="mt-auto pt-8 pb-4">
                    <div className="text-sm text-gray-400 mb-4">Follow me</div>
                    <SocialIcons />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
