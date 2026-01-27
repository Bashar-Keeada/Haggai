import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, User, Mail, Phone, MapPin, Briefcase, Church, GraduationCap, CheckCircle, AlertCircle, Loader2, Upload, Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NomineeRegistration = () => {
  const { nominationId } = useParams();
  const navigate = useNavigate();
  const { language: globalLanguage } = useLanguage();
  // Local language state for this form - user can choose their preferred language
  const [formLanguage, setFormLanguage] = useState(globalLanguage);
  const isRTL = formLanguage === 'ar';
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nomination, setNomination] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    profile_image: '',
    full_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    email: '',
    full_address: '',
    marital_status: '',
    place_of_birth: '',
    work_field: '',
    current_profession: '',
    employer_name: '',
    church_name: '',
    church_role: '',
    commitment_attendance: '',
    commitment_active_role: '',
    fee_support_request: '',
    notes: ''
  });

  const translations = {
    sv: {
      pageTitle: 'Registrering för Haggai Workshop',
      loading: 'Laddar...',
      invalidLink: 'Ogiltig eller utgången länk',
      invalidLinkDesc: 'Den här registreringslänken är inte giltig. Kontakta den som nominerade dig.',
      alreadyRegistered: 'Redan registrerad',
      alreadyRegisteredDesc: 'Du har redan registrerat dig för denna workshop.',
      backHome: 'Tillbaka till startsidan',
      introTitle: 'Välkommen till Haggai Leader Experience',
      introText: 'Denna utbildning syftar till att förbereda dig för att bli en ledare med en tydlig vision och ett starkt budskap för att presentera evangeliet. Utbildningen är utformad för att möta de växande utmaningarna i vårt samhälle idag och för att forma nya generationer av troende ledare som är redo att ta ansvar - inte bara i sina personliga liv eller familjer, utan också gentemot sitt samhälle.',
      introCall: 'Du är kallad att ta ansvar för att visa Kristi bild i alla aspekter av ditt liv och att ta en modig ledarroll för att vägleda världen mot Gud.',
      nominatedFor: 'Du har blivit nominerad för',
      nominatedBy: 'Nominerad av',
      formTitle: 'Registreringsformulär',
      required: 'Obligatoriskt',
      // Form fields
      profilePhoto: 'Profilfoto',
      uploadPhoto: 'Ladda upp foto',
      photoSelected: 'Foto valt',
      fullName: 'Fullständigt namn',
      gender: 'Kön',
      male: 'Man',
      female: 'Kvinna',
      dateOfBirth: 'Födelsedatum',
      phone: 'Telefonnummer',
      email: 'E-postadress',
      fullAddress: 'Fullständig adress',
      maritalStatus: 'Civilstånd',
      placeOfBirth: 'Födelseort',
      workField: 'Primärt arbetsområde',
      currentProfession: 'Nuvarande yrke',
      employerName: 'Arbetsgivarens namn',
      churchName: 'Namn på din kyrka',
      churchRole: 'Har du en roll i din kyrka? Om ja, vilken?',
      commitmentTitle: 'Åtaganden',
      commitmentAttendance: 'Jag förbinder mig att delta i alla utbildningssessioner',
      commitmentAttendanceNote: 'Frånvaro från någon session kan leda till uteslutning från programmet och att du inte får ditt certifikat.',
      commitmentActiveRole: 'Jag förbinder mig att ha en aktiv roll i Haggai-programmet och därefter',
      yes: 'Ja',
      no: 'Nej',
      iCommit: 'Jag förbinder mig',
      iDoNotCommit: 'Jag förbinder mig inte',
      feeTitle: 'Deltagaravgift',
      feeAmount: '1200 SEK',
      feeIncludes: 'Avgiften inkluderar:',
      feeItem1: 'Certifikat för Haggai Leader Training',
      feeItem2: 'Lunch varje dag under utbildningen',
      feeItem3: 'Tre fikapauser dagligen',
      feeItem4: 'Allt kontorsmaterial',
      feeItem5: 'Utbildarkostnader',
      feeSupportRequest: 'Om du behöver ekonomiskt stöd för avgiften, skriv till oss',
      notes: 'Övriga kommentarer',
      submit: 'Skicka registrering',
      submitting: 'Skickar...',
      successTitle: 'Tack för din registrering!',
      successDesc: 'Din ansökan har tagits emot.',
      successMessage: 'Haggai-teamet kommer att gå igenom din ansökan och återkommer till dig inom kort med bekräftelse. Eftersom vi har begränsat antal platser och många ansökningar, ber vi dig ha tålamod under granskningsprocessen.',
      successNote: 'Vi kontaktar dig via e-post eller telefon.',
      errorTitle: 'Fel',
      errorDesc: 'Kunde inte skicka registreringen. Försök igen.'
    },
    en: {
      pageTitle: 'Registration for Haggai Workshop',
      loading: 'Loading...',
      invalidLink: 'Invalid or expired link',
      invalidLinkDesc: 'This registration link is not valid. Please contact the person who nominated you.',
      alreadyRegistered: 'Already registered',
      alreadyRegisteredDesc: 'You have already registered for this workshop.',
      backHome: 'Back to home',
      introTitle: 'Welcome to Haggai Leader Experience',
      introText: 'This training aims to prepare you to become a leader with a clear vision and a strong message to present the Gospel. The training is designed to respond to the growing challenges facing our societies today and to form new generations of believing leaders who are ready to take responsibility - not only in their personal lives or families, but also towards their community.',
      introCall: 'You are called to take responsibility for showing the image of Christ in all aspects of your life and to take a courageous leadership position to guide the world towards God.',
      nominatedFor: 'You have been nominated for',
      nominatedBy: 'Nominated by',
      formTitle: 'Registration Form',
      required: 'Required',
      fullName: 'Full name',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      dateOfBirth: 'Date of birth',
      phone: 'Phone number',
      email: 'Email address',
      fullAddress: 'Full address',
      maritalStatus: 'Marital status',
      placeOfBirth: 'Place of birth',
      workField: 'Primary work field',
      currentProfession: 'Current profession',
      employerName: 'Employer name',
      churchName: 'Church name',
      churchRole: 'Do you have a role in your church? If yes, what is it?',
      commitmentTitle: 'Commitments',
      commitmentAttendance: 'I commit to attending all training sessions',
      commitmentAttendanceNote: 'Absence from any session may result in exclusion from the program and not receiving your certificate.',
      commitmentActiveRole: 'I commit to having an active role in the Haggai program and beyond',
      yes: 'Yes',
      no: 'No',
      iCommit: 'I commit',
      iDoNotCommit: 'I do not commit',
      feeTitle: 'Participation Fee',
      feeAmount: '1200 SEK',
      feeIncludes: 'The fee includes:',
      feeItem1: 'Haggai Leader Training Certificate',
      feeItem2: 'Lunch every day during training',
      feeItem3: 'Three fika breaks daily',
      feeItem4: 'All office supplies',
      feeItem5: 'Trainer costs',
      feeSupportRequest: 'If you need financial support for the fee, write to us',
      notes: 'Additional comments',
      submit: 'Submit registration',
      submitting: 'Submitting...',
      successTitle: 'Thank you for your registration!',
      successDesc: 'Your application has been received.',
      successMessage: 'The Haggai team will review your application and get back to you shortly with confirmation. As we have limited spots and many applications, we ask for your patience during the review process.',
      successNote: 'We will contact you via email or phone.',
      errorTitle: 'Error',
      errorDesc: 'Could not submit registration. Please try again.'
    },
    ar: {
      pageTitle: 'التسجيل في ورشة عمل حجاي',
      loading: 'جاري التحميل...',
      invalidLink: 'رابط غير صالح أو منتهي الصلاحية',
      invalidLinkDesc: 'رابط التسجيل هذا غير صالح. يرجى الاتصال بالشخص الذي رشحك.',
      alreadyRegistered: 'مسجل بالفعل',
      alreadyRegisteredDesc: 'لقد قمت بالتسجيل بالفعل في هذه الورشة.',
      backHome: 'العودة للصفحة الرئيسية',
      introTitle: 'مرحباً بك في برنامج خبرة قادة حجاي',
      introText: 'يهدف هذا التدريب إلى إعدادك لتكون قائدًا يحمل رؤية واضحة ورسالة قوية لتقديم الإنجيل. تم إعداد هذا التدريب للاستجابة للتحديات المتزايدة التي تواجه مجتمعاتنا اليوم لتكوين أجيال جديدة من القادة المؤمنين المستعدين لتحمل المسؤولية ليس فقط في حدود حياتهم الشخصية أو عائلاتهم بل تجاه مجتمعهم أيضاً.',
      introCall: 'أنت مدعو لتحمل مسؤولية إظهار صورة المسيح في كل جوانب حياتك، واتخاذ موقف قيادي وشجاع لتوجيه العالم نحو الله.',
      nominatedFor: 'لقد تم ترشيحك لـ',
      nominatedBy: 'تم الترشيح بواسطة',
      formTitle: 'استمارة التسجيل',
      required: 'مطلوب',
      // Form fields
      profilePhoto: 'صورة الملف الشخصي',
      uploadPhoto: 'رفع صورة',
      photoSelected: 'تم اختيار الصورة',
      fullName: 'الاسم الكامل',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      dateOfBirth: 'تاريخ الميلاد',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      fullAddress: 'العنوان الكامل',
      maritalStatus: 'الحالة الاجتماعية',
      placeOfBirth: 'مكان الولادة',
      workField: 'مجال العمل الأساسي',
      currentProfession: 'المهنة الحالية',
      employerName: 'اسم الجهة التي تعمل فيها',
      churchName: 'اسم الكنيسة التي تنتمي إليها',
      churchRole: 'هل لديك دور في كنيستك؟ إذا كانت الإجابة نعم، ما هو هذا الدور؟',
      commitmentTitle: 'التعهدات',
      commitmentAttendance: 'أتعهد بحضور جميع جلسات التدريب',
      commitmentAttendanceNote: 'الاعتذار عن أي جلسة قد يتسبب باستثنائك من عضوية المعهد وحصولك على شهادة التدريب.',
      commitmentActiveRole: 'أتعهد بأن يكون لي دور فعال في برنامج خبرة حجاي وما بعده',
      yes: 'نعم',
      no: 'لا',
      iCommit: 'أتعهد',
      iDoNotCommit: 'لا أتعهد',
      feeTitle: 'رسوم المشاركة',
      feeAmount: '1200 كرون',
      feeIncludes: 'تشمل الرسوم:',
      feeItem1: 'شهادة إتمام تدريب قادة حجاي',
      feeItem2: 'توفير وجبة غداء يوميًا طوال فترة التدريب',
      feeItem3: 'تقديم ثلاث استراحات "فيكا" يوميًا خلال جميع أيام التدريب',
      feeItem4: 'توفير كافة المستلزمات المكتبية اللازمة',
      feeItem5: 'تغطية تكاليف المدربين المشاركين في التدريب',
      feeSupportRequest: 'إذا تحتاج لدعم بجزء من رسوم الاشتراك اكتب لنا',
      notes: 'ملاحظات إن وجدت',
      submit: 'إرسال التسجيل',
      submitting: 'جاري الإرسال...',
      successTitle: 'شكراً لتسجيلك!',
      successDesc: 'تم استلام طلبك.',
      successMessage: 'سيقوم فريق حجاي بمراجعة طلبك والرد عليك قريباً بالتأكيد. نظراً لمحدودية الأماكن وكثرة الطلبات، نطلب منك الصبر خلال عملية المراجعة.',
      successNote: 'سنتواصل معك عبر البريد الإلكتروني أو الهاتف.',
      errorTitle: 'خطأ',
      errorDesc: 'لم نتمكن من إرسال التسجيل. يرجى المحاولة مرة أخرى.'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${nominationId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
              {/* Profile Photo Upload */}
              <div className="md:col-span-2">
                <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <User className="h-4 w-4" />
                  {txt.profilePhoto}
                </Label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-haggai hover:bg-haggai/5 transition-colors">
                      <Upload className="h-5 w-5 text-stone-400" />
                      <span className="text-sm text-stone-600">
                        {formData.profile_image ? txt.photoSelected : txt.uploadPhoto}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handleChange('profile_image', event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {formData.profile_image && (
                    <img 
                      src={formData.profile_image} 
                      alt="Profile preview" 
                      className="h-20 w-20 rounded-full object-cover border-2 border-haggai"
                    />
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <User className="h-4 w-4" />
                    {txt.fullName}
                    <Badge variant="destructive" className="text-xs">{txt.required}</Badge>
                  </Label>
                  <Input
                    required
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.gender}
                    <Badge variant="destructive" className="text-xs">{txt.required}</Badge>
                  </Label>
                  <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        required
                        className="text-haggai"
                      />
                      {txt.male}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="text-haggai"
                      />
                      {txt.female}
                    </label>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Calendar className="h-4 w-4" />
                    {txt.dateOfBirth}
                    <Badge variant="destructive" className="text-xs">{txt.required}</Badge>
                  </Label>
                  <Input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Phone className="h-4 w-4" />
                    {txt.phone}
                    <Badge variant="destructive" className="text-xs">{txt.required}</Badge>
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
                    <Badge variant="destructive" className="text-xs">{txt.required}</Badge>
                  </Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Full Address */}
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className="h-4 w-4" />
                    {txt.fullAddress}
                    <Badge variant="destructive" className="text-xs">{txt.required}</Badge>
                  </Label>
                  <Textarea
                    required
                    value={formData.full_address}
                    onChange={(e) => handleChange('full_address', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Marital Status */}
                <div>
                  <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                    {txt.maritalStatus}
                    <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                  </Label>
                  <Input
                    required
                    value={formData.marital_status}
                    onChange={(e) => handleChange('marital_status', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>

                {/* Place of Birth */}
                <div>
                  <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                    {txt.placeOfBirth}
                    <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                  </Label>
                  <Input
                    required
                    value={formData.place_of_birth}
                    onChange={(e) => handleChange('place_of_birth', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
                </div>
              </div>

              {/* Work Information */}
              <div className="border-t pt-6">
                <h3 className={`font-semibold text-stone-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Briefcase className="h-5 w-5 text-haggai" />
                  {formLanguage === 'ar' ? 'معلومات العمل' : formLanguage === 'en' ? 'Work Information' : 'Arbetsinformation'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                      {txt.workField}
                      <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                    </Label>
                    <Input
                      required
                      value={formData.work_field}
                      onChange={(e) => handleChange('work_field', e.target.value)}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                  <div>
                    <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                      {txt.currentProfession}
                      <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                    </Label>
                    <Input
                      required
                      value={formData.current_profession}
                      onChange={(e) => handleChange('current_profession', e.target.value)}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                      {txt.employerName}
                      <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                    </Label>
                    <Input
                      required
                      value={formData.employer_name}
                      onChange={(e) => handleChange('employer_name', e.target.value)}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                </div>
              </div>

              {/* Church Information */}
              <div className="border-t pt-6">
                <h3 className={`font-semibold text-stone-800 mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Church className="h-5 w-5 text-haggai" />
                  {formLanguage === 'ar' ? 'معلومات الكنيسة' : formLanguage === 'en' ? 'Church Information' : 'Kyrkoinformation'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                      {txt.churchName}
                      <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                    </Label>
                    <Input
                      required
                      value={formData.church_name}
                      onChange={(e) => handleChange('church_name', e.target.value)}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                      {txt.churchRole}
                      <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                    </Label>
                    <Textarea
                      required
                      value={formData.church_role}
                      onChange={(e) => handleChange('church_role', e.target.value)}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>
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
                    <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
                  </Label>
                  <p className={`text-sm text-amber-700 mb-3 ${isRTL ? 'text-right' : ''}`}>
                    ⚠️ {txt.commitmentAttendanceNote}
                  </p>
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
                      {txt.iCommit}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commitment_attendance"
                        value="no"
                        checked={formData.commitment_attendance === 'no'}
                        onChange={(e) => handleChange('commitment_attendance', e.target.value)}
                      />
                      {txt.iDoNotCommit}
                    </label>
                  </div>
                </div>

                {/* Active Role Commitment */}
                <div className="mb-6 p-4 bg-stone-50 rounded-xl">
                  <Label className={`block mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {txt.commitmentActiveRole}
                    <Badge variant="destructive" className="text-xs ml-2">{txt.required}</Badge>
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
                      {txt.yes}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commitment_active_role"
                        value="no"
                        checked={formData.commitment_active_role === 'no'}
                        onChange={(e) => handleChange('commitment_active_role', e.target.value)}
                      />
                      {txt.no}
                    </label>
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              <div className="border-t pt-6">
                <h3 className={`font-semibold text-stone-800 mb-4 ${isRTL ? 'text-right' : ''}`}>
                  {txt.feeTitle}: <span className="text-haggai">{txt.feeAmount}</span>
                </h3>
                <div className={`p-4 bg-emerald-50 rounded-xl mb-4 ${isRTL ? 'text-right' : ''}`}>
                  <p className="font-medium text-emerald-800 mb-2">{txt.feeIncludes}</p>
                  <ul className={`text-sm text-emerald-700 space-y-1 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                    <li>✓ {txt.feeItem1}</li>
                    <li>✓ {txt.feeItem2}</li>
                    <li>✓ {txt.feeItem3}</li>
                    <li>✓ {txt.feeItem4}</li>
                    <li>✓ {txt.feeItem5}</li>
                  </ul>
                </div>
                <div>
                  <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>
                    {txt.feeSupportRequest}
                  </Label>
                  <Input
                    value={formData.fee_support_request}
                    onChange={(e) => handleChange('fee_support_request', e.target.value)}
                    className={isRTL ? 'text-right' : ''}
                  />
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
