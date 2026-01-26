import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberForgotPassword = () => {
  const { language, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const txt = {
    sv: {
      title: 'Återställ lösenord',
      subtitle: 'Ange din e-postadress så skickar vi en återställningslänk',
      email: 'E-postadress',
      sendLink: 'Skicka återställningslänk',
      backToLogin: 'Tillbaka till inloggning',
      successTitle: 'E-post skickat!',
      successMessage: 'Kolla din inkorg för återställningslänk',
      errorMessage: 'Kunde inte skicka e-post. Försök igen.'
    },
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your email and we will send you a reset link',
      email: 'Email',
      sendLink: 'Send reset link',
      backToLogin: 'Back to login',
      successTitle: 'Email sent!',
      successMessage: 'Check your inbox for reset link',
      errorMessage: 'Could not send email. Try again.'
    }
  };

  const t = txt[language] || txt.sv;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/members/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        toast.error(t.errorMessage);
      }
    } catch (err) {
      toast.error(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">{t.successTitle}</h2>
            <p className="text-stone-600 mb-6">{t.successMessage}</p>
            <Link to="/medlem-login">
              <Button className="bg-haggai">{t.backToLogin}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center">
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-haggai hover:bg-haggai-dark"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t.sendLink
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/medlem-login" className="text-sm text-haggai hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              {t.backToLogin}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberForgotPassword;
