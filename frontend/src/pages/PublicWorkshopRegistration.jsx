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
import { Calendar, User, Mail, Phone, MapPin, Briefcase, Church, GraduationCap, CheckCircle, AlertCircle, Loader2, Globe, Upload, Image as ImageIcon, X, UserPlus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PublicWorkshopRegistration = () => {
  const { workshopId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language: globalLanguage } = useLanguage();
  
  const urlLang = searchParams.get('lang');
  const initialLang = urlLang || globalLanguage || 'ar';
  
  const [formLanguage, setFormLanguage] = useState(initialLang);
  const isRTL = formLanguage === 'ar';
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workshop, setWorkshop] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [error, setError] = useState(null);
  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherNationality, setShowOtherNationality] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
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
    recommended_by: ''
  });

  const translations = {
    sv: {
      pageTitle: 'Anmälan till',
      loading: 'Laddar...',
      invalidWorkshop: 'Workshop hittades inte',
      invalidWorkshopDesc: 'Denna workshop finns inte eller är inte längre tillgänglig.',
      backHome: 'Tillbaka till startsidan',
      introTitle: 'Välkommen till Haggai Leader Experience',
      introText: 'Denna utbildning syftar till att förbereda dig för att bli en ledare med en tydlig vision och ett starkt budskap.',
      formTitle: 'Anmälningsformulär',
      required: 'Obligatoriskt',
      selectOption: 'Välj...',
      other: 'Annat',
      specifyOther: 'Ange annat',
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
      sweden: 'Sverige',
      norway: 'Norge',
      denmark: 'Danmark',
      germany: 'Tyskland',
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
      commitmentTitle: 'Åtaganden',
      commitmentAttendance: 'Jag förbinder mig att delta i alla utbildningssessioner.',
      commitmentActiveRole: 'Jag förbinder mig att ha en aktiv roll i Haggai Experience-programmet',
      yesCommit: 'Ja, jag förbinder mig',
      noCommit: 'Nej',
      iCommit: 'Jag förbinder mig',
      iDoNotCommit: 'Jag förbinder mig inte',
      notes: 'Övriga kommentarer (valfritt)',
      recommendedBy: 'Vem rekommenderade dig?',
      recommendedByPlaceholder: 'Skriv namnet på personen som berättade om utbildningen',
      submit: 'Skicka anmälan',
      submitting: 'Skickar...',
      successTitle: 'Tack för din anmälan!',
      successDesc: 'Din anmälan har tagits emot.',
      successMessage: 'Haggai-teamet kommer att gå igenom din anmälan och återkommer till dig inom kort med bekräftelse.',
      successNote: 'Vi kontaktar dig via e-post eller telefon.',
      errorTitle: 'Fel',
      errorDesc: 'Kunde inte skicka anmälan. Försök igen.',
      profileImage: 'Profilbild',
      profileImageDesc: 'Ladda upp en aktuell bild på dig själv',
      selectImage: 'Välj bild',
      changeImage: 'Byt bild',
      removeImage: 'Ta bort',
      imageRequired: 'Profilbild krävs',
      workshopInfo: 'Utbildningsinformation',
      date: 'Datum',
      location: 'Plats'
    },
    en: {
      pageTitle: 'Registration for',
      loading: 'Loading...',
      invalidWorkshop: 'Workshop not found',
      invalidWorkshopDesc: 'This workshop does not exist or is no longer available.',
      backHome: 'Back to home',
      introTitle: 'Welcome to Haggai Leader Experience',
      introText: 'This training aims to prepare you to become a leader with a clear vision and a strong message.',
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
      sweden: 'Sweden',
      norway: 'Norway',
      denmark: 'Denmark',
      germany: 'Germany',
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
      commitmentTitle: 'Commitments',
      commitmentAttendance: 'I commit to attending all training sessions.',
      commitmentActiveRole: 'I commit to having an active role in the Haggai Experience program',
      yesCommit: 'Yes, I commit',
      noCommit: 'No',
      iCommit: 'I commit',
      iDoNotCommit: 'I do not commit',
      notes: 'Other notes (optional)',
      recommendedBy: 'Who recommended you?',
      recommendedByPlaceholder: 'Enter the name of the person who told you about this training',
      submit: 'Submit registration',
      submitting: 'Submitting...',
      successTitle: 'Thank you for your registration!',
      successDesc: 'Your registration has been received.',
      successMessage: 'The Haggai team will review your registration and get back to you shortly.',
      successNote: 'We will contact you via email or phone.',
      errorTitle: 'Error',
      errorDesc: 'Could not submit registration. Please try again.',
      profileImage: 'Profile Photo',
      profileImageDesc: 'Upload a recent photo of yourself',
      selectImage: 'Select Image',
      changeImage: 'Change Image',
      removeImage: 'Remove',
      imageRequired: 'Profile photo is required',
      workshopInfo: 'Training Information',
      date: 'Date',
      location: 'Location'
    },
    ar: {
      pageTitle: 'التسجيل في',
      loading: 'جاري التحميل...',
      invalidWorkshop: 'لم يتم العثور على الورشة',
      invalidWorkshopDesc: 'هذه الورشة غير موجودة أو لم تعد متاحة.',
      backHome: 'العودة للصفحة الرئيسية',
      introTitle: 'مرحباً بك في برنامج خبرة قادة حجاي',
      introText: 'يهدف هذا التدريب إلى إعدادك لتكون قائدًا يحمل رؤية واضحة ورسالة قوية.',
      formTitle: 'استمارة التسجيل',
      required: 'مطلوب',
      selectOption: 'اختر...',
      other: 'أخرى',
      specifyOther: 'حدد أخرى',
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
      sweden: 'السويد',
      norway: 'النرويج',
      denmark: 'الدنمارك',
      germany: 'ألمانيا',
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
      commitmentTitle: 'التعهدات',
      commitmentAttendance: 'اتعهد بحضور جميع جلسات التدريب',
      commitmentActiveRole: 'أتعهد بأن يكون لي دور فعال في برنامج خبرة حجاي',
      yesCommit: 'نعم اتعهد',
      noCommit: 'لا',
      iCommit: 'أتعهد',
      iDoNotCommit: 'لا أتعهد',
      notes: 'ملاحظات اخرى (اختياري)',
      recommendedBy: 'من أخبرك عن هذا التدريب؟',
      recommendedByPlaceholder: 'اكتب اسم الشخص الذي أخبرك عن هذا التدريب',
      submit: 'إرسال التسجيل',
      submitting: 'جاري الإرسال...',
      successTitle: 'شكراً لتسجيلك!',
      successDesc: 'تم استلام تسجيلك.',
      successMessage: 'سيقوم فريق حجاي بمراجعة تسجيلك والرد عليك قريباً.',
      successNote: 'سنتواصل معك عبر البريد الإلكتروني أو الهاتف.',
      errorTitle: 'خطأ',
      errorDesc: 'لم نتمكن من إرسال التسجيل. يرجى المحاولة مرة أخرى.',
      profileImage: 'صورة شخصية',
      profileImageDesc: 'قم بتحميل صورة حديثة لك',
      selectImage: 'اختر صورة',
      changeImage: 'تغيير الصورة',
      removeImage: 'إزالة',
      imageRequired: 'الصورة الشخصية مطلوبة',
      workshopInfo: 'معلومات التدريب',
      date: 'التاريخ',
      location: 'المكان'
    }
  };

  const txt = translations[formLanguage] || translations.sv;

  useEffect(() => {
    fetchWorkshop();
  }, [workshopId]);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.is_active) {
          setWorkshop(data);
        } else {
          setError('inactive');
        }
      } else {
        setError('notfound');
      }
    } catch (err) {
      setError('notfound');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Endast bildformat tillåts');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Bilden får inte vara större än 5MB');
      return;
    }
    
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setProfileImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const countryMap = {
    sweden: 'Sweden', norway: 'Norway', denmark: 'Denmark', germany: 'Germany'
  };

  const nationalityMap = {
    iraqi: 'Iraqi', syrian: 'Syrian', lebanese: 'Lebanese', egyptian: 'Egyptian',
    jordanian: 'Jordanian', palestinian: 'Palestinian', swedish: 'Swedish',
    norwegian: 'Norwegian', danish: 'Danish', german: 'German'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileImageFile) {
      toast.error(txt.imageRequired);
      return;
    }
    
    setSubmitting(true);

    try {
      let profileImageBase64 = null;
      if (profileImageFile) {
        const reader = new FileReader();
        profileImageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(profileImageFile);
        });
      }
      
      const submitData = {
        ...formData,
        profile_image: profileImageBase64,
        language: formLanguage,  // Include the selected language for email preference
        country_of_residence: formData.country_of_residence === 'other' 
          ? formData.country_other 
          : (countryMap[formData.country_of_residence] || formData.country_of_residence),
        nationality: formData.nationality === 'other' 
          ? formData.nationality_other 
          : (nationalityMap[formData.nationality] || formData.nationality)
      };

      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/public-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setRegistrationComplete(true);
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Failed');
      }
    } catch (err) {
      toast.error(txt.errorTitle, { description: err.message || txt.errorDesc });
    } finally {
      setSubmitting(false);
    }
  };

  const getWorkshopTitle = () => {
    if (!workshop) return '';
    if (formLanguage === 'ar' && workshop.title_ar) return workshop.title_ar;
    if (formLanguage === 'en' && workshop.title_en) return workshop.title_en;
    return workshop.title;
  };

  const getWorkshopLocation = () => {
    if (!workshop) return '';
    if (formLanguage === 'ar' && workshop.location_ar) return workshop.location_ar;
    if (formLanguage === 'en' && workshop.location_en) return workshop.location_en;
    return workshop.location;
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

  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-800 mb-2">{txt.invalidWorkshop}</h2>
            <p className="text-stone-600 mb-6">{txt.invalidWorkshopDesc}</p>
            <Button onClick={() => navigate('/')} className="bg-haggai hover:bg-haggai-dark">
              {txt.backHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationComplete) {
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
                <p className="text-stone-700 leading-relaxed text-lg">{txt.successMessage}</p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">📧 {txt.successNote}</p>
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => navigate('/')} variant="outline" className="border-haggai text-haggai hover:bg-haggai hover:text-white">
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
            {['sv', 'en', 'ar'].map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => setFormLanguage(lang)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formLanguage === lang ? 'bg-haggai text-white' : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                {lang === 'sv' ? 'Svenska' : lang === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/haggai-logo.png" alt="Haggai" className="h-16 mx-auto mb-4" onError={(e) => e.target.style.display = 'none'} />
          <h1 className="text-3xl font-bold text-stone-800">{txt.pageTitle}</h1>
          <h2 className="text-2xl font-semibold text-haggai mt-2">{getWorkshopTitle()}</h2>
        </div>

        {/* Workshop Info Card */}
        <Card className="border-0 shadow-xl mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-haggai to-haggai-dark text-white">
            <CardTitle className="text-xl">{txt.introTitle}</CardTitle>
          </CardHeader>
          <CardContent className={`p-6 ${isRTL ? 'text-right' : ''}`}>
            <p className="text-stone-700 leading-relaxed mb-4">{txt.introText}</p>
            
            <div className="mt-6 p-4 bg-haggai-50 rounded-xl">
              <h4 className="font-semibold text-stone-800 mb-3">{txt.workshopInfo}</h4>
              <div className="space-y-2">
                <p className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Calendar className="h-4 w-4 text-haggai" />
                  <span className="text-stone-600">{txt.date}:</span>
                  <span className="font-medium" dir="ltr">{workshop.date} {workshop.end_date && `- ${workshop.end_date}`}</span>
                </p>
                <p className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <MapPin className="h-4 w-4 text-haggai" />
                  <span className="text-stone-600">{txt.location}:</span>
                  <span className="font-medium">{getWorkshopLocation()}</span>
                </p>
              </div>
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
              {/* Recommended By - NEW FIELD */}
              <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <UserPlus className="h-4 w-4 text-amber-600" />
                  {txt.recommendedBy}
                </Label>
                <Input
                  value={formData.recommended_by}
                  onChange={(e) => handleChange('recommended_by', e.target.value)}
                  placeholder={txt.recommendedByPlaceholder}
                  className={`bg-white ${isRTL ? 'text-right' : ''}`}
                  data-testid="recommended-by-input"
                />
              </div>

              {/* Profile Image Upload */}
              <div className="p-4 bg-stone-50 rounded-xl">
                <Label className={`flex items-center gap-1 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <ImageIcon className="h-4 w-4" />
                  {txt.profileImage}
                  <span className="text-red-500 text-lg">*</span>
                </Label>
                <p className={`text-sm text-stone-600 mb-4 ${isRTL ? 'text-right' : ''}`}>{txt.profileImageDesc}</p>
                
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" data-testid="profile-image-input" />
                
                {profileImagePreview ? (
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="relative">
                      <img src={profileImagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-haggai" />
                      <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="border-haggai text-haggai hover:bg-haggai hover:text-white">
                      <Upload className="h-4 w-4 mr-2" />{txt.changeImage}
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="border-haggai text-haggai hover:bg-haggai hover:text-white" data-testid="select-image-btn">
                    <Upload className="h-4 w-4 mr-2" />{txt.selectImage}
                  </Button>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <User className="h-4 w-4" />{txt.fullName}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input required value={formData.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className={isRTL ? 'text-right' : ''} />
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.gender}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)} required>
                    <SelectTrigger className={isRTL ? 'text-right' : ''}><SelectValue placeholder={txt.selectOption} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{txt.male}</SelectItem>
                      <SelectItem value="female">{txt.female}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className="h-4 w-4" />{txt.countryOfResidence}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select value={formData.country_of_residence} onValueChange={(v) => { handleChange('country_of_residence', v); setShowOtherCountry(v === 'other'); }} required>
                    <SelectTrigger className={isRTL ? 'text-right' : ''}><SelectValue placeholder={txt.selectOption} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sweden">{txt.sweden}</SelectItem>
                      <SelectItem value="norway">{txt.norway}</SelectItem>
                      <SelectItem value="denmark">{txt.denmark}</SelectItem>
                      <SelectItem value="germany">{txt.germany}</SelectItem>
                      <SelectItem value="other">{txt.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  {showOtherCountry && <Input className={`mt-2 ${isRTL ? 'text-right' : ''}`} placeholder={txt.specifyOther} value={formData.country_other} onChange={(e) => handleChange('country_other', e.target.value)} required />}
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Globe className="h-4 w-4" />{txt.nationality}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select value={formData.nationality} onValueChange={(v) => { handleChange('nationality', v); setShowOtherNationality(v === 'other'); }} required>
                    <SelectTrigger className={isRTL ? 'text-right' : ''}><SelectValue placeholder={txt.selectOption} /></SelectTrigger>
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
                  {showOtherNationality && <Input className={`mt-2 ${isRTL ? 'text-right' : ''}`} placeholder={txt.specifyOther} value={formData.nationality_other} onChange={(e) => handleChange('nationality_other', e.target.value)} required />}
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Phone className="h-4 w-4" />{txt.phone}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input type="tel" required value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} className={isRTL ? 'text-right' : ''} />
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Mail className="h-4 w-4" />{txt.email}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input type="email" required value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={isRTL ? 'text-right' : ''} />
                </div>

                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Briefcase className="h-4 w-4" />{txt.jobTitle}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input required value={formData.job_title} onChange={(e) => handleChange('job_title', e.target.value)} placeholder={txt.jobPlaceholder} className={isRTL ? 'text-right' : ''} />
                </div>

                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Church className="h-4 w-4" />{txt.churchOrganization}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input required value={formData.church_organization} onChange={(e) => handleChange('church_organization', e.target.value)} placeholder={txt.churchPlaceholder} className={isRTL ? 'text-right' : ''} />
                </div>

                <div className="md:col-span-2">
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.ministryParticipation}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Textarea required value={formData.ministry_participation} onChange={(e) => handleChange('ministry_participation', e.target.value)} placeholder={txt.ministryPlaceholder} className={isRTL ? 'text-right' : ''} rows={3} />
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.maritalStatus}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Select value={formData.marital_status} onValueChange={(v) => handleChange('marital_status', v)} required>
                    <SelectTrigger className={isRTL ? 'text-right' : ''}><SelectValue placeholder={txt.selectOption} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">{txt.single}</SelectItem>
                      <SelectItem value="married">{txt.married}</SelectItem>
                      <SelectItem value="divorced">{txt.divorced}</SelectItem>
                      <SelectItem value="widowed">{txt.widowed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className="h-4 w-4" />{txt.address}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input required value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder={txt.addressPlaceholder} className={isRTL ? 'text-right' : ''} />
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    {txt.age}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input type="text" inputMode="numeric" required value={formData.age} onChange={(e) => handleChange('age', e.target.value)} className={isRTL ? 'text-right' : ''} />
                </div>

                <div>
                  <Label className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Calendar className="h-4 w-4" />{txt.dateOfBirth}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input type="date" required value={formData.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} />
                </div>
              </div>

              {/* Commitments */}
              <div className="border-t pt-6">
                <h3 className={`font-semibold text-stone-800 mb-4 ${isRTL ? 'text-right' : ''}`}>{txt.commitmentTitle}</h3>
                
                <div className="mb-6 p-4 bg-amber-50 rounded-xl">
                  <Label className={`block mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {txt.commitmentAttendance}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="commit_attend" value="yes" checked={formData.commitment_attendance === 'yes'} onChange={(e) => handleChange('commitment_attendance', e.target.value)} required />
                      {txt.yesCommit}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="commit_attend" value="no" checked={formData.commitment_attendance === 'no'} onChange={(e) => handleChange('commitment_attendance', e.target.value)} />
                      {txt.noCommit}
                    </label>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-stone-50 rounded-xl">
                  <Label className={`block mb-3 ${isRTL ? 'text-right' : ''}`}>
                    {txt.commitmentActiveRole}<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="commit_active" value="yes" checked={formData.commitment_active_role === 'yes'} onChange={(e) => handleChange('commitment_active_role', e.target.value)} required />
                      {txt.iCommit}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="commit_active" value="no" checked={formData.commitment_active_role === 'no'} onChange={(e) => handleChange('commitment_active_role', e.target.value)} />
                      {txt.iDoNotCommit}
                    </label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t pt-6">
                <Label className={`mb-2 block ${isRTL ? 'text-right' : ''}`}>{txt.notes}</Label>
                <Textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} className={isRTL ? 'text-right' : ''} rows={4} />
              </div>

              {/* Submit */}
              <Button type="submit" disabled={submitting} className="w-full bg-haggai hover:bg-haggai-dark text-white py-6 text-lg" data-testid="submit-registration-btn">
                {submitting ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />{txt.submitting}</> : txt.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicWorkshopRegistration;
