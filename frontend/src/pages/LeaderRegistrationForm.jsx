import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, CreditCard, Upload, FileText, 
  Plane, Building2, CheckCircle2, AlertCircle, Eye, EyeOff,
  Utensils, MessageSquare, BookOpen, CheckSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LeaderRegistrationForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  
  const [invitation, setInvitation] = useState(null);
  const [workshopTopics, setWorkshopTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bio_sv: '',
    bio_en: '',
    role_sv: '',
    role_en: '',
    topics_sv: '',
    topics_en: '',
    primary_topic: '',
    backup_topics: [],
    cost_preference: 'self',
    arrival_date: '',
    departure_date: '',
    special_dietary: '',
    other_needs: '',
    bank_name: '',
    bank_account: '',
    bank_clearing: '',
    bank_iban: '',
    bank_swift: ''
  });
  
  const [documents, setDocuments] = useState({
    profile_image: null,
    topic_material: [],
    receipt: [],
    travel_ticket: []
  });

  const txt = {
    sv: {
      title: 'Ledarregistrering',
      subtitle: 'Slutför din registrering som ledare hos Haggai Sweden',
      workshopLabel: 'Workshop',
      personalInfo: 'Personuppgifter',
      name: 'Fullständigt namn',
      email: 'E-postadress',
      phone: 'Telefonnummer',
      password: 'Lösenord',
      confirmPassword: 'Bekräfta lösenord',
      passwordHint: 'Minst 6 tecken',
      topicSection: 'Ämnesval',
      topicSectionDesc: 'Välj vilket ämne du ska hålla under workshopen',
      primaryTopic: 'Huvudämne (välj ett)',
      primaryTopicDesc: 'Detta är det ämne du kommer att presentera',
      backupTopics: 'Backup-ämnen',
      backupTopicsDesc: 'Vilka andra ämnen kan du ta om behov uppstår?',
      selectTopic: 'Välj ditt huvudämne',
      profileSection: 'Profil & Bakgrund',
      bioLabel: 'Om dig (Svenska)',
      bioLabelEn: 'Om dig (Engelska)',
      bioPlaceholder: 'Berätta kort om dig själv, din bakgrund och erfarenhet...',
      roleLabel: 'Roll/Titel (Svenska)',
      roleLabelEn: 'Roll/Titel (Engelska)',
      rolePlaceholder: 'T.ex. Pastor, Ledare, Lärare...',
      topicsLabel: 'Expertområden (Svenska)',
      topicsLabelEn: 'Expertområden (Engelska)',
      topicsPlaceholder: 'Separera med komma: Ledarskap, Kommunikation, Vision...',
      travelSection: 'Resa & Logi',
      costPreference: 'Kostnadsval',
      costSelf: 'Jag står själv för resa och logi',
      costHaggai: 'Jag önskar att Haggai bidrar till kostnaden',
      arrivalDate: 'Ankomstdatum',
      departureDate: 'Avresedatum',
      specialDietary: 'Specialkost',
      dietaryPlaceholder: 'T.ex. vegetarisk, allergier...',
      otherNeeds: 'Övriga behov',
      otherNeedsPlaceholder: 'Speciella önskemål eller behov...',
      bankSection: 'Bankuppgifter',
      bankNote: 'För eventuell ersättning av utlägg',
      bankName: 'Bank',
      bankAccount: 'Kontonummer',
      bankClearing: 'Clearingnummer',
      bankIban: 'IBAN (internationellt)',
      bankSwift: 'BIC/SWIFT',
      documentsSection: 'Dokument',
      profileImage: 'Profilbild',
      topicMaterial: 'Material om ditt ämne',
      receipt: 'Kvitton',
      travelTicket: 'Resebiljett',
      uploadFile: 'Ladda upp fil',
      filesSelected: 'filer valda',
      submit: 'Slutför registrering',
      submitting: 'Registrerar...',
      successTitle: 'Tack för din registrering!',
      successMessage: 'Din registrering har tagits emot och väntar på godkännande. Du kommer få ett e-postmeddelande när din registrering har granskats.',
      errorTitle: 'Kunde inte ladda formuläret',
      errorExpired: 'Denna inbjudningslänk har gått ut.',
      errorUsed: 'Denna inbjudan har redan använts.',
      errorNotFound: 'Ogiltig inbjudningslänk.',
      passwordMismatch: 'Lösenorden matchar inte',
      required: 'Obligatoriskt fält'
    },
    en: {
      title: 'Leader Registration',
      subtitle: 'Complete your registration as a leader at Haggai Sweden',
      workshopLabel: 'Workshop',
      personalInfo: 'Personal Information',
      name: 'Full name',
      email: 'Email address',
      phone: 'Phone number',
      password: 'Password',
      confirmPassword: 'Confirm password',
      passwordHint: 'At least 6 characters',
      topicSection: 'Topic Selection',
      topicSectionDesc: 'Choose which topic you will present at the workshop',
      primaryTopic: 'Main Topic (choose one)',
      primaryTopicDesc: 'This is the topic you will present',
      backupTopics: 'Backup Topics',
      backupTopicsDesc: 'Which other topics can you cover if needed?',
      selectTopic: 'Select your main topic',
      profileSection: 'Profile & Background',
      bioLabel: 'About you (Swedish)',
      bioLabelEn: 'About you (English)',
      bioPlaceholder: 'Tell us briefly about yourself, your background and experience...',
      roleLabel: 'Role/Title (Swedish)',
      roleLabelEn: 'Role/Title (English)',
      rolePlaceholder: 'E.g. Pastor, Leader, Teacher...',
      topicsLabel: 'Areas of expertise (Swedish)',
      topicsLabelEn: 'Areas of expertise (English)',
      topicsPlaceholder: 'Separate with comma: Leadership, Communication, Vision...',
      travelSection: 'Travel & Accommodation',
      costPreference: 'Cost preference',
      costSelf: 'I will cover my own travel and accommodation',
      costHaggai: 'I would like Haggai to contribute to the cost',
      arrivalDate: 'Arrival date',
      departureDate: 'Departure date',
      specialDietary: 'Special dietary requirements',
      dietaryPlaceholder: 'E.g. vegetarian, allergies...',
      otherNeeds: 'Other needs',
      otherNeedsPlaceholder: 'Special requests or needs...',
      bankSection: 'Bank Details',
      bankNote: 'For potential expense reimbursement',
      bankName: 'Bank',
      bankAccount: 'Account number',
      bankClearing: 'Clearing number',
      bankIban: 'IBAN (international)',
      bankSwift: 'BIC/SWIFT',
      documentsSection: 'Documents',
      profileImage: 'Profile picture',
      topicMaterial: 'Material about your topic',
      receipt: 'Receipts',
      travelTicket: 'Travel ticket',
      uploadFile: 'Upload file',
      filesSelected: 'files selected',
      submit: 'Complete registration',
      submitting: 'Registering...',
      successTitle: 'Thank you for registering!',
      successMessage: 'Your registration has been received and is awaiting approval. You will receive an email when your registration has been reviewed.',
      errorTitle: 'Could not load the form',
      errorExpired: 'This invitation link has expired.',
      errorUsed: 'This invitation has already been used.',
      errorNotFound: 'Invalid invitation link.',
      passwordMismatch: 'Passwords do not match',
      required: 'Required field'
    },
    ar: {
      title: 'تسجيل القائد',
      subtitle: 'أكمل تسجيلك كقائد في هاجاي السويد',
      workshopLabel: 'ورشة العمل',
      personalInfo: 'المعلومات الشخصية',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      passwordHint: '٦ أحرف على الأقل',
      topicSection: 'اختيار الموضوع',
      topicSectionDesc: 'اختر الموضوع الذي ستقدمه في ورشة العمل',
      primaryTopic: 'الموضوع الرئيسي (اختر واحداً)',
      primaryTopicDesc: 'هذا هو الموضوع الذي ستقدمه',
      backupTopics: 'المواضيع الاحتياطية',
      backupTopicsDesc: 'ما هي المواضيع الأخرى التي يمكنك تقديمها عند الحاجة؟',
      selectTopic: 'اختر موضوعك الرئيسي',
      profileSection: 'الملف الشخصي والخلفية',
      bioLabel: 'نبذة عنك (السويدية)',
      bioLabelEn: 'نبذة عنك (الإنجليزية)',
      bioPlaceholder: 'أخبرنا بإيجاز عن نفسك وخلفيتك وخبرتك...',
      roleLabel: 'الدور/المسمى الوظيفي (السويدية)',
      roleLabelEn: 'الدور/المسمى الوظيفي (الإنجليزية)',
      rolePlaceholder: 'مثال: راعي، قائد، معلم...',
      topicsLabel: 'مجالات الخبرة (السويدية)',
      topicsLabelEn: 'مجالات الخبرة (الإنجليزية)',
      topicsPlaceholder: 'افصل بفاصلة: القيادة، التواصل، الرؤية...',
      travelSection: 'السفر والإقامة',
      costPreference: 'تفضيل التكلفة',
      costSelf: 'سأتحمل تكاليف السفر والإقامة بنفسي',
      costHaggai: 'أرغب في أن تساهم هاجاي في التكلفة',
      arrivalDate: 'تاريخ الوصول',
      departureDate: 'تاريخ المغادرة',
      specialDietary: 'نظام غذائي خاص',
      dietaryPlaceholder: 'مثال: نباتي، حساسية...',
      otherNeeds: 'احتياجات أخرى',
      otherNeedsPlaceholder: 'طلبات أو احتياجات خاصة...',
      bankSection: 'التفاصيل البنكية',
      bankNote: 'لتعويض المصاريف المحتملة',
      bankName: 'البنك',
      bankAccount: 'رقم الحساب',
      bankClearing: 'رقم المقاصة',
      bankIban: 'الآيبان (دولي)',
      bankSwift: 'BIC/SWIFT',
      documentsSection: 'المستندات',
      profileImage: 'صورة الملف الشخصي',
      topicMaterial: 'مواد عن موضوعك',
      receipt: 'الإيصالات',
      travelTicket: 'تذكرة السفر',
      uploadFile: 'رفع ملف',
      filesSelected: 'ملفات مختارة',
      submit: 'إكمال التسجيل',
      submitting: 'جاري التسجيل...',
      successTitle: 'شكراً لتسجيلك!',
      successMessage: 'تم استلام تسجيلك وهو في انتظار الموافقة. ستتلقى بريداً إلكترونياً عند مراجعة تسجيلك.',
      errorTitle: 'تعذر تحميل النموذج',
      errorExpired: 'انتهت صلاحية رابط الدعوة هذا.',
      errorUsed: 'تم استخدام هذه الدعوة بالفعل.',
      errorNotFound: 'رابط دعوة غير صالح.',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      required: 'حقل مطلوب',
      selected: 'مختار',
      backupSelected: 'موضوع احتياطي مختار'
    }
  }[language] || {};

  useEffect(() => {
    fetchInvitation();
    fetchWorkshopTopics();
  }, [token]);

  const fetchWorkshopTopics = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshop-topics`);
      if (response.ok) {
        const data = await response.json();
        setWorkshopTopics(data);
      }
    } catch (err) {
      console.error('Error fetching workshop topics:', err);
    }
  };

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-invitations/${token}`);
      if (response.ok) {
        const data = await response.json();
        setInvitation(data);
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || ''
        }));
      } else if (response.status === 410) {
        setError('expired');
      } else if (response.status === 400) {
        setError('used');
      } else {
        setError('not_found');
      }
    } catch (err) {
      console.error('Error fetching invitation:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBackupTopicToggle = (topicId) => {
    setFormData(prev => {
      const currentBackups = prev.backup_topics || [];
      if (currentBackups.includes(topicId)) {
        return { ...prev, backup_topics: currentBackups.filter(t => t !== topicId) };
      } else {
        return { ...prev, backup_topics: [...currentBackups, topicId] };
      }
    });
  };

  const handleFileChange = async (type, files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const processedFiles = [];
    
    for (const file of fileArray) {
      const reader = new FileReader();
      const fileData = await new Promise((resolve) => {
        reader.onload = (e) => resolve({
          name: file.name,
          data: e.target.result.split(',')[1], // Get base64 without prefix
          type: file.type
        });
        reader.readAsDataURL(file);
      });
      processedFiles.push(fileData);
    }
    
    if (type === 'profile_image') {
      setDocuments(prev => ({ ...prev, [type]: processedFiles[0] }));
    } else {
      setDocuments(prev => ({ 
        ...prev, 
        [type]: [...prev[type], ...processedFiles]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      toast.error(txt.required);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(txt.passwordMismatch);
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error(txt.passwordHint);
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare data
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        bio_sv: formData.bio_sv,
        bio_en: formData.bio_en,
        role_sv: formData.role_sv,
        role_en: formData.role_en,
        topics_sv: formData.topics_sv ? formData.topics_sv.split(',').map(t => t.trim()).filter(Boolean) : [],
        topics_en: formData.topics_en ? formData.topics_en.split(',').map(t => t.trim()).filter(Boolean) : [],
        primary_topic: formData.primary_topic,
        backup_topics: formData.backup_topics,
        cost_preference: formData.cost_preference,
        arrival_date: formData.arrival_date,
        departure_date: formData.departure_date,
        special_dietary: formData.special_dietary,
        other_needs: formData.other_needs,
        bank_name: formData.bank_name,
        bank_account: formData.bank_account,
        bank_clearing: formData.bank_clearing,
        bank_iban: formData.bank_iban,
        bank_swift: formData.bank_swift
      };
      
      const response = await fetch(`${BACKEND_URL}/api/leaders/register/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Upload documents if any - need to login first to get token
        // For now, documents can be uploaded after approval via leader portal
        
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(error.message || 'Kunde inte slutföra registreringen');
    } finally {
      setSubmitting(false);
    }
  };

  // Get topic name based on language
  const getTopicName = (topic) => {
    if (language === 'ar') return topic.name_ar || topic.name_en;
    if (language === 'en') return topic.name_en;
    return topic.name_sv;
  };

  // Get topic description based on language
  const getTopicDescription = (topic) => {
    if (language === 'ar') return topic.description_ar || topic.description_en;
    if (language === 'en') return topic.description_en;
    return topic.description_sv;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    const errorMessages = {
      expired: txt.errorExpired,
      used: txt.errorUsed,
      not_found: txt.errorNotFound,
      error: txt.errorTitle
    };
    
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.errorTitle}</h1>
          <p className="text-stone-600">{errorMessages[error]}</p>
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
          <h1 className="text-3xl font-bold text-stone-800 mb-4">{txt.successTitle}</h1>
          <p className="text-stone-600 mb-8">{txt.successMessage}</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-haggai hover:bg-haggai-dark"
          >
            Tillbaka till startsidan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-10" style={{background: 'linear-gradient(135deg, #014D73 0%, #012d44 100%)'}}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge className="bg-white/20 text-white mb-4 border-white/30">
            <User className="h-4 w-4 mr-1" />
            {txt.title}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{txt.title}</h1>
          <p className="text-white/80">{txt.subtitle}</p>
          
          {invitation?.workshop_title && (
            <div className="mt-4 bg-white/10 rounded-lg px-4 py-2 inline-block">
              <span className="text-white/70">{txt.workshopLabel}: </span>
              <span className="font-semibold">{invitation.workshop_title}</span>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haggai">
                <User className="h-5 w-5" />
                {txt.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.name} *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    data-testid="leader-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.email} *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    data-testid="leader-email-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{txt.phone}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+46 70 123 45 67"
                  data-testid="leader-phone-input"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.password} *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                      minLength={6}
                      data-testid="leader-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-stone-500">{txt.passwordHint}</p>
                </div>
                <div className="space-y-2">
                  <Label>{txt.confirmPassword} *</Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    data-testid="leader-confirm-password-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Selection */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haggai">
                <BookOpen className="h-5 w-5" />
                {txt.topicSection}
              </CardTitle>
              <p className="text-sm text-stone-500">{txt.topicSectionDesc}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Topic */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{txt.primaryTopic} *</Label>
                <p className="text-sm text-stone-500">{txt.primaryTopicDesc}</p>
                <div className="grid gap-3">
                  {workshopTopics.map((topic) => (
                    <label 
                      key={topic.id}
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.primary_topic === topic.id 
                          ? 'border-haggai bg-haggai/5 shadow-sm' 
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="primary_topic"
                        value={topic.id}
                        checked={formData.primary_topic === topic.id}
                        onChange={(e) => handleChange('primary_topic', e.target.value)}
                        className="mt-1 h-5 w-5 text-haggai"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800">{getTopicName(topic)}</span>
                          {topic.hours && (
                            <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
                              {topic.hours}h
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mt-1">
                          {language === 'en' ? (topic.description_en || topic.description_sv) : topic.description_sv}
                        </p>
                      </div>
                      {formData.primary_topic === topic.id && (
                        <Badge className="bg-haggai text-white">Valt</Badge>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Backup Topics */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base font-semibold">{txt.backupTopics}</Label>
                <p className="text-sm text-stone-500">{txt.backupTopicsDesc}</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {workshopTopics
                    .filter(topic => topic.id !== formData.primary_topic)
                    .map((topic) => (
                      <label 
                        key={topic.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.backup_topics?.includes(topic.id)
                            ? 'border-emerald-400 bg-emerald-50'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <Checkbox
                          checked={formData.backup_topics?.includes(topic.id)}
                          onCheckedChange={() => handleBackupTopicToggle(topic.id)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <span className="font-medium text-stone-700">{getTopicName(topic)}</span>
                        {topic.hours && (
                          <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full ml-auto mr-2">
                            {topic.hours}h
                          </span>
                        )}
                        {formData.backup_topics?.includes(topic.id) && (
                          <CheckSquare className="h-4 w-4 text-emerald-500" />
                        )}
                      </label>
                    ))}
                </div>
                {formData.backup_topics?.length > 0 && (
                  <p className="text-sm text-emerald-600">
                    ✓ {formData.backup_topics.length} backup-ämne{formData.backup_topics.length > 1 ? 'n' : ''} valt
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haggai">
                <FileText className="h-5 w-5" />
                {txt.profileSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.roleLabel}</Label>
                  <Input
                    value={formData.role_sv}
                    onChange={(e) => handleChange('role_sv', e.target.value)}
                    placeholder={txt.rolePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.roleLabelEn}</Label>
                  <Input
                    value={formData.role_en}
                    onChange={(e) => handleChange('role_en', e.target.value)}
                    placeholder={txt.rolePlaceholder}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{txt.bioLabel}</Label>
                <Textarea
                  value={formData.bio_sv}
                  onChange={(e) => handleChange('bio_sv', e.target.value)}
                  placeholder={txt.bioPlaceholder}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{txt.bioLabelEn}</Label>
                <Textarea
                  value={formData.bio_en}
                  onChange={(e) => handleChange('bio_en', e.target.value)}
                  placeholder={txt.bioPlaceholder}
                  rows={3}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.topicsLabel}</Label>
                  <Input
                    value={formData.topics_sv}
                    onChange={(e) => handleChange('topics_sv', e.target.value)}
                    placeholder={txt.topicsPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.topicsLabelEn}</Label>
                  <Input
                    value={formData.topics_en}
                    onChange={(e) => handleChange('topics_en', e.target.value)}
                    placeholder={txt.topicsPlaceholder}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel & Cost */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haggai">
                <Plane className="h-5 w-5" />
                {txt.travelSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>{txt.costPreference}</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                    <input
                      type="radio"
                      name="cost_preference"
                      value="self"
                      checked={formData.cost_preference === 'self'}
                      onChange={(e) => handleChange('cost_preference', e.target.value)}
                      className="text-haggai"
                    />
                    <span>{txt.costSelf}</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                    <input
                      type="radio"
                      name="cost_preference"
                      value="haggai_support"
                      checked={formData.cost_preference === 'haggai_support'}
                      onChange={(e) => handleChange('cost_preference', e.target.value)}
                      className="text-haggai"
                    />
                    <span>{txt.costHaggai}</span>
                  </label>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.arrivalDate}</Label>
                  <Input
                    type="date"
                    value={formData.arrival_date}
                    onChange={(e) => handleChange('arrival_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.departureDate}</Label>
                  <Input
                    type="date"
                    value={formData.departure_date}
                    onChange={(e) => handleChange('departure_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Utensils className="h-4 w-4" />
                    {txt.specialDietary}
                  </Label>
                  <Input
                    value={formData.special_dietary}
                    onChange={(e) => handleChange('special_dietary', e.target.value)}
                    placeholder={txt.dietaryPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {txt.otherNeeds}
                  </Label>
                  <Input
                    value={formData.other_needs}
                    onChange={(e) => handleChange('other_needs', e.target.value)}
                    placeholder={txt.otherNeedsPlaceholder}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-haggai">
                <CreditCard className="h-5 w-5" />
                {txt.bankSection}
              </CardTitle>
              <p className="text-sm text-stone-500">{txt.bankNote}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.bankName}</Label>
                  <Input
                    value={formData.bank_name}
                    onChange={(e) => handleChange('bank_name', e.target.value)}
                    placeholder="T.ex. Nordea, Swedbank..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.bankClearing}</Label>
                  <Input
                    value={formData.bank_clearing}
                    onChange={(e) => handleChange('bank_clearing', e.target.value)}
                    placeholder="XXXX"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{txt.bankAccount}</Label>
                <Input
                  value={formData.bank_account}
                  onChange={(e) => handleChange('bank_account', e.target.value)}
                  placeholder="XXXXXXX"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.bankIban}</Label>
                  <Input
                    value={formData.bank_iban}
                    onChange={(e) => handleChange('bank_iban', e.target.value)}
                    placeholder="SE..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.bankSwift}</Label>
                  <Input
                    value={formData.bank_swift}
                    onChange={(e) => handleChange('bank_swift', e.target.value)}
                    placeholder="XXXSESS"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 bg-haggai hover:bg-haggai-dark text-white text-lg"
            data-testid="leader-registration-submit"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {txt.submitting}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
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

export default LeaderRegistrationForm;
