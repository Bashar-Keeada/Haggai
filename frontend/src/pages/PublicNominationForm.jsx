import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PublicNominationForm = () => {
  const { workshopId } = useParams();
  const { language, isRTL } = useLanguage();
  
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nominator_name: '',
    nominator_email: '',
    nominator_phone: '',
    nominator_church: '',
    nominator_relation: '',
    nominee_name: '',
    nominee_email: '',
    nominee_phone: '',
    nominee_church: '',
    nominee_role: '',
    nominee_activities: '',
    motivation: ''
  });

  const txt = {
    sv: {
      title: 'Nominera en deltagare',
      subtitle: 'Rekommendera någon till denna utbildning',
      workshopInfo: 'Utbildningsinformation',
      yourInfo: 'Dina uppgifter (du som nominerar)',
      nomineeInfo: 'Den du nominerar',
      yourName: 'Ditt namn',
      yourEmail: 'Din e-post',
      yourPhone: 'Ditt telefonnummer',
      yourChurch: 'Din kyrka/församling',
      yourRelation: 'Din relation till den nominerade',
      relationPlaceholder: 'T.ex. pastor, mentor, kollega...',
      nomineeName: 'Personens namn',
      nomineeEmail: 'Personens e-post',
      nomineePhone: 'Personens telefonnummer',
      nomineeChurch: 'Personens kyrka/församling',
      nomineeRole: 'Roll/ansvar i kyrkan',
      rolePlaceholder: 'T.ex. ungdomsledare, diakon, söndagsskoleledare...',
      nomineeActivities: 'Aktiviteter och engagemang',
      activitiesPlaceholder: 'Beskriv personens aktiviteter och engagemang i kyrkan och samhället...',
      motivation: 'Motivering till nomineringen',
      motivationPlaceholder: 'Varför rekommenderar du denna person? Vad gör personen lämplig för programmet?',
      submit: 'Skicka nominering',
      submitting: 'Skickar...',
      required: 'Obligatoriskt fält',
      thankYou: 'Tack för din nominering!',
      thankYouMessage: 'Vi har tagit emot din nominering och kommer att granska den. Du kommer få ett bekräftelsemejl.',
      errorTitle: 'Kunde inte ladda formuläret',
      errorMessage: 'Kontrollera länken eller försök igen senare.',
      pendingNote: 'Din nominering granskas av admin innan den skickas vidare till den nominerade.',
      date: 'Datum',
      location: 'Plats'
    },
    en: {
      title: 'Nominate a participant',
      subtitle: 'Recommend someone for this training',
      workshopInfo: 'Training information',
      yourInfo: 'Your information (nominator)',
      nomineeInfo: 'Person you are nominating',
      yourName: 'Your name',
      yourEmail: 'Your email',
      yourPhone: 'Your phone number',
      yourChurch: 'Your church/congregation',
      yourRelation: 'Your relation to the nominee',
      relationPlaceholder: 'E.g. pastor, mentor, colleague...',
      nomineeName: 'Person\'s name',
      nomineeEmail: 'Person\'s email',
      nomineePhone: 'Person\'s phone number',
      nomineeChurch: 'Person\'s church/congregation',
      nomineeRole: 'Role/responsibility in church',
      rolePlaceholder: 'E.g. youth leader, deacon, Sunday school teacher...',
      nomineeActivities: 'Activities and engagement',
      activitiesPlaceholder: 'Describe the person\'s activities and engagement in church and community...',
      motivation: 'Motivation for nomination',
      motivationPlaceholder: 'Why do you recommend this person? What makes them suitable for the program?',
      submit: 'Submit nomination',
      submitting: 'Submitting...',
      required: 'Required field',
      thankYou: 'Thank you for your nomination!',
      thankYouMessage: 'We have received your nomination and will review it. You will receive a confirmation email.',
      errorTitle: 'Could not load the form',
      errorMessage: 'Please check the link or try again later.',
      pendingNote: 'Your nomination will be reviewed by admin before being sent to the nominee.',
      date: 'Date',
      location: 'Location'
    },
    ar: {
      title: 'ترشيح مشارك',
      subtitle: 'أوصِ بشخص لهذا التدريب',
      workshopInfo: 'معلومات التدريب',
      yourInfo: 'معلوماتك (المُرشِّح)',
      nomineeInfo: 'الشخص الذي ترشحه',
      yourName: 'اسمك',
      yourEmail: 'بريدك الإلكتروني',
      yourPhone: 'رقم هاتفك',
      yourChurch: 'كنيستك/جماعتك',
      yourRelation: 'علاقتك بالمرشح',
      relationPlaceholder: 'مثل: قس، مرشد، زميل...',
      nomineeName: 'اسم الشخص',
      nomineeEmail: 'بريد الشخص الإلكتروني',
      nomineePhone: 'رقم هاتف الشخص',
      nomineeChurch: 'كنيسة/جماعة الشخص',
      nomineeRole: 'الدور/المسؤولية في الكنيسة',
      rolePlaceholder: 'مثل: قائد شباب، شماس، معلم مدرسة الأحد...',
      nomineeActivities: 'الأنشطة والمشاركة',
      activitiesPlaceholder: 'صف أنشطة الشخص ومشاركته في الكنيسة والمجتمع...',
      motivation: 'دافع الترشيح',
      motivationPlaceholder: 'لماذا توصي بهذا الشخص؟ ما الذي يجعله مناسبًا للبرنامج؟',
      submit: 'إرسال الترشيح',
      submitting: 'جاري الإرسال...',
      required: 'حقل مطلوب',
      thankYou: 'شكرًا لترشيحك!',
      thankYouMessage: 'لقد تلقينا ترشيحك وسنراجعه. ستتلقى بريدًا إلكترونيًا للتأكيد.',
      errorTitle: 'تعذر تحميل النموذج',
      errorMessage: 'يرجى التحقق من الرابط أو المحاولة مرة أخرى لاحقًا.',
      pendingNote: 'سيتم مراجعة ترشيحك من قبل المسؤول قبل إرساله إلى المرشح.',
      date: 'التاريخ',
      location: 'الموقع'
    }
  }[language] || {};

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
      return value[language] || value.sv || value.en || Object.values(value)[0] || '';
    }
    return String(value);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nominator_name || !formData.nominator_email || 
        !formData.nominee_name || !formData.nominee_email ||
        !formData.nominee_church || !formData.nominee_role || !formData.motivation) {
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
          ...formData
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting nomination:', error);
      toast.error('Kunde inte skicka nomineringen');
    } finally {
      setSubmitting(false);
    }
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

  if (submitted) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-4">{txt.thankYou}</h1>
          <p className="text-stone-600">{txt.thankYouMessage}</p>
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
        {/* Pending Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            ℹ️ {txt.pendingNote}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nominator Info */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-haggai" />
                {txt.yourInfo}
              </h2>
              
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{txt.yourName} *</Label>
                    <Input
                      value={formData.nominator_name}
                      onChange={(e) => handleChange('nominator_name', e.target.value)}
                      required
                      data-testid="nominator-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{txt.yourEmail} *</Label>
                    <Input
                      type="email"
                      value={formData.nominator_email}
                      onChange={(e) => handleChange('nominator_email', e.target.value)}
                      required
                      data-testid="nominator-email-input"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{txt.yourPhone}</Label>
                    <Input
                      value={formData.nominator_phone}
                      onChange={(e) => handleChange('nominator_phone', e.target.value)}
                      data-testid="nominator-phone-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{txt.yourChurch}</Label>
                    <Input
                      value={formData.nominator_church}
                      onChange={(e) => handleChange('nominator_church', e.target.value)}
                      data-testid="nominator-church-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{txt.yourRelation}</Label>
                  <Input
                    value={formData.nominator_relation}
                    onChange={(e) => handleChange('nominator_relation', e.target.value)}
                    placeholder={txt.relationPlaceholder}
                    data-testid="nominator-relation-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nominee Info */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-haggai" />
                {txt.nomineeInfo}
              </h2>
              
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{txt.nomineeName} *</Label>
                    <Input
                      value={formData.nominee_name}
                      onChange={(e) => handleChange('nominee_name', e.target.value)}
                      required
                      data-testid="nominee-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{txt.nomineeEmail} *</Label>
                    <Input
                      type="email"
                      value={formData.nominee_email}
                      onChange={(e) => handleChange('nominee_email', e.target.value)}
                      required
                      data-testid="nominee-email-input"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{txt.nomineePhone}</Label>
                    <Input
                      value={formData.nominee_phone}
                      onChange={(e) => handleChange('nominee_phone', e.target.value)}
                      data-testid="nominee-phone-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{txt.nomineeChurch} *</Label>
                    <Input
                      value={formData.nominee_church}
                      onChange={(e) => handleChange('nominee_church', e.target.value)}
                      required
                      data-testid="nominee-church-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>{txt.nomineeRole} *</Label>
                  <Input
                    value={formData.nominee_role}
                    onChange={(e) => handleChange('nominee_role', e.target.value)}
                    placeholder={txt.rolePlaceholder}
                    required
                    data-testid="nominee-role-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{txt.nomineeActivities}</Label>
                  <Textarea
                    value={formData.nominee_activities}
                    onChange={(e) => handleChange('nominee_activities', e.target.value)}
                    placeholder={txt.activitiesPlaceholder}
                    rows={3}
                    data-testid="nominee-activities-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-stone-800 mb-4">{txt.motivation} *</h2>
              <Textarea
                value={formData.motivation}
                onChange={(e) => handleChange('motivation', e.target.value)}
                placeholder={txt.motivationPlaceholder}
                rows={4}
                required
                data-testid="motivation-input"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 bg-haggai hover:bg-haggai-dark text-white text-lg"
            data-testid="submit-nomination-btn"
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

        {/* Footer */}
        <div className="mt-8 text-center text-stone-400 text-sm">
          <p>Haggai Sweden | <a href="https://haggai.se" className="text-haggai hover:underline">haggai.se</a> <span className="text-stone-300">(By Keeada)</span></p>
        </div>
      </div>
    </div>
  );
};

export default PublicNominationForm;
