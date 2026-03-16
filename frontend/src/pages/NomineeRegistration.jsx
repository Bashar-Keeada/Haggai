import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, User, Mail, Phone, MapPin, Briefcase, Church, GraduationCap, CheckCircle, AlertCircle, Loader2, Globe, Upload, Image as ImageIcon, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NomineeRegistration = () => {
  const { nominationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language: globalLanguage } = useLanguage();
  
  // Check URL param for language, default to Arabic if ?lang=ar is present
  const urlLang = searchParams.get('lang');
  const initialLang = urlLang || globalLanguage || 'ar';
  
  const [formLanguage, setFormLanguage] = useState(initialLang);
  const isRTL = formLanguage === 'ar';
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nomination, setNomination] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [error, setError] = useState(null);
  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherNationality, setShowOtherNationality] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    country_of_residence: '',
    country_other: '',
    nationality: '',
    nationality_other: '',
    phone: '',
    email: '',
    job_title: '',
    church_organization: '',
    ministry_participation: '',
    marital_status: '',
    address: '',
    age: '',
    date_of_birth: '',
    commitment_attendance: '',
    commitment_active_role: '',
    notes: '',
    profile_image: '',
    password: '',
    confirm_password: ''
  });

  const translations = {
    sv: {
      pageTitle: 'Ansökan om deltagande i Haggai National Leader Experience Training',
      loading: 'Laddar...',
      invalidLink: 'Ogiltig eller utgången länk',
      invalidLinkDesc: 'Den här registreringslänken är inte giltig. Kontakta den som nominerade dig.',
      alreadyRegistered: 'Redan registrerad',
      alreadyRegisteredDesc: 'Du har redan registrerat dig för denna workshop.',
      backHome: 'Tillbaka till startsidan',
      introTitle: 'Välkommen till Haggai Leader Experience',
      introText: 'Denna utbildning syftar till att förbereda dig för att bli en ledare med en tydlig vision och ett starkt budskap.',
      sessionDates: 'Programsessionsdatum',
      sessionInfo: 'Lördag 14/3, Söndag 15/3\nLördag 21/3, Söndag 22/3',
      nominatedFor: 'Du har blivit nominerad för',
      nominatedBy: 'Nominerad av',
      formTitle: 'Registreringsformulär',
      required: 'Obligatoriskt',
      selectOption: 'Välj...',
      other: 'Annat',
      specifyOther: 'Ange annat',
      // Form fields
      fullName: 'Fullständigt namn (som du vill se det på certifikatet)',
      gender: 'Kön',
      male: 'Man',
      female: 'Kvinna',
      countryOfResidence: 'Bostadsland',
      nationality: 'Nationalitet',
      phone: 'Telefonnummer',
      email: 'E-postadress',
      jobTitle: 'Yrkesområde och jobbtitel',
      jobPlaceholder: 't.ex. Lärare, Ingenjör, Läkare, Företagare...',
      churchOrganization: 'Kyrka eller organisation',
      churchPlaceholder: 't.ex. Kaldeiska kyrkan, Assyriska kyrkan, Syrisk-ortodoxa, Pingstkyrkan...',
      ministryParticipation: 'Vilken typ av tjänst deltar du i?',
      ministryPlaceholder: 't.ex. Lovsångsledare, Ungdomsledare, Söndagsskollärare, Diakon...',
      maritalStatus: 'Civilstånd',
      single: 'Ogift',
      married: 'Gift',
      divorced: 'Skild',
      widowed: 'Änka/Änkling',
      address: 'Adress',
      addressPlaceholder: 't.ex. Storgatan 1, 123 45 Stockholm',
      age: 'Ålder',
      dateOfBirth: 'Födelsedatum',
      // Countries
      sweden: 'Sverige',
      norway: 'Norge',
      denmark: 'Danmark',
      germany: 'Tyskland',
      // Nationalities
      iraqi: 'Irakisk',
      syrian: 'Syrisk',
      lebanese: 'Libanesisk',
      egyptian: 'Egyptisk',
      jordanian: 'Jordansk',
      palestinian: 'Palestinsk',
      swedish: 'Svensk',
      norwegian: 'Norsk',
      danish: 'Dansk',
      german: 'Tysk',
      // Commitments
      commitmentTitle: 'Åtaganden',
      commitmentAttendance: 'Jag förbinder mig att delta i alla utbildningssessioner. Frånvaro från en eller flera sessioner kan leda till uteslutning från programmet och Haggai-medlemskap.',
      commitmentActiveRole: 'Jag förbinder mig att ha en aktiv roll i Haggai Experience-programmet och därefter',
      yesCommit: 'Ja, jag förbinder mig',
      noCommit: 'Nej',
      iCommit: 'Jag förbinder mig',
      iDoNotCommit: 'Jag förbinder mig inte',
      notes: 'Övriga kommentarer (valfritt)',
      submit: 'Skicka ansökan',
      submitting: 'Skickar...',
      successTitle: 'Tack för din ansökan!',
      successDesc: 'Din ansökan har tagits emot.',
      successMessage: 'Haggai-teamet kommer att gå igenom din ansökan och återkommer till dig inom kort med bekräftelse.',
      successNote: 'Vi kontaktar dig via e-post eller telefon.',
      errorTitle: 'Fel',
      errorDesc: 'Kunde inte skicka ansökan. Försök igen.',
      profileImage: 'Profilbild',
      profileImageDesc: 'Ladda upp en aktuell bild på dig själv',
      selectImage: 'Välj bild',
      changeImage: 'Byt bild',
      removeImage: 'Ta bort',
      uploadingImage: 'Laddar upp...',
      imageRequired: 'Profilbild krävs'
    },
    en: {
      pageTitle: 'Application for Haggai National Leader Experience Training',
      loading: 'Loading...',
      invalidLink: 'Invalid or expired link',
      invalidLinkDesc: 'This registration link is not valid. Please contact the person who nominated you.',
      alreadyRegistered: 'Already registered',
      alreadyRegisteredDesc: 'You have already registered for this workshop.',
      backHome: 'Back to home',
      introTitle: 'Welcome to Haggai Leader Experience',
      introText: 'This training aims to prepare you to become a leader with a clear vision and a strong message.',
      sessionDates: 'Program Session Dates',
      sessionInfo: 'Saturday 14/3, Sunday 15/3\nSaturday 21/3, Sunday 22/3',
      nominatedFor: 'You have been nominated for',
      nominatedBy: 'Nominated by',
      formTitle: 'Registration Form',
      required: 'Required',
      selectOption: 'Select...',
      other: 'Other',
      specifyOther: 'Specify other',
      fullName: 'Full name (as you want it on the certificate)',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      countryOfResidence: 'Country of residence',
      nationality: 'Nationality',
      phone: 'Phone number',
      email: 'Email address',
      jobTitle: 'Nature of work and job title',
      jobPlaceholder: 'e.g. Teacher, Engineer, Doctor, Entrepreneur...',
      churchOrganization: 'Church or organization',
      churchPlaceholder: 'e.g. Chaldean Church, Assyrian Church, Syriac Orthodox, Evangelical...',
      ministryParticipation: 'What is your participation in ministry?',
      ministryPlaceholder: 'e.g. Worship leader, Youth leader, Sunday school teacher, Deacon...',
      maritalStatus: 'Marital status',
      single: 'Single',
      married: 'Married',
      divorced: 'Divorced',
      widowed: 'Widowed',
      address: 'Address',
      addressPlaceholder: 'e.g. King Street 1, 123 45 Stockholm',
      age: 'Age',
      dateOfBirth: 'Date of birth',
      // Countries
      sweden: 'Sweden',
      norway: 'Norway',
      denmark: 'Denmark',
      germany: 'Germany',
      // Nationalities
      iraqi: 'Iraqi',
      syrian: 'Syrian',
      lebanese: 'Lebanese',
      egyptian: 'Egyptian',
      jordanian: 'Jordanian',
      palestinian: 'Palestinian',
      swedish: 'Swedish',
      norwegian: 'Norwegian',
      danish: 'Danish',
      german: 'German',
      // Commitments
      commitmentTitle: 'Commitments',
      commitmentAttendance: 'I commit to attending all training sessions. Absence from one or more sessions may result in exclusion from the program and Haggai membership.',
      commitmentActiveRole: 'I commit to having an active role in the Haggai Experience program and beyond',
      yesCommit: 'Yes, I commit',
      noCommit: 'No',
      iCommit: 'I commit',
      iDoNotCommit: 'I do not commit',
      notes: 'Other notes (optional)',
      submit: 'Submit application',
      submitting: 'Submitting...',
      successTitle: 'Thank you for your application!',
      successDesc: 'Your application has been received.',
      successMessage: 'The Haggai team will review your application and get back to you shortly with confirmation.',
      successNote: 'We will contact you via email or phone.',
      errorTitle: 'Error',
      errorDesc: 'Could not submit application. Please try again.',
      profileImage: 'Profile Photo',
      profileImageDesc: 'Upload a recent photo of yourself',
      selectImage: 'Select Image',
      changeImage: 'Change Image',
      removeImage: 'Remove',
      uploadingImage: 'Uploading...',
      imageRequired: 'Profile photo is required'
    },
    ar: {
      pageTitle: 'طلب المشاركة في تدريب خبرة قادة حجاي الوطني - ستوكهولم 2026',
      loading: 'جاري التحميل...',
      invalidLink: 'رابط غير صالح أو منتهي الصلاحية',
      invalidLinkDesc: 'رابط التسجيل هذا غير صالح. يرجى الاتصال بالشخص الذي رشحك.',
      alreadyRegistered: 'مسجل بالفعل',
      alreadyRegisteredDesc: 'لقد قمت بالتسجيل بالفعل في هذه الورشة.',
      backHome: 'العودة للصفحة الرئيسية',
      introTitle: 'مرحباً بك في برنامج خبرة قادة حجاي',
      introText: 'يهدف هذا التدريب إلى إعدادك لتكون قائدًا يحمل رؤية واضحة ورسالة قوية.',
      sessionDates: 'مواعيد جلسات البرنامج',
      sessionInfo: 'السبت 14/3، الأحد 15/3\nالسبت 21/3، الأحد 22/3',
      nominatedFor: 'لقد تم ترشيحك لـ',
      nominatedBy: 'تم الترشيح بواسطة',
      formTitle: 'استمارة التسجيل',
      required: 'مطلوب',
      selectOption: 'اختر...',
      other: 'أخرى',
      specifyOther: 'حدد أخرى',
      // Form fields
      fullName: 'الإسم كامل (كما تود ان تراه في الشهادة)',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      countryOfResidence: 'بلد الإقامة',
      nationality: 'الجنسية',
      phone: 'رقم الهاتف',
      email: 'الايميل',
      jobTitle: 'طبيعة العمل واسم الوظيفة',
      jobPlaceholder: 'مثال: معلم، مهندس، طبيب، رجل أعمال...',
      churchOrganization: 'الكنيسة او المنظمة',
      churchPlaceholder: 'مثال: الكنيسة الكلدانية، الكنيسة الآشورية، السريان الأرثوذكس، الإنجيلية...',
      ministryParticipation: 'ما هي مشاركتك في الخدمة',
      ministryPlaceholder: 'مثال: قائد تسبيح، قائد شباب، معلم مدرسة أحد، شماس...',
      maritalStatus: 'الحالة الإجتماعية',
      single: 'أعزب',
      married: 'متزوج',
      divorced: 'مطلق',
      widowed: 'أرمل',
      address: 'العنوان',
      addressPlaceholder: 'مثال: شارع الملك 1، 123 45 ستوكهولم',
      age: 'العمر',
      dateOfBirth: 'تاريخ الميلاد',
      // Countries
      sweden: 'السويد',
      norway: 'النرويج',
      denmark: 'الدنمارك',
      germany: 'ألمانيا',
      // Nationalities
      iraqi: 'عراقي',
      syrian: 'سوري',
      lebanese: 'لبناني',
      egyptian: 'مصري',
      jordanian: 'أردني',
      palestinian: 'فلسطيني',
      swedish: 'سويدي',
      norwegian: 'نرويجي',
      danish: 'دنماركي',
      german: 'ألماني',
      maritalStatus: 'الحالة الإجتماعية',
      address: 'العنوان',
      age: 'العمر',
      dateOfBirth: 'تاريخ الميلاد',
      // Commitments
      commitmentTitle: 'التعهدات',
      commitmentAttendance: 'اتعهد بحضور جميع جلسات التدريب، عدم حضوري لجلسة واحدة او اكثر قد يتسبب في استثنائي من البرنامج وعضوية حجاي',
      commitmentActiveRole: 'أتعهد بأن يكون لي دور فعال في برنامج خبرة حجاي وما بعده',
      yesCommit: 'نعم اتعهد',
      noCommit: 'لا',
      iCommit: 'أتعهد',
      iDoNotCommit: 'لا أتعهد',
      notes: 'ملاحظات اخرى (اختياري)',
      submit: 'إرسال الطلب',
      submitting: 'جاري الإرسال...',
      successTitle: 'شكراً لتقديم طلبك!',
      successDesc: 'تم استلام طلبك.',
      successMessage: 'سيقوم فريق حجاي بمراجعة طلبك والرد عليك قريباً بالتأكيد.',
      successNote: 'سنتواصل معك عبر البريد الإلكتروني أو الهاتف.',
      errorTitle: 'خطأ',
      errorDesc: 'لم نتمكن من إرسال الطلب. يرجى المحاولة مرة أخرى.',
      profileImage: 'صورة شخصية',
      profileImageDesc: 'قم بتحميل صورة حديثة لك',
      selectImage: 'اختر صورة',
      changeImage: 'تغيير الصورة',
      removeImage: 'إزالة',
      uploadingImage: 'جاري التحميل...',
      imageRequired: 'الصورة الشخصية مطلوبة'
    }
  };

  const txt = translations[formLanguage] || translations.sv;

  useEffect(() => {
    fetchNomination();
  }, [nominationId]);

  const fetchNomination = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${nominationId}`);
      if (response.ok) {
        const data = await response.json();
        setNomination(data);
        // Pre-fill email and name if available
        setFormData(prev => ({
          ...prev,
          email: data.nominee_email || '',
          full_name: data.nominee_name || ''
        }));
        // Check if already registered
        if (data.registration_completed) {
          setAlreadyRegistered(true);
        }
      } else {
        setError('invalid');
      }
    } catch (err) {
      setError('invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Map internal values to display text
  const countryMap = {
    sweden: 'Sweden',
    norway: 'Norway', 
    denmark: 'Denmark',
    germany: 'Germany'
  };

  const nationalityMap = {
    iraqi: 'Iraqi',
    syrian: 'Syrian',
    lebanese: 'Lebanese',
    egyptian: 'Egyptian',
    jordanian: 'Jordanian',
    palestinian: 'Palestinian',
    swedish: 'Swedish',
    norwegian: 'Norwegian',
    danish: 'Danish',
    german: 'German'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare data - handle "other" options and convert values
      const submitData = {
        ...formData,
        country_of_residence: formData.country_of_residence === 'other' 
          ? formData.country_other 
          : (countryMap[formData.country_of_residence] || formData.country_of_residence),
        nationality: formData.nationality === 'other' 
          ? formData.nationality_other 
          : (nationalityMap[formData.nationality] || formData.nationality)
      };

      const response = await fetch(`${BACKEND_URL}/api/nominations/${nominationId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setRegistrationComplete(true);
      } else {
        throw new Error('Failed');
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

  if (error || !nomination) {
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

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-800 mb-2">{txt.alreadyRegistered}</h2>
            <p className="text-stone-600 mb-6">{txt.alreadyRegisteredDesc}</p>
            <Button onClick={() => navigate('/')} className="bg-haggai hover:bg-haggai-dark">
              {txt.backHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Registration Complete - Success Page
  if (registrationComplete) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Success Icon */}
            <div className="bg-green-100 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-stone-800 mb-4">{txt.successTitle}</h1>
            <p className="text-xl text-stone-600 mb-8">{txt.successDesc}</p>
            
            {/* Message Card */}
            <Card className="border-0 shadow-xl text-left mb-8">
              <CardContent className="p-8">
                <p className="text-stone-700 leading-relaxed text-lg">
                  {txt.successMessage}
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    📧 {txt.successNote}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Back Button */}
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="border-haggai text-haggai hover:bg-haggai hover:text-white"
            >
              {txt.backHome}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Language Selector */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-haggai" />
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setFormLanguage('sv')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                formLanguage === 'ar' 
                  ? 'bg-haggai text-white' 
                  : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/haggai-logo.png" alt="Haggai" className="h-16 mx-auto mb-4" onError={(e) => e.target.style.display = 'none'} />
          <h1 className="text-3xl font-bold text-stone-800">{txt.pageTitle}</h1>
        </div>

        {/* Intro Card */}
        <Card className="border-0 shadow-xl mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-haggai to-haggai-dark text-white">
            <CardTitle className="text-xl">{txt.introTitle}</CardTitle>
          </CardHeader>
          <CardContent className={`p-6 ${isRTL ? 'text-right' : ''}`}>
            <p className="text-stone-700 leading-relaxed mb-4">{txt.introText}</p>
            <p className="text-haggai-dark font-semibold italic">&ldquo;{txt.introCall}&rdquo;</p>
            
            {/* Nomination info */}
            <div className="mt-6 p-4 bg-haggai-50 rounded-xl">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <GraduationCap className="h-5 w-5 text-haggai" />
                <span className="font-medium text-stone-800">{txt.nominatedFor}:</span>
              </div>
              <p className="text-lg font-semibold text-haggai mb-2">{nomination.event_title}</p>
              <p className="text-sm text-stone-600">{txt.nominatedBy}: {nomination.nominator_name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className={`text-xl ${isRTL ? 'text-right' : ''}`}>{txt.formTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Session Dates Info */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className={`font-semibold text-blue-800 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  📅 {txt.sessionDates}
                </h4>
                <p className={`text-blue-700 whitespace-pre-line ${isRTL ? 'text-right' : ''}`}>
                  {txt.sessionInfo}
                </p>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <User className="h-4 w-4" />
                    {txt.fullName}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Gender - Select */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.gender}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleChange('gender', value)}
                    required
                  >
                    <SelectTrigger className={isRTL ? 'text-right' : ''}>
                      <SelectValue placeholder={txt.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{txt.male}</SelectItem>
                      <SelectItem value="female">{txt.female}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Country of Residence - Select with Other option */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className="h-4 w-4" />
                    {txt.countryOfResidence}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select 
                    value={formData.country_of_residence} 
                    onValueChange={(value) => {
                      handleChange('country_of_residence', value);
                      setShowOtherCountry(value === 'other');
                    }}
                    required
                  >
                    <SelectTrigger className={isRTL ? 'text-right' : ''}>
                      <SelectValue placeholder={txt.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sweden">{txt.sweden}</SelectItem>
                      <SelectItem value="norway">{txt.norway}</SelectItem>
                      <SelectItem value="denmark">{txt.denmark}</SelectItem>
                      <SelectItem value="germany">{txt.germany}</SelectItem>
                      <SelectItem value="other">{txt.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  {showOtherCountry && (
                    <Input
                      className={`mt-2 ${isRTL ? 'text-right' : ''}`}
                      placeholder={txt.specifyOther}
                      value={formData.country_other}
                      onChange={(e) => handleChange('country_other', e.target.value)}
                      required
                    />
                  )}
                </div>

                {/* Nationality - Select with Other option */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Globe className="h-4 w-4" />
                    {txt.nationality}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select 
                    value={formData.nationality} 
                    onValueChange={(value) => {
                      handleChange('nationality', value);
                      setShowOtherNationality(value === 'other');
                    }}
                    required
                  >
                    <SelectTrigger className={isRTL ? 'text-right' : ''}>
                      <SelectValue placeholder={txt.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iraqi">{txt.iraqi}</SelectItem>
                      <SelectItem value="syrian">{txt.syrian}</SelectItem>
                      <SelectItem value="lebanese">{txt.lebanese}</SelectItem>
                      <SelectItem value="egyptian">{txt.egyptian}</SelectItem>
                      <SelectItem value="jordanian">{txt.jordanian}</SelectItem>
                      <SelectItem value="palestinian">{txt.palestinian}</SelectItem>
                      <SelectItem value="swedish">{txt.swedish}</SelectItem>
                      <SelectItem value="norwegian">{txt.norwegian}</SelectItem>
                      <SelectItem value="danish">{txt.danish}</SelectItem>
                      <SelectItem value="german">{txt.german}</SelectItem>
                      <SelectItem value="other">{txt.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  {showOtherNationality && (
                    <Input
                      className={`mt-2 ${isRTL ? 'text-right' : ''}`}
                      placeholder={txt.specifyOther}
                      value={formData.nationality_other}
                      onChange={(e) => handleChange('nationality_other', e.target.value)}
                      required
                    />
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Phone className="h-4 w-4" />
                    {txt.phone}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Mail className="h-4 w-4" />
                    {txt.email}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Job Title */}
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Briefcase className="h-4 w-4" />
                    {txt.jobTitle}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.job_title}
                    onChange={(e) => handleChange('job_title', e.target.value)}
                    placeholder={txt.jobPlaceholder}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Church/Organization */}
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Church className="h-4 w-4" />
                    {txt.churchOrganization}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.church_organization}
                    onChange={(e) => handleChange('church_organization', e.target.value)}
                    placeholder={txt.churchPlaceholder}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Ministry Participation */}
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.ministryParticipation}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Textarea
                    required
                    value={formData.ministry_participation}
                    onChange={(e) => handleChange('ministry_participation', e.target.value)}
                    placeholder={txt.ministryPlaceholder}
                    className={isRTL ? 'text-right' : ''}
                    rows={3}
                  />
                </div>

                {/* Marital Status - Select */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.maritalStatus}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select 
                    value={formData.marital_status} 
                    onValueChange={(value) => handleChange('marital_status', value)}
                    required
                  >
                    <SelectTrigger className={isRTL ? 'text-right' : ''}>
                      <SelectValue placeholder={txt.selectOption} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">{txt.single}</SelectItem>
                      <SelectItem value="married">{txt.married}</SelectItem>
                      <SelectItem value="divorced">{txt.divorced}</SelectItem>
                      <SelectItem value="widowed">{txt.widowed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className="h-4 w-4" />
                    {txt.address}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder={txt.addressPlaceholder}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Age */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.age}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder={isRTL ? "مثال: ٣٥" : "t.ex. 35"}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Calendar className="h-4 w-4" />
                    {txt.dateOfBirth}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  />
                </div>
              </div>

              {/* Commitments */}
              <div className="border-t pt-6">
                <h3 className={`font-semibold text-stone-800 mb-4 ${isRTL ? 'text-right' : ''}`}>
                  {txt.commitmentTitle}
                </h3>
                
                {/* Attendance Commitment */}
                <div className="mb-6 p-4 bg-amber-50 rounded-xl">
                  <Label className={`block mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {txt.commitmentAttendance}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commitment_attendance"
                        value="yes"
                        checked={formData.commitment_attendance === 'yes'}
                        onChange={(e) => handleChange('commitment_attendance', e.target.value)}
                        required
                      />
                      {txt.yesCommit}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commitment_attendance"
                        value="no"
                        checked={formData.commitment_attendance === 'no'}
                        onChange={(e) => handleChange('commitment_attendance', e.target.value)}
                      />
                      {txt.noCommit}
                    </label>
                  </div>
                </div>

                {/* Active Role Commitment */}
                <div className="mb-6 p-4 bg-stone-50 rounded-xl">
                  <Label className={`block mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {txt.commitmentActiveRole}
                    <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commitment_active_role"
                        value="yes"
                        checked={formData.commitment_active_role === 'yes'}
                        onChange={(e) => handleChange('commitment_active_role', e.target.value)}
                        required
                      />
                      {txt.iCommit}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commitment_active_role"
                        value="no"
                        checked={formData.commitment_active_role === 'no'}
                        onChange={(e) => handleChange('commitment_active_role', e.target.value)}
                      />
                      {txt.iDoNotCommit}
                    </label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t pt-6">
                <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                  {txt.notes}
                </Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className={isRTL ? 'text-right' : ''}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-haggai hover:bg-haggai-dark text-white py-6 text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    {txt.submitting}
                  </>
                ) : (
                  txt.submit
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NomineeRegistration;
