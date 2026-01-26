import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberLogin = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const translations = {
    sv: {
      title: 'Medlemsinloggning',
      subtitle: 'Logga in för att komma åt medlemsområdet',
      email: 'E-postadress',
      password: 'Lösenord',
      login: 'Logga in',
      loggingIn: 'Loggar in...',
      backToHome: 'Tillbaka till startsidan',
      welcome: 'Välkommen!',
      loginSuccess: 'Du är nu inloggad'
    },
    en: {
      title: 'Member Login',
      subtitle: 'Log in to access the members area',
      email: 'Email address',
      password: 'Password',
      login: 'Log in',
      loggingIn: 'Logging in...',
      backToHome: 'Back to home',
      welcome: 'Welcome!',
      loginSuccess: 'You are now logged in'
    },
    ar: {
      title: 'تسجيل دخول الأعضاء',
      subtitle: 'سجل الدخول للوصول إلى منطقة الأعضاء',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      loggingIn: 'جاري تسجيل الدخول...',
      backToHome: 'العودة إلى الصفحة الرئيسية',
      welcome: 'أهلاً وسهلاً!',
      loginSuccess: 'تم تسجيل الدخول بنجاح'
    }
  };

  const txt = translations[language] || translations.sv;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('memberToken', data.token);
        localStorage.setItem('memberData', JSON.stringify(data.member));
        toast.success(txt.welcome, { description: txt.loginSuccess });
        navigate('/mina-sidor');
      } else {
        toast.error(data.detail || 'Inloggning misslyckades');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ett fel uppstod vid inloggning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-20 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 text-haggai hover:text-haggai-dark"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {txt.backToHome}
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-haggai rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-stone-800">
                {txt.title}
              </CardTitle>
              <p className="text-stone-500 mt-2">{txt.subtitle}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-stone-700">
                    {txt.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="din.email@exempel.se"
                      required
                      data-testid="member-login-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-stone-700">
                    {txt.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                      data-testid="member-login-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-haggai hover:bg-haggai-dark text-white py-6"
                  disabled={loading}
                  data-testid="member-login-submit"
                >
                  {loading ? txt.loggingIn : txt.login}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-stone-500">
                  Glömt lösenord? <Link to="/medlem/glomt-losenord" className="text-haggai hover:underline font-medium">Återställ här</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
