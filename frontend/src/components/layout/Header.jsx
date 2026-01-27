import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogOut, Settings, Users, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { logout } = useAuth();

  const leaderExpLabel = {
    sv: 'Leader Experience',
    en: 'Leader Experience',
    ar: 'خبرة قادة حجاي'
  };

  const leadersLabel = {
    sv: 'Ledare',
    en: 'Leaders',
    ar: 'القادة'
  };

  const donationsLabel = {
    sv: 'Ge en Gåva',
    en: 'Donate',
    ar: 'تبرع'
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/om-oss', label: t('nav.about') },
    { path: '/leader-experience', label: leaderExpLabel[language] || 'Leader Experience' },
    { path: '/ledare', label: leadersLabel[language] || 'Ledare' },
    { path: '/partners', label: language === 'sv' ? 'Partners' : language === 'ar' ? 'الشركاء' : 'Partners' },
    { path: '/kalender', label: t('nav.calendar') },
    { path: '/bli-medlem', label: t('nav.membership') },
    { path: '/donera', label: donationsLabel[language] || 'Ge en Gåva' },
    { path: '/kontakt', label: t('nav.contact') },
  ];

  const languages = [
    { code: 'sv', name: 'Svenska' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const membersLabel = {
    sv: 'Medlemsområde',
    en: 'Members Area',
    ar: 'منطقة الأعضاء'
  };

  const myPagesLabel = {
    sv: 'Mina Sidor',
    en: 'My Pages',
    ar: 'صفحاتي'
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link to="/" className={`flex items-center group`}>
            <img 
              src="/haggai-logo.png" 
              alt="Haggai International" 
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-haggai text-cream-50'
                    : 'text-stone-700 hover:bg-haggai-50 hover:text-haggai'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Settings Menu (Language + Admin + Logout) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2 text-stone-700 hover:bg-haggai-50">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[160px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer ${language === lang.code ? 'bg-haggai-50' : ''}`}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {lang.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/mina-sidor" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    {myPagesLabel[language]}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/medlemmar" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    {membersLabel[language]}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className={`lg:hidden flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Mobile Settings Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-stone-700">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white min-w-[160px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer ${language === lang.code ? 'bg-haggai-50' : ''}`}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {lang.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/mina-sidor" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    {myPagesLabel[language]}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/medlemmar" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    {membersLabel[language]}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-stone-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-cream-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isRTL ? 'text-right' : ''} ${
                    isActive(link.path)
                      ? 'bg-haggai text-cream-50'
                      : 'text-stone-700 hover:bg-haggai-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
