import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ParticipantLogin = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const txt = {
    sv: {
      title: 'Deltagare Portal',
      subtitle: 'Logga in för att se din namnbricka, agenda och workshop-information',
      email: 'E-postadress',
      password: 'Lösenord',
      login: 'Logga in',
      forgotPassword: 'Glömt lösenord?',
      resetHere: 'Återställ här',
      loginError: 'Fel e-post eller lösenord'
    },
    en: {
      title: 'Participant Portal',
      subtitle: 'Log in to see your name badge, agenda and workshop information',
      email: 'Email',
      password: 'Password',
      login: 'Log in',
      forgotPassword: 'Forgot password?',
      resetHere: 'Reset here',
      loginError: 'Wrong email or password'
    }
  };

  const t = txt[language] || txt.sv;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('participant_token', data.token);
        localStorage.setItem('participant_info', JSON.stringify(data.participant));
        navigate('/deltagare/portal');
      } else {
        toast.error(t.loginError);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(t.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0891B2] to-[#0e7490] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-stone-800">{t.title}</CardTitle>
          <p className="text-sm text-stone-600 mt-2">{t.subtitle}</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t.email}
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
                required
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t.password}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={isRTL ? 'text-right pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0891B2] to-[#0e7490] hover:from-[#0e7490] hover:to-[#0891B2] text-white"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {t.login}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              {t.forgotPassword} <Link to="/deltagare/glomt-losenord" className="text-haggai hover:underline font-medium">{t.resetHere}</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantLogin;
