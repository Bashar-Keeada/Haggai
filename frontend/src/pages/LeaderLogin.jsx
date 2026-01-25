import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LeaderLogin = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const txt = {
    sv: {
      title: 'Ledarportalen',
      subtitle: 'Logga in för att se dina sessioner och hantera din profil',
      email: 'E-postadress',
      password: 'Lösenord',
      login: 'Logga in',
      loggingIn: 'Loggar in...',
      forgotPassword: 'Glömt lösenord?',
      noAccount: 'Har du ingen inbjudan?',
      contactAdmin: 'Kontakta administratören',
      errorInvalid: 'Fel e-post eller lösenord',
      errorPending: 'Din registrering väntar fortfarande på godkännande',
      errorGeneric: 'Något gick fel. Försök igen.'
    },
    en: {
      title: 'Leader Portal',
      subtitle: 'Log in to view your sessions and manage your profile',
      email: 'Email address',
      password: 'Password',
      login: 'Log in',
      loggingIn: 'Logging in...',
      forgotPassword: 'Forgot password?',
      noAccount: 'No invitation?',
      contactAdmin: 'Contact administrator',
      errorInvalid: 'Invalid email or password',
      errorPending: 'Your registration is still awaiting approval',
      errorGeneric: 'Something went wrong. Please try again.'
    }
  }[language] || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Store token and leader info
        localStorage.setItem('leader_token', data.token);
        localStorage.setItem('leader_info', JSON.stringify(data.leader));
        
        toast.success(language === 'sv' ? 'Inloggning lyckades!' : 'Login successful!');
        navigate('/ledare/portal');
      } else {
        const errorData = await response.json();
        if (response.status === 403) {
          setError(txt.errorPending);
        } else {
          setError(txt.errorInvalid);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(txt.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-cream-50 flex items-center justify-center px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-haggai rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">{txt.title}</h1>
          <p className="text-stone-500 mt-1">{txt.subtitle}</p>
        </div>
        
        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>{txt.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="din@email.se"
                    required
                    data-testid="leader-login-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{txt.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    data-testid="leader-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-haggai hover:bg-haggai-dark text-white"
                data-testid="leader-login-submit"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {txt.loggingIn}
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    {txt.login}
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-stone-500 text-sm">
                {txt.noAccount}{' '}
                <a href="mailto:info@haggai.se" className="text-haggai hover:underline">
                  {txt.contactAdmin}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="mt-8 text-center text-stone-400 text-sm">
          <p>Haggai Sweden | <a href="https://haggai.se" className="text-haggai hover:underline">haggai.se</a></p>
        </div>
      </div>
    </div>
  );
};

export default LeaderLogin;
