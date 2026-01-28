import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Send, CheckCircle2, AlertCircle, Globe, Phone, User, Copy, Check, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PublicNominationForm = () => {
  const { workshopId } = useParams();
  const { language: globalLanguage } = useLanguage();
  const [formLanguage, setFormLanguage] = useState(globalLanguage);
  const isRTL = formLanguage === 'ar';
  
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationLink, setRegistrationLink] = useState('');
  const [nominationId, setNominationId] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    nominee_name: '',
    nominee_phone: '',
    inviter_name: '',
    inviter_phone: ''
  });

  const txt = {
    sv: {
      title: 'Bjud in en deltagare',
      subtitle: 'Skicka en inbjudan till någon som du vill rekommendera',
      workshopInfo: 'Utbildningsinformation',
      nomineeInfo: 'Den inbjudnas uppgifter',
      nomineeName: 'Namn',
      nomineeNamePlaceholder: 'Förnamn Efternamn',
      nomineePhone: 'Telefonnummer (WhatsApp)',
      nomineePhonePlaceholder: '+46 70 123 45 67',
      phoneHint: 'Registreringslänken skickas via WhatsApp',
      inviterInfo: 'Dina uppgifter (inbjudare)',
      inviterName: 'Ditt namn',
      inviterNamePlaceholder: 'Ditt förnamn och efternamn',
      inviterPhone: 'Ditt telefonnummer',
      inviterPhonePlaceholder: '+46 70 123 45 67',
      submit: 'Skapa inbjudan',
      submitting: 'Skapar...',
      required: 'Vänligen fyll i alla obligatoriska fält',
      errorTitle: 'Utbildning hittades inte',
      errorMessage: 'Denna utbildning finns inte längre eller länken är felaktig.',
      
      // Success page
      successTitle: 'Inbjudan skapad!',
      successMessage: 'En registreringslänk har skapats för',
      registrationLink: 'Registreringslänk',
      copyLink: 'Kopiera länk',
      copied: 'Kopierad!',
      sendViaWhatsApp: 'Skicka via WhatsApp',
      whatsAppMessage: 'Hej {name}! Du har blivit inbjuden av {inviter} att delta i {workshop}. Fyll i registreringsformuläret här: {link}',
      instructionTitle: 'Vad händer nu?',
      instruction1: '1. Kopiera länken eller skicka via WhatsApp',
      instruction2: '2. Personen fyller i registreringsformuläret',
      instruction3: '3. Haggai-teamet granskar ansökan',
      instruction4: '4. Personen får besked om antagning',
      
      date: 'Datum',
      location: 'Plats'
    },
    en: {
      title: 'Invite a participant',
      subtitle: 'Send an invitation to someone you want to recommend',
      workshopInfo: 'Training information',
      nomineeInfo: 'Invitee details',
      nomineeName: 'Name',
      nomineeNamePlaceholder: 'First name Last name',
      nomineePhone: 'Phone number (WhatsApp)',
      nomineePhonePlaceholder: '+46 70 123 45 67',
      phoneHint: 'The registration link will be sent via WhatsApp',
      inviterInfo: 'Your details (inviter)',
      inviterName: 'Your name',
      inviterNamePlaceholder: 'Your first and last name',
      inviterPhone: 'Your phone number',
      inviterPhonePlaceholder: '+46 70 123 45 67',
      submit: 'Create invitation',
      submitting: 'Creating...',
      required: 'Please fill in all required fields',
      errorTitle: 'Training not found',
      errorMessage: 'This training no longer exists or the link is incorrect.',
      
      // Success page
      successTitle: 'Invitation created!',
      successMessage: 'A registration link has been created for',
      registrationLink: 'Registration link',
      copyLink: 'Copy link',
      copied: 'Copied!',
      sendViaWhatsApp: 'Send via WhatsApp',
      whatsAppMessage: 'Hi {name}! You have been invited by {inviter} to participate in {workshop}. Fill in the registration form here: {link}',
      instructionTitle: 'What happens next?',
      instruction1: '1. Copy the link or send via WhatsApp',
      instruction2: '2. The person fills in the registration form',
      instruction3: '3. The Haggai team reviews the application',
      instruction4: '4. The person will be notified about admission',
      
      date: 'Date',
      location: 'Location'
    },
    ar: {
      title: 'دعوة مشارك',
      subtitle: 'أرسل دعوة لشخص تريد ترشيحه',
      workshopInfo: 'معلومات التدريب',
      nomineeInfo: 'بيانات المدعو',
      nomineeName: 'الاسم',
      nomineeNamePlaceholder: 'الاسم الأول الاسم الأخير',
      nomineePhone: 'رقم الهاتف (واتساب)',
      nomineePhonePlaceholder: '+46 70 123 45 67',
      phoneHint: 'سيتم إرسال رابط التسجيل عبر واتساب',
      inviterInfo: 'بياناتك (المرسل)',
      inviterName: 'اسمك',
      inviterNamePlaceholder: 'اسمك الأول والأخير',
      inviterPhone: 'رقم هاتفك',
      inviterPhonePlaceholder: '+46 70 123 45 67',
      submit: 'إنشاء دعوة',
      submitting: 'جاري الإنشاء...',
      required: 'يرجى ملء جميع الحقول المطلوبة',
      errorTitle: 'التدريب غير موجود',
      errorMessage: 'هذا التدريب لم يعد موجودًا أو الرابط غير صحيح.',
      
      // Success page
      successTitle: 'تم إنشاء الدعوة!',
      successMessage: 'تم إنشاء رابط التسجيل لـ',
      registrationLink: 'رابط التسجيل',
      copyLink: 'نسخ الرابط',
      copied: 'تم النسخ!',
      sendViaWhatsApp: 'إرسال عبر واتساب',
      whatsAppMessage: 'مرحبًا {name}! لقد تمت دعوتك من قبل {inviter} للمشاركة في {workshop}. املأ نموذج التسجيل هنا: {link}',
      instructionTitle: 'ماذا يحدث الآن؟',
      instruction1: '١. انسخ الرابط أو أرسله عبر واتساب',
      instruction2: '٢. يملأ الشخص نموذج التسجيل',
      instruction3: '٣. فريق حجاي يراجع الطلب',
      instruction4: '٤. سيتم إبلاغ الشخص بالقبول',
      
      date: 'التاريخ',
      location: 'الموقع'
    }
  }[formLanguage] || {};

  useEffect(() => {
    fetchWorkshop();
  }, [workshopId]);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkshop(data);
      } else {
        setError('not_found');
      }
    } catch (err) {
      console.error('Error fetching workshop:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[formLanguage] || value.sv || value.en || Object.values(value)[0] || '';
    }
    return String(value);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nominee_name || !formData.nominee_phone || !formData.inviter_name || !formData.inviter_phone) {
      toast.error(txt.required);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: workshopId,
          event_title: getLocalizedText(workshop?.title),
          event_date: workshop?.date,
          nominator_name: formData.inviter_name,
          nominator_phone: formData.inviter_phone,
          nominee_name: formData.nominee_name,
          nominee_phone: formData.nominee_phone,
          nominee_email: '',
          status: 'approved',
          direct_invitation: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        setNominationId(result.id);
        // Always append ?lang=ar to open in Arabic by default
        const link = `${window.location.origin}/registrering/${result.id}?lang=ar`;
        setRegistrationLink(link);
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting nomination:', error);
      toast.error('Kunde inte skapa inbjudan');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    toast.success(txt.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendViaWhatsApp = () => {
    // Get Arabic workshop title if available
    const workshopTitleAr = workshop?.title_ar || workshop?.title || '';
    
    // Create message with better RTL/LTR structure
    // Put names and link on separate lines to avoid mixing issues
    const arabicMessage = `تحية طيبة

لقد تمت دعوتك للمشاركة في برنامج قيادي:
📚 ${workshopTitleAr}

المرسل: ${formData.inviter_name}

للتسجيل، اضغط على الرابط:
${registrationLink}`;
    
    // Format phone number for WhatsApp
    let phone = formData.nominee_phone.replace(/\s+/g, '').replace(/^0/, '46');
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }
    
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(arabicMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !workshop) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.errorTitle}</h1>
          <p className="text-stone-600">{txt.errorMessage}</p>
        </div>
      </div>
    );
  }

  // Success page with registration link
  if (submitted) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">{txt.successTitle}</h1>
            <p className="text-stone-600 text-lg">
              {txt.successMessage} <strong>{formData.nominee_name}</strong>
            </p>
          </div>

          {/* Registration Link Card */}
          <Card className="border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <Label className="text-sm text-stone-500 mb-2 block">{txt.registrationLink}</Label>
              <div className="flex gap-2">
                <Input 
                  value={registrationLink} 
                  readOnly 
                  className="bg-stone-50 font-mono text-sm"
                />
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2">{copied ? txt.copied : txt.copyLink}</span>
                </Button>
              </div>
              
              {/* WhatsApp Button */}
              <Button 
                onClick={sendViaWhatsApp}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {txt.sendViaWhatsApp}
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-4">{txt.instructionTitle}</h3>
              <ul className="space-y-2 text-blue-700">
                <li>{txt.instruction1}</li>
                <li>{txt.instruction2}</li>
                <li>{txt.instruction3}</li>
                <li>{txt.instruction4}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-10" style={{background: 'linear-gradient(135deg, #014D73 0%, #012d44 100%)'}}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge className="bg-white/20 text-white mb-4 border-white/30">
            <Users className="h-4 w-4 mr-1" />
            {txt.title}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{getLocalizedText(workshop.title)}</h1>
          <p className="text-white/80">{txt.subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-white/90">
            {workshop.date && (
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {workshop.date}
              </span>
            )}
            {workshop.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {getLocalizedText(workshop.location)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selector - Above first card */}
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-5 w-5 text-stone-400" />
            <div className="flex bg-stone-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setFormLanguage('sv')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  formLanguage === 'sv' 
                    ? 'bg-haggai text-white' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                Svenska
              </button>
              <button
                type="button"
                onClick={() => setFormLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  formLanguage === 'en' 
                    ? 'bg-haggai text-white' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setFormLanguage('ar')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  formLanguage === 'ar' 
                    ? 'bg-haggai text-white' 
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Nominee Info - FIRST */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-haggai" />
                {txt.nomineeInfo}
              </h2>
              
              <div className="space-y-4">
                {/* Nominee Name */}
                <div className="space-y-2">
                  <Label htmlFor="nominee_name" className="flex items-center gap-1">
                    {txt.nomineeName} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nominee_name"
                    value={formData.nominee_name}
                    onChange={(e) => handleChange('nominee_name', e.target.value)}
                    placeholder={txt.nomineeNamePlaceholder}
                    required
                    className="text-lg"
                  />
                </div>

                {/* Nominee Phone */}
                <div className="space-y-2">
                  <Label htmlFor="nominee_phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {txt.nomineePhone} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nominee_phone"
                    type="tel"
                    value={formData.nominee_phone}
                    onChange={(e) => handleChange('nominee_phone', e.target.value)}
                    placeholder={txt.nomineePhonePlaceholder}
                    required
                    className="text-lg"
                  />
                  <p className="text-sm text-stone-500 flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    {txt.phoneHint}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inviter Info - LAST */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-haggai" />
                {txt.inviterInfo}
              </h2>
              
              <div className="space-y-4">
                {/* Inviter Name */}
                <div className="space-y-2">
                  <Label htmlFor="inviter_name" className="flex items-center gap-1">
                    {txt.inviterName} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inviter_name"
                    value={formData.inviter_name}
                    onChange={(e) => handleChange('inviter_name', e.target.value)}
                    placeholder={txt.inviterNamePlaceholder}
                    required
                    className="text-lg"
                  />
                </div>

                {/* Inviter Phone */}
                <div className="space-y-2">
                  <Label htmlFor="inviter_phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {txt.inviterPhone} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inviter_phone"
                    type="tel"
                    value={formData.inviter_phone}
                    onChange={(e) => handleChange('inviter_phone', e.target.value)}
                    placeholder={txt.inviterPhonePlaceholder}
                    required
                    className="text-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-haggai hover:bg-haggai-dark text-white py-6 text-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {txt.submitting}
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                {txt.submit}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PublicNominationForm;
