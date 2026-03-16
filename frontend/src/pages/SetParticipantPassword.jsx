import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SetParticipantPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lang = searchParams.get('lang') || 'ar';
  const isRTL = lang === 'ar';
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const translations = {
    sv: {
      pageTitle: 'Skapa ditt lösenord',
      subtitle: 'Välj ett lösenord för att aktivera ditt deltagarkonto',
      loading: 'Laddar...',
      invalidLink: 'Ogiltig eller utgången länk',
      invalidLinkDesc: 'Länken för att skapa lösenord är inte giltig eller har redan använts.',
      backHome: 'Tillbaka till startsidan',
      password: 'Lösenord',
      confirmPassword: 'Bekräfta lösenord',
      passwordPlaceholder: 'Minst 8 tecken',
      submit: 'Skapa konto',
      submitting: 'Skapar...',
      successTitle: 'Konto aktiverat!',
      successDesc: 'Ditt konto har skapats.',
      successMessage: 'Du kan nu logga in på deltagarportalen med din e-post och lösenord.',
      loginButton: 'Gå till inloggning',
      errorTitle: 'Fel',
      errorDesc: 'Kunde inte skapa konto. Försök igen.',
      passwordMismatch: 'Lösenorden matchar inte',
      passwordTooShort: 'Lösenordet måste vara minst 8 tecken',
      welcomeMessage: 'Välkommen'
    },
    en: {
      pageTitle: 'Create Your Password',
      subtitle: 'Choose a password to activate your participant account',
      loading: 'Loading...',
      invalidLink: 'Invalid or expired link',
      invalidLinkDesc: 'The password creation link is invalid or has already been used.',
      backHome: 'Back to home',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'At least 8 characters',
      submit: 'Create Account',
      submitting: 'Creating...',
      successTitle: 'Account Activated!',
      successDesc: 'Your account has been created.',
      successMessage: 'You can now log in to the participant portal with your email and password.',
      loginButton: 'Go to Login',
      errorTitle: 'Error',
      errorDesc: 'Could not create account. Please try again.',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 8 characters',
      welcomeMessage: 'Welcome'
    },
    ar: {
      pageTitle: 'إنشاء كلمة المرور',
      subtitle: 'اختر كلمة مرور لتفعيل حساب المشارك الخاص بك',
      loading: 'جاري التحميل...',
      invalidLink: 'رابط غير صالح أو منتهي الصلاحية',
      invalidLinkDesc: 'رابط إنشاء كلمة المرور غير صالح أو تم استخدامه بالفعل.',
      backHome: 'العودة للصفحة الرئيسية',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      passwordPlaceholder: '٨ أحرف على الأقل',
      submit: 'إنشاء الحساب',
      submitting: 'جاري الإنشاء...',
      successTitle: 'تم تفعيل الحساب!',
      successDesc: 'تم إنشاء حسابك بنجاح.',
      successMessage: 'يمكنك الآن تسجيل الدخول إلى بوابة المشاركين باستخدام بريدك الإلكتروني وكلمة المرور.',
      loginButton: 'انتقل إلى تسجيل الدخول',
      errorTitle: 'خطأ',
      errorDesc: 'لم نتمكن من إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      passwordTooShort: 'يجب أن تكون كلمة المرور ٨ أحرف على الأقل',
      welcomeMessage: 'مرحباً'
    }
  };

  const txt = translations[lang] || translations.ar;

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/verify-password-token/${token}`);
      if (response.ok) {
        const data = await response.json();
        setTokenData(data);
      } else {
        setError('invalid');
      }
    } catch (err) {
      setError('invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (formData.password.length < 8) {
      toast.error(txt.passwordTooShort);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(txt.passwordMismatch);
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          password: formData.password
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Failed');
      }
    } catch (err) {
      toast.error(txt.errorTitle, { description: txt.errorDesc });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-haggai mx-auto mb-4" />
          <p className="text-stone-600">{txt.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-800 mb-2">{txt.invalidLink}</h2>
            <p className="text-stone-600 mb-6">{txt.invalidLinkDesc}</p>
            <Button onClick={() => navigate('/')} className="bg-haggai hover:bg-haggai-dark">
              {txt.backHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-stone-800 mb-4">{txt.successTitle}</h1>
            <p className="text-xl text-stone-600 mb-8">{txt.successDesc}</p>
            
            <Card className="border-0 shadow-xl text-left mb-8">
              <CardContent className={`p-8 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-stone-700 leading-relaxed text-lg">
                  {txt.successMessage}
                </p>
              </CardContent>
            </Card>
            
            <Button 
              onClick={() => navigate('/deltagare/login')} 
              className="bg-haggai hover:bg-haggai-dark text-white px-8 py-6 text-lg"
              data-testid="go-to-login-btn"
            >
              <Lock className="h-5 w-5 mr-2" />
              {txt.loginButton}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <img src="/haggai-logo.png" alt="Haggai" className="h-16 mx-auto mb-4" onError={(e) => e.target.style.display = 'none'} />
          <div className="bg-haggai/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-10 w-10 text-haggai" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.pageTitle}</h1>
          <p className="text-stone-600">{txt.subtitle}</p>
        </div>

        {tokenData && (
          <div className="text-center mb-6">
            <p className="text-lg text-stone-700">
              {txt.welcomeMessage}, <span className="font-semibold text-haggai">{tokenData.name}</span>
            </p>
          </div>
        )}

        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password */}
              <div>
                <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Lock className="h-4 w-4" />
                  {txt.password}
                  <span className="text-red-500 text-lg">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={txt.passwordPlaceholder}
                    className={`pr-10 ${isRTL ? 'text-right' : ''}`}
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Lock className="h-4 w-4" />
                  {txt.confirmPassword}
                  <span className="text-red-500 text-lg">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder={txt.passwordPlaceholder}
                    className={`pr-10 ${isRTL ? 'text-right' : ''}`}
                    data-testid="confirm-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-haggai hover:bg-haggai-dark text-white py-6 text-lg"
                data-testid="submit-password-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    {txt.submitting}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {txt.submit}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetParticipantPassword;
