import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ParticipantResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const txt = {
    sv: {
      title: 'Nytt lösenord',
      subtitle: 'Ange ditt nya lösenord',
      password: 'Nytt lösenord',
      confirmPassword: 'Bekräfta lösenord',
      resetButton: 'Återställ lösenord',
      passwordHint: 'Minst 6 tecken',
      passwordMismatch: 'Lösenorden matchar inte',
      invalidToken: 'Ogiltig eller utgången återställningslänk',
      successTitle: 'Lösenord återställt!',
      successMessage: 'Du kan nu logga in med ditt nya lösenord',
      goToLogin: 'Gå till inloggning',
      errorMessage: 'Kunde inte återställa lösenord'
    },
    en: {
      title: 'New Password',
      subtitle: 'Enter your new password',
      password: 'New password',
      confirmPassword: 'Confirm password',
      resetButton: 'Reset password',
      passwordHint: 'At least 6 characters',
      passwordMismatch: 'Passwords do not match',
      invalidToken: 'Invalid or expired reset link',
      successTitle: 'Password reset!',
      successMessage: 'You can now login with your new password',
      goToLogin: 'Go to login',
      errorMessage: 'Could not reset password'
    }
  };

  const t = txt[language] || txt.sv;

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/validate-reset-token/${token}`);
      setTokenValid(response.ok);
    } catch (err) {
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(t.passwordHint);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password })
      });

      if (response.ok) {
        setResetComplete(true);
      } else {
        toast.error(t.errorMessage);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-cream-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-800 mb-2">{t.invalidToken}</h2>
            <Button onClick={() => navigate('/deltagare/login')} className="mt-4 bg-[#0891B2]">
              {t.goToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">{t.successTitle}</h2>
            <p className="text-stone-600 mb-6">{t.successMessage}</p>
            <Button onClick={() => navigate('/deltagare/login')} className="bg-[#0891B2]">
              {t.goToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-cream-100 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-stone-800">{t.title}</CardTitle>
          <p className="text-sm text-stone-600 mt-2">{t.subtitle}</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  minLength={6}
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
              <p className="text-xs text-stone-500">{t.passwordHint}</p>
            </div>

            <div className="space-y-2">
              <Label>{t.confirmPassword}</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0891B2] to-[#0e7490]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t.resetButton
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantResetPassword;
