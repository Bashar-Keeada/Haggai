import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, Globe, ArrowLeft,
  CheckCircle, Award, Send
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { leaderExperiences, targetGroups } from '../data/mock';

const LeaderExperienceApplication = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  
  const program = leaderExperiences.find(p => p.id === programId);
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    city: '',
    country: '',
    
    // Leadership Info
    currentRole: '',
    organization: '',
    organizationType: '',
    yearsInLeadership: '',
    peopleLeading: '',
    
    // Motivation
    whyApply: '',
    expectations: '',
    howHeard: '',
    
    // Additional
    dietaryRestrictions: '',
    specialNeeds: '',
    agreeTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    sv: {
      backToPrograms: 'Tillbaka till program',
      applicationForm: 'Ansökningsformulär',
      applicationFor: 'Ansökan för',
      programInfo: 'Programinformation',
      duration: 'Längd',
      period: 'Period',
      location: 'Plats',
      language: 'Språk',
      spotsLeft: 'platser kvar',
      requirements: 'Krav för deltagande',
      requirementsList: [
        'Du måste ha en aktiv ledande roll i kyrka, samhälle eller näringsliv',
        'Du ska kunna delta i hela programmet',
        'Du förväntas implementera det du lär dig efter programmet'
      ],
      personalInfo: 'Personlig information',
      firstName: 'Förnamn',
      lastName: 'Efternamn',
      email: 'E-post',
      phone: 'Telefon',
      dateOfBirth: 'Födelsedatum',
      gender: 'Kön',
      male: 'Man',
      female: 'Kvinna',
      nationality: 'Nationalitet',
      city: 'Stad',
      country: 'Land',
      leadershipInfo: 'Information om ditt ledarskap',
      currentRole: 'Din nuvarande roll/titel',
      organization: 'Organisation/Kyrka/Företag',
      organizationType: 'Typ av organisation',
      orgTypes: {
        church: 'Kyrka/Församling',
        ngo: 'Ideell organisation',
        business: 'Företag/Näringsliv',
        government: 'Myndighet/Offentlig sektor',
        education: 'Utbildning',
        other: 'Annat'
      },
      yearsInLeadership: 'År i ledarroll',
      peopleLeading: 'Antal personer du leder',
      motivation: 'Motivation',
      whyApply: 'Varför vill du delta i detta program?',
      whyApplyPlaceholder: 'Beskriv varför du söker till programmet och vad du hoppas få ut av det...',
      expectations: 'Vad förväntar du dig lära dig?',
      expectationsPlaceholder: 'Beskriv dina förväntningar och mål med deltagandet...',
      howHeard: 'Hur hörde du talas om Haggai?',
      howHeardOptions: {
        friend: 'Vän/Bekant',
        church: 'Kyrka/Församling',
        social: 'Sociala medier',
        website: 'Webbsida',
        event: 'Evenemang',
        alumni: 'Haggai-alumn',
        other: 'Annat'
      },
      additionalInfo: 'Övrig information',
      dietaryRestrictions: 'Kostpreferenser/Allergier',
      specialNeeds: 'Särskilda behov',
      agreeTerms: 'Jag förstår att detta är ett urvalsbaserat program och att ansökan inte garanterar antagning. Jag godkänner att Haggai Sweden behandlar mina personuppgifter.',
      submitApplication: 'Skicka ansökan',
      submitting: 'Skickar...',
      successTitle: 'Ansökan skickad!',
      successDesc: 'Vi granskar din ansökan och återkommer inom 2-3 veckor.',
      programNotFound: 'Programmet hittades inte',
      arabic: 'Arabiska',
      english: 'Engelska',
      swedish: 'Svenska'
    },
    en: {
      backToPrograms: 'Back to programs',
      applicationForm: 'Application Form',
      applicationFor: 'Application for',
      programInfo: 'Program Information',
      duration: 'Duration',
      period: 'Period',
      location: 'Location',
      language: 'Language',
      spotsLeft: 'spots left',
      requirements: 'Requirements for Participation',
      requirementsList: [
        'You must have an active leadership role in church, society or business',
        'You must be able to participate in the entire program',
        'You are expected to implement what you learn after the program'
      ],
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      nationality: 'Nationality',
      city: 'City',
      country: 'Country',
      leadershipInfo: 'Leadership Information',
      currentRole: 'Your current role/title',
      organization: 'Organization/Church/Company',
      organizationType: 'Type of organization',
      orgTypes: {
        church: 'Church/Congregation',
        ngo: 'Non-profit organization',
        business: 'Business/Company',
        government: 'Government/Public sector',
        education: 'Education',
        other: 'Other'
      },
      yearsInLeadership: 'Years in leadership role',
      peopleLeading: 'Number of people you lead',
      motivation: 'Motivation',
      whyApply: 'Why do you want to participate in this program?',
      whyApplyPlaceholder: 'Describe why you are applying and what you hope to gain...',
      expectations: 'What do you expect to learn?',
      expectationsPlaceholder: 'Describe your expectations and goals...',
      howHeard: 'How did you hear about Haggai?',
      howHeardOptions: {
        friend: 'Friend/Acquaintance',
        church: 'Church/Congregation',
        social: 'Social media',
        website: 'Website',
        event: 'Event',
        alumni: 'Haggai alumni',
        other: 'Other'
      },
      additionalInfo: 'Additional Information',
      dietaryRestrictions: 'Dietary restrictions/Allergies',
      specialNeeds: 'Special needs',
      agreeTerms: 'I understand that this is a selection-based program and that application does not guarantee admission. I agree to Haggai Sweden processing my personal data.',
      submitApplication: 'Submit Application',
      submitting: 'Submitting...',
      successTitle: 'Application submitted!',
      successDesc: 'We will review your application and respond within 2-3 weeks.',
      programNotFound: 'Program not found',
      arabic: 'Arabic',
      english: 'English',
      swedish: 'Swedish'
    },
    ar: {
      backToPrograms: 'العودة إلى البرامج',
      applicationForm: 'نموذج الطلب',
      applicationFor: 'طلب لـ',
      programInfo: 'معلومات البرنامج',
      duration: 'المدة',
      period: 'الفترة',
      location: 'الموقع',
      language: 'اللغة',
      spotsLeft: 'أماكن متبقية',
      requirements: 'متطلبات المشاركة',
      requirementsList: [
        'يجب أن يكون لديك دور قيادي نشط في الكنيسة أو المجتمع أو الأعمال',
        'يجب أن تكون قادراً على المشاركة في البرنامج بأكمله',
        'من المتوقع أن تطبق ما تتعلمه بعد البرنامج'
      ],
      personalInfo: 'المعلومات الشخصية',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      dateOfBirth: 'تاريخ الميلاد',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      nationality: 'الجنسية',
      city: 'المدينة',
      country: 'البلد',
      leadershipInfo: 'معلومات القيادة',
      currentRole: 'دورك/منصبك الحالي',
      organization: 'المنظمة/الكنيسة/الشركة',
      organizationType: 'نوع المنظمة',
      orgTypes: {
        church: 'كنيسة/جماعة',
        ngo: 'منظمة غير ربحية',
        business: 'شركة/أعمال',
        government: 'حكومة/قطاع عام',
        education: 'تعليم',
        other: 'آخر'
      },
      yearsInLeadership: 'سنوات في دور قيادي',
      peopleLeading: 'عدد الأشخاص الذين تقودهم',
      motivation: 'الدافع',
      whyApply: 'لماذا تريد المشاركة في هذا البرنامج؟',
      whyApplyPlaceholder: 'صف سبب تقدمك وما تأمل في تحقيقه...',
      expectations: 'ماذا تتوقع أن تتعلم؟',
      expectationsPlaceholder: 'صف توقعاتك وأهدافك...',
      howHeard: 'كيف سمعت عن هجاي؟',
      howHeardOptions: {
        friend: 'صديق/معرفة',
        church: 'كنيسة/جماعة',
        social: 'وسائل التواصل الاجتماعي',
        website: 'موقع إلكتروني',
        event: 'حدث',
        alumni: 'خريج هجاي',
        other: 'آخر'
      },
      additionalInfo: 'معلومات إضافية',
      dietaryRestrictions: 'قيود غذائية/حساسية',
      specialNeeds: 'احتياجات خاصة',
      agreeTerms: 'أفهم أن هذا برنامج قائم على الاختيار وأن التقديم لا يضمن القبول. أوافق على معالجة هجاي السويد لبياناتي الشخصية.',
      submitApplication: 'إرسال الطلب',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم إرسال الطلب!',
      successDesc: 'سنراجع طلبك ونرد خلال 2-3 أسابيع.',
      programNotFound: 'البرنامج غير موجود',
      arabic: 'العربية',
      english: 'الإنجليزية',
      swedish: 'السويدية'
    }
  };

  const txt = translations[language] || translations.sv;

  const getLanguageLabel = (lang) => {
    const labels = {
      arabic: txt.arabic,
      english: txt.english,
      swedish: txt.swedish
    };
    return labels[lang] || lang;
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">{txt.programNotFound}</h1>
          <Link to="/leader-experience">
            <Button>{txt.backToPrograms}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast.error(language === 'sv' ? 'Du måste godkänna villkoren' : language === 'ar' ? 'يجب أن توافق على الشروط' : 'You must agree to the terms');
      return;
    }
    
    setIsSubmitting(true);

    // Mock submission - store in localStorage
    const applications = JSON.parse(localStorage.getItem('leaderExperienceApplications') || '[]');
    applications.push({
      ...formData,
      programId: program.id,
      programTitle: program.title[language],
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('leaderExperienceApplications', JSON.stringify(applications));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success(txt.successTitle, {
      description: txt.successDesc
    });

    setIsSubmitting(false);
    navigate('/leader-experience');
  };

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-amber-50 via-cream-50 to-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/leader-experience" className={`inline-flex items-center text-amber-700 hover:text-amber-800 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {txt.backToPrograms}
          </Link>
          
          <h1 className={`text-4xl font-bold text-stone-800 mb-2 ${isRTL ? 'text-right' : ''}`}>
            {txt.applicationForm}
          </h1>
          <p className={`text-lg text-stone-600 ${isRTL ? 'text-right' : ''}`}>
            {txt.applicationFor}: <span className="font-semibold text-amber-700">{program.title[language]}</span>
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-3 gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
            {/* Sidebar - Program Info */}
            <div className={`lg:col-span-1 ${isRTL ? 'order-2 lg:order-1' : ''}`}>
              <Card className="border-0 shadow-xl sticky top-24">
                <CardHeader className={isRTL ? 'text-right' : ''}>
                  <CardTitle className="text-lg">{txt.programInfo}</CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Clock className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span><strong>{txt.duration}:</strong> {program.duration[language]}</span>
                  </div>
                  <div className={`flex items-center text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Calendar className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span><strong>{txt.period}:</strong> {program.period[language]}</span>
                  </div>
                  <div className={`flex items-center text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span><strong>{txt.location}:</strong> {program.location[language]}</span>
                  </div>
                  <div className={`flex items-center text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Globe className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span><strong>{txt.language}:</strong> {getLanguageLabel(program.language)}</span>
                  </div>
                  <div className={`flex items-center text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Users className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span><strong>{program.spotsLeft}</strong> {txt.spotsLeft}</span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-stone-800 mb-3 flex items-center">
                      <Award className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {txt.requirements}
                    </h4>
                    <ul className="space-y-2">
                      {txt.requirementsList.map((req, i) => (
                        <li key={i} className={`flex items-start text-sm text-stone-600 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <CheckCircle className={`h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className={`lg:col-span-2 ${isRTL ? 'order-1 lg:order-2' : ''}`}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
                    {/* Personal Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-stone-800 mb-6 pb-2 border-b">{txt.personalInfo}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{txt.firstName} *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{txt.lastName} *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{txt.email} *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            className="rounded-lg"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{txt.phone} *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                            className="rounded-lg"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">{txt.dateOfBirth} *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{txt.gender} *</Label>
                          <RadioGroup
                            value={formData.gender}
                            onValueChange={(value) => setFormData({...formData, gender: value})}
                            className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                          >
                            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male" className="font-normal">{txt.male}</Label>
                            </div>
                            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female" className="font-normal">{txt.female}</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">{txt.nationality} *</Label>
                          <Input
                            id="nationality"
                            value={formData.nationality}
                            onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">{txt.city} *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="country">{txt.country} *</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Leadership Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-stone-800 mb-6 pb-2 border-b">{txt.leadershipInfo}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="currentRole">{txt.currentRole} *</Label>
                          <Input
                            id="currentRole"
                            value={formData.currentRole}
                            onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="organization">{txt.organization} *</Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                            required
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{txt.organizationType} *</Label>
                          <Select
                            value={formData.organizationType}
                            onValueChange={(value) => setFormData({...formData, organizationType: value})}
                          >
                            <SelectTrigger className={`rounded-lg ${isRTL ? 'text-right' : ''}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(txt.orgTypes).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsInLeadership">{txt.yearsInLeadership} *</Label>
                          <Select
                            value={formData.yearsInLeadership}
                            onValueChange={(value) => setFormData({...formData, yearsInLeadership: value})}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2">1-2</SelectItem>
                              <SelectItem value="3-5">3-5</SelectItem>
                              <SelectItem value="6-10">6-10</SelectItem>
                              <SelectItem value="11-20">11-20</SelectItem>
                              <SelectItem value="20+">20+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="peopleLeading">{txt.peopleLeading} *</Label>
                          <Select
                            value={formData.peopleLeading}
                            onValueChange={(value) => setFormData({...formData, peopleLeading: value})}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-100">51-100</SelectItem>
                              <SelectItem value="101-500">101-500</SelectItem>
                              <SelectItem value="500+">500+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Motivation */}
                    <div>
                      <h3 className="text-xl font-semibold text-stone-800 mb-6 pb-2 border-b">{txt.motivation}</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="whyApply">{txt.whyApply} *</Label>
                          <Textarea
                            id="whyApply"
                            value={formData.whyApply}
                            onChange={(e) => setFormData({...formData, whyApply: e.target.value})}
                            required
                            rows={4}
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                            placeholder={txt.whyApplyPlaceholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expectations">{txt.expectations} *</Label>
                          <Textarea
                            id="expectations"
                            value={formData.expectations}
                            onChange={(e) => setFormData({...formData, expectations: e.target.value})}
                            required
                            rows={4}
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                            placeholder={txt.expectationsPlaceholder}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{txt.howHeard} *</Label>
                          <Select
                            value={formData.howHeard}
                            onValueChange={(value) => setFormData({...formData, howHeard: value})}
                          >
                            <SelectTrigger className={`rounded-lg ${isRTL ? 'text-right' : ''}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(txt.howHeardOptions).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-stone-800 mb-6 pb-2 border-b">{txt.additionalInfo}</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="dietaryRestrictions">{txt.dietaryRestrictions}</Label>
                          <Input
                            id="dietaryRestrictions"
                            value={formData.dietaryRestrictions}
                            onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialNeeds">{txt.specialNeeds}</Label>
                          <Textarea
                            id="specialNeeds"
                            value={formData.specialNeeds}
                            onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                            rows={2}
                            className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className={`flex items-start space-x-3 p-4 bg-cream-100 rounded-xl ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked})}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm text-stone-600 leading-relaxed">
                        {txt.agreeTerms}
                      </Label>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-amber-700 hover:bg-amber-800 text-cream-50 py-6 text-lg rounded-xl shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {isSubmitting ? txt.submitting : txt.submitApplication}
                      <Send className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeaderExperienceApplication;
