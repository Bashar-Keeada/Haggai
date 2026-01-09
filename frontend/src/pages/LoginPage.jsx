import React, { useState } from 'react';
import { Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();

  const translations = {
    sv: {
      title: 'Välkommen till Haggai Sweden',
      subtitle: 'Ange lösenord för att komma åt hemsidan',
      passwordLabel: 'Lösenord',
      passwordPlaceholder: 'Ange lösenord...',
      loginButton: 'Logga in',
      errorMessage: 'Fel lösenord. Försök igen.',
      contactInfo: 'Kontakta oss för att få tillgång'
    },
    en: {
      title: 'Welcome to Haggai Sweden',
      subtitle: 'Enter password to access the website',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password...',
      loginButton: 'Log in',
      errorMessage: 'Wrong password. Try again.',
      contactInfo: 'Contact us to get access'
    },
    ar: {
      title: 'مرحباً بكم في هجاي السويد',
      subtitle: 'أدخل كلمة المرور للوصول إلى الموقع',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور...',
      loginButton: 'تسجيل الدخول',
      errorMessage: 'كلمة المرور خاطئة. حاول مرة أخرى.',
      contactInfo: 'اتصل بنا للحصول على حق الوصول'
    }
  };

  const txt = translations[language] || translations.sv;

  const languages = [
    { code: 'sv', name: 'Svenska' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(password);
    if (!success) {
      setError(txt.errorMessage);
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-haggai-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cream-300/40 rounded-full blur-3xl" />
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              language === lang.code
                ? 'bg-haggai text-cream-50'
                : 'bg-white/80 text-stone-700 hover:bg-white'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl relative z-10">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/haggai-logo.png" 
              alt="Haggai International" 
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.title}</h1>
            <p className="text-stone-600">{txt.subtitle}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-sm font-medium text-stone-700 ${isRTL ? 'text-right' : ''}`}>
                {txt.passwordLabel}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-stone-400" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={txt.passwordPlaceholder}
                  className={`${isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} py-6 rounded-xl border-stone-200 focus:border-haggai focus:ring-haggai`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className={`p-3 bg-red-50 border border-red-200 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password}
              className={`w-full bg-haggai hover:bg-haggai-light text-cream-50 py-6 text-lg rounded-xl shadow-lg transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {txt.loginButton}
                  <LogIn className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </>
              )}
            </Button>
          </form>

          {/* Contact Info */}
          <div className={`mt-8 pt-6 border-t border-stone-200 text-center ${isRTL ? 'text-right' : ''}`}>
            <p className="text-sm text-stone-500">{txt.contactInfo}</p>
            <a href="tel:+46707825082" className="text-haggai hover:text-haggai-light text-sm font-medium">
              +46 70 782 50 82
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
