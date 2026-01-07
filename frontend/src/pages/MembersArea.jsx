import React, { useState, useEffect } from 'react';
import { FileText, Users, Building2, Calendar, Mail, Download, Lock, BookOpen, Clock, GraduationCap, ChevronDown, ChevronUp, User, Phone, Eye, EyeOff, LogIn, Info, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MembersArea = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated, loginMembers, logoutMembers } = useAuth();
  const [isBylawsOpen, setIsBylawsOpen] = useState(false);
  const [showPreviousBoard, setShowPreviousBoard] = useState(false);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [previousBoard, setPreviousBoard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  
  // Members login state
  const [membersPassword, setMembersPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isMembersAuthenticated) {
      fetchBoardMembers();
    }
  }, [isMembersAuthenticated]);

  const fetchBoardMembers = async () => {
    try {
      const [currentRes, archivedRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/board-members?current_only=true`),
        fetch(`${BACKEND_URL}/api/board-members/archive`)
      ]);
      
      if (currentRes.ok) {
        const data = await currentRes.json();
        setCurrentBoard(data);
      }
      if (archivedRes.ok) {
        const data = await archivedRes.json();
        setPreviousBoard(data);
      }
    } catch (error) {
      console.error('Error fetching board members:', error);
    } finally {
      setLoadingBoard(false);
    }
  };

  // Fallback data if no board members in database
  const defaultBoard = [
    { name: 'Bashar', role: language === 'sv' ? 'Ordförande' : language === 'ar' ? 'الرئيس' : 'Chairman' },
    { name: 'Ravi', role: language === 'sv' ? 'Kassör' : language === 'ar' ? 'أمين الصندوق' : 'Treasurer' },
    { name: 'Mazin', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' },
    { name: 'Peter', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' },
    { name: 'Alen', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' }
  ];

  const displayBoard = currentBoard.length > 0 ? currentBoard : defaultBoard;

  const translations = {
    sv: {
      pageTitle: 'Medlemsområde',
      pageSubtitle: 'Exklusivt för Haggai Sweden medlemmar',
      welcome: 'Välkommen till medlemsområdet',
      welcomeDesc: 'Här hittar du information som är exklusiv för våra medlemmar.',
      bylaws: 'Föreningens Stadgar',
      bylawsDesc: 'Läs om föreningens regler och riktlinjer',
      adoptedDate: 'Antagna den 16 april 2025',
      downloadPdf: 'Ladda ner PDF',
      showBylaws: 'Visa stadgar',
      hideBylaws: 'Dölj stadgar',
      knowledgeSupport: 'Kunskapsstöd',
      knowledgeSupportDesc: 'Kärnämnen i våra nationella utbildningar',
      coreSubjects: 'Kärnämnen',
      hours: 'timmar',
      totalHours: 'Totalt',
      currentBoard: 'Nuvarande Styrelse',
      previousBoard: 'Föregående Styrelser',
      showPrevious: 'Visa föregående styrelser',
      hidePrevious: 'Dölj föregående styrelser',
      term: 'Mandatperiod',
      // Members login
      loginTitle: 'Medlemsinloggning',
      loginSubtitle: 'Ange ditt medlemslösenord för att få tillgång',
      password: 'Lösenord',
      passwordPlaceholder: 'Ange medlemslösenord...',
      loginButton: 'Logga in',
      loginError: 'Felaktigt lösenord. Försök igen.',
      contactForAccess: 'Kontakta oss för att få tillgång',
      logout: 'Logga ut från medlemsområdet',
      sections: {
        name: 'Föreningens namn',
        purpose: 'Syfte',
        seat: 'Säte',
        membership: 'Medlemskap och avgifter',
        board: 'Styrelse och organisation',
        annualMeeting: 'Årsmöte',
        economy: 'Ekonomi och revision',
        dissolution: 'Upplösning',
        boardWork: 'Styrelse och dess verksamhet'
      }
    },
    en: {
      pageTitle: 'Members Area',
      pageSubtitle: 'Exclusive for Haggai Sweden members',
      welcome: 'Welcome to the Members Area',
      welcomeDesc: 'Here you will find information exclusive to our members.',
      bylaws: 'Association Bylaws',
      bylawsDesc: 'Read about the association\'s rules and guidelines',
      adoptedDate: 'Adopted on April 16, 2025',
      downloadPdf: 'Download PDF',
      showBylaws: 'Show bylaws',
      hideBylaws: 'Hide bylaws',
      knowledgeSupport: 'Knowledge Support',
      knowledgeSupportDesc: 'Core subjects in our national trainings',
      coreSubjects: 'Core Subjects',
      hours: 'hours',
      totalHours: 'Total',
      currentBoard: 'Current Board',
      previousBoard: 'Previous Boards',
      showPrevious: 'Show previous boards',
      hidePrevious: 'Hide previous boards',
      term: 'Term',
      // Members login
      loginTitle: 'Members Login',
      loginSubtitle: 'Enter your members password to access',
      password: 'Password',
      passwordPlaceholder: 'Enter members password...',
      loginButton: 'Log in',
      loginError: 'Incorrect password. Please try again.',
      contactForAccess: 'Contact us for access',
      logout: 'Log out from members area',
      sections: {
        name: 'Association Name',
        purpose: 'Purpose',
        seat: 'Seat',
        membership: 'Membership and Fees',
        board: 'Board and Organization',
        annualMeeting: 'Annual Meeting',
        economy: 'Economy and Audit',
        dissolution: 'Dissolution',
        boardWork: 'Board and its Activities'
      }
    },
    ar: {
      pageTitle: 'منطقة الأعضاء',
      pageSubtitle: 'حصرياً لأعضاء حجاي السويد',
      welcome: 'مرحباً بكم في منطقة الأعضاء',
      welcomeDesc: 'هنا ستجد معلومات حصرية لأعضائنا.',
      bylaws: 'النظام الأساسي للجمعية',
      bylawsDesc: 'اقرأ عن قواعد وإرشادات الجمعية',
      adoptedDate: 'اعتمدت في 16 أبريل 2025',
      downloadPdf: 'تحميل PDF',
      showBylaws: 'عرض النظام الأساسي',
      hideBylaws: 'إخفاء النظام الأساسي',
      knowledgeSupport: 'دعم المعرفة',
      knowledgeSupportDesc: 'المواضيع الأساسية في تدريباتنا الوطنية',
      coreSubjects: 'المواضيع الأساسية',
      hours: 'ساعات',
      totalHours: 'المجموع',
      // Members login
      loginTitle: 'تسجيل دخول الأعضاء',
      loginSubtitle: 'أدخل كلمة مرور الأعضاء للوصول',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة مرور الأعضاء...',
      loginButton: 'تسجيل الدخول',
      loginError: 'كلمة المرور غير صحيحة. حاول مرة أخرى.',
      contactForAccess: 'اتصل بنا للحصول على الوصول',
      logout: 'تسجيل الخروج من منطقة الأعضاء',
      sections: {
        name: 'اسم الجمعية',
        purpose: 'الغرض',
        seat: 'المقر',
        membership: 'العضوية والرسوم',
        board: 'المجلس والتنظيم',
        annualMeeting: 'الاجتماع السنوي',
        economy: 'الاقتصاد والمراجعة',
        dissolution: 'الحل',
        boardWork: 'المجلس وأنشطته'
      }
    }
  };

  const txt = translations[language] || translations.sv;

  // Core subjects for national trainings
  const coreSubjects = [
    {
      id: 1,
      title: { sv: 'Bibliskt uppdrag', en: 'Biblical Mandate', ar: 'التكليف الكتابي' },
      hours: 3,
      color: 'bg-blue-500',
      description: { 
        sv: 'Grundläggande bibliska principer för ledarskap och tjänande.',
        en: 'Fundamental biblical principles for leadership and service.',
        ar: 'المبادئ الكتابية الأساسية للقيادة والخدمة.'
      }
    },
    {
      id: 2,
      title: { sv: 'Förvaltarskap', en: 'Stewardship', ar: 'الوكالة' },
      hours: 3,
      color: 'bg-emerald-500',
      description: { 
        sv: 'Hur man förvaltar resurser, tid och talanger på ett ansvarigt sätt.',
        en: 'How to manage resources, time and talents responsibly.',
        ar: 'كيفية إدارة الموارد والوقت والمواهب بمسؤولية.'
      }
    },
    {
      id: 3,
      title: { sv: 'Kontext', en: 'Context', ar: 'السياق' },
      hours: 5,
      color: 'bg-purple-500',
      description: { 
        sv: 'Förståelse för kulturella och samhälleliga sammanhang i ledarskap.',
        en: 'Understanding cultural and societal contexts in leadership.',
        ar: 'فهم السياقات الثقافية والاجتماعية في القيادة.'
      }
    },
    {
      id: 4,
      title: { sv: 'Nästa generation', en: 'Next Generation', ar: 'الجيل القادم' },
      hours: 5,
      color: 'bg-orange-500',
      description: { 
        sv: 'Strategier för att utveckla och utrusta framtida ledare.',
        en: 'Strategies for developing and equipping future leaders.',
        ar: 'استراتيجيات تطوير وتجهيز القادة المستقبليين.'
      }
    },
    {
      id: 5,
      title: { sv: 'Ledarskap', en: 'Leadership', ar: 'القيادة' },
      hours: 4,
      color: 'bg-red-500',
      description: { 
        sv: 'Praktiska verktyg och principer för effektivt ledarskap.',
        en: 'Practical tools and principles for effective leadership.',
        ar: 'أدوات ومبادئ عملية للقيادة الفعالة.'
      }
    },
    {
      id: 6,
      title: { sv: 'Målsättning', en: 'Goal Setting', ar: 'وضع الأهداف' },
      hours: 5,
      color: 'bg-teal-500',
      description: { 
        sv: 'Hur man sätter och uppnår meningsfulla mål.',
        en: 'How to set and achieve meaningful goals.',
        ar: 'كيفية وضع وتحقيق أهداف ذات معنى.'
      }
    }
  ];

  const totalHours = coreSubjects.reduce((sum, subject) => sum + subject.hours, 0);

  // Bylaws content
  const bylawsContent = [
    {
      section: '§1',
      title: txt.sections.name,
      content: 'Föreningens namn är Haggai Sweden.'
    },
    {
      section: '§2',
      title: txt.sections.purpose,
      content: `Syftet med föreningen Haggai Sweden är att:
      
• Stärka och utrusta bland annat kristna ledare i Sverige genom utbildning, mentorskap och nätverkande.
• Främja etisk och samhällelig utveckling baserat på kristna värderingar.
• Skapa plattformar för utbildning och samverkan genom kurser, konferenser, digitala resurser och praktiska projekt.
• Stödja medlemmar att leva ut sitt ledarskap i sina lokala sammanhang och bidra till ett mer rättvist och hoppfullt samhälle.
• Samverka med andra organisationer, både nationellt och internationellt, i frågor som rör ledarskap, tro och samhällsengagemang.`
    },
    {
      section: '§3',
      title: txt.sections.seat,
      content: 'Föreningen har sitt säte i Stockholm. Föreningens adress är Modulvägen 6, 141 75 Kungens Kurva.'
    },
    {
      section: '§4',
      title: txt.sections.membership,
      content: `Medlemskap är öppet för alla som delar föreningens syfte. Medlemskap kan förvärvas av personer fyllda 18 år. Medlemmarna erhåller information om föreningens arbete från styrelsen.

En medlem som allvarligt skadar föreningen och dess syften kan avstängas av styrelsen.

Medlemsavgiften är 1200 kr per år. Medlemskap erhålls genom att betala avgiften och godkänna föreningens stadgar.`
    },
    {
      section: '§5',
      title: txt.sections.board,
      content: `Föreningens styrelse består av minst tre personer:
      
• Ordförande: Bashar
• Kassör: Ravi
• Ledamot: Mazin
• Ledamot: Peter
• Ledamot: Alen

Styrelsen ansvarar för föreningens verksamhet, ekonomi och beslut mellan årsmötena.`
    },
    {
      section: '§6',
      title: txt.sections.annualMeeting,
      content: `• Årsmötet hålls årligen och är föreningens högsta beslutande organ.
• Beslut fattas med enkel majoritet om inget annat anges i stadgarna.
• Vid lika röstetal har ordföranden utslagsröst.`
    },
    {
      section: '§7',
      title: txt.sections.economy,
      content: `• Kassören ansvarar för föreningens ekonomi.
• Föreningens ekonomi granskas av en revisor utsedd av årsmötet.`
    },
    {
      section: '§8',
      title: txt.sections.dissolution,
      content: 'Vid upplösning av föreningen ska eventuella tillgångar användas enligt föreningens syfte eller skänkas till en ideell organisation med liknande ändamål.'
    },
    {
      section: '§9',
      title: txt.sections.boardWork,
      content: `Föreningens angelägenheter handhas av en styrelse. Styrelsen är föreningens beredande, planerande och verkställande organ samt beslutsfattare då årsmötet ej är samlat.

Styrelsen består av ordförande, sekreterare och kassör.

Styrelsens mandatperiod är tre år och löper från årsmöte till och med påföljande årsmöte.

Styrelsen skall sammanträda minst 4 gånger per år.

Styrelsen är beslutsmässig när mer än hälften av styrelseledamöterna är närvarande.

Styrelsen har rätt till att adjungera särskilt inbjudna till styrelsemöte.

Styrelsen har rätt till att tillsätta en intern revisor.`
    }
  ];

  // Handle members login
  const handleMembersLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginMembers(membersPassword)) {
      toast.success(txt.pageTitle, {
        description: txt.welcomeDesc
      });
      setMembersPassword('');
    } else {
      setLoginError(txt.loginError);
    }
  };

  // If not authenticated for members area, show login screen
  if (!isMembersAuthenticated) {
    return (
      <div className={`min-h-screen bg-cream-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-haggai rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-stone-800">{txt.loginTitle}</CardTitle>
            <p className="text-stone-500 mt-2">{txt.loginSubtitle}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMembersLogin} className="space-y-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium text-stone-700 ${isRTL ? 'text-right' : ''}`}>
                  {txt.password}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={membersPassword}
                    onChange={(e) => setMembersPassword(e.target.value)}
                    placeholder={txt.passwordPlaceholder}
                    className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-6 text-lg rounded-xl`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-red-500 text-sm text-center">{loginError}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-haggai hover:bg-haggai-dark text-white py-6 text-lg rounded-xl"
              >
                <LogIn className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {txt.loginButton}
              </Button>

              <div className="text-center pt-4 border-t border-stone-200">
                <p className="text-sm text-stone-500">{txt.contactForAccess}</p>
                <a href="mailto:info@haggai.se" className="text-haggai hover:underline text-sm">
                  info@haggai.se
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge className="bg-haggai text-cream-50">
                <Lock className="h-3 w-3 mr-1" />
                {language === 'sv' ? 'Endast medlemmar' : language === 'ar' ? 'الأعضاء فقط' : 'Members only'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={logoutMembers}
                className="text-stone-600 hover:text-stone-800"
              >
                {txt.logout}
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              {txt.pageTitle}
            </h1>
            <p className="text-xl text-haggai font-medium mb-4">
              {txt.pageSubtitle}
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              {txt.welcomeDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Knowledge Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center justify-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <GraduationCap className="h-8 w-8 text-haggai" />
              <h2 className="text-3xl font-bold text-stone-800">{txt.knowledgeSupport}</h2>
            </div>
            <p className="text-lg text-stone-600">{txt.knowledgeSupportDesc}</p>
          </div>

          {/* Core Subjects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {coreSubjects.map((subject) => (
              <Card key={subject.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className={`h-2 ${subject.color}`} />
                <CardContent className="p-6">
                  <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 ${subject.color} rounded-xl flex items-center justify-center`}>
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className="font-bold text-stone-800">{subject.title[language]}</h3>
                        <p className="text-sm text-stone-500">{subject.title.ar}</p>
                      </div>
                    </div>
                    <Badge className="bg-stone-100 text-stone-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {subject.hours} {txt.hours}
                    </Badge>
                  </div>
                  <p className={`text-sm text-stone-600 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                    {subject.description[language]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total Hours Summary */}
          <Card className="border-0 shadow-lg bg-haggai overflow-hidden">
            <CardContent className="p-6">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-white/80 text-sm">{txt.totalHours}</p>
                    <p className="text-3xl font-bold text-white">{totalHours} {txt.hours}</p>
                  </div>
                </div>
                <div className={`text-sm ${isRTL ? 'text-left' : 'text-right'}`}>
                  <p className="text-white/80">6 {txt.coreSubjects}</p>
                  <p className="font-semibold text-white">
                    {language === 'sv' ? 'Fullständig utbildning' : language === 'ar' ? 'التدريب الكامل' : 'Complete training'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bylaws Section - Collapsible */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardHeader 
              className="bg-haggai text-white p-8 cursor-pointer hover:bg-haggai-dark transition-colors"
              onClick={() => setIsBylawsOpen(!isBylawsOpen)}
            >
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <CardTitle className="text-2xl mb-2 text-white">{txt.bylaws}</CardTitle>
                    <p className="text-white/80">{txt.adoptedDate}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-white hover:bg-white/20"
                >
                  {isBylawsOpen ? (
                    <>
                      <span className="mr-2">{txt.hideBylaws}</span>
                      <ChevronUp className="h-6 w-6" />
                    </>
                  ) : (
                    <>
                      <span className="mr-2">{txt.showBylaws}</span>
                      <ChevronDown className="h-6 w-6" />
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {isBylawsOpen && (
              <CardContent className="p-8">
                <div className="space-y-8">
                  {bylawsContent.map((item, index) => (
                    <div key={index} className={`border-b border-stone-100 pb-8 last:border-0 last:pb-0 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <Badge variant="outline" className="bg-haggai-50 text-haggai-dark border-haggai-100 font-bold">
                          {item.section}
                        </Badge>
                        <h3 className="text-xl font-semibold text-stone-800">{item.title}</h3>
                      </div>
                      <div className="text-stone-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-haggai-100">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adoption Notice */}
                <div className={`mt-12 p-6 bg-stone-50 rounded-xl ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-stone-600 font-medium">
                    {language === 'sv' 
                      ? 'Dessa stadgar har antagits vid föreningens konstituerande möte den 16 april 2025.'
                      : language === 'ar'
                      ? 'تم اعتماد هذا النظام الأساسي في الاجتماع التأسيسي للجمعية في 16 أبريل 2025.'
                      : 'These bylaws were adopted at the association\'s constituent meeting on April 16, 2025.'}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Board Members Section - Dynamic from API */}
          <Card className="border-0 shadow-xl mt-8">
            <CardHeader className={isRTL ? 'text-right' : ''}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className="h-6 w-6 text-haggai" />
                  <CardTitle className="text-xl">{txt.currentBoard}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingBoard ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayBoard.map((member, idx) => (
                      <div key={member.id || idx} className={`p-4 bg-stone-50 rounded-xl ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {member.image_url ? (
                            <img 
                              src={member.image_url} 
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-haggai-100 flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-haggai" />
                            </div>
                          )}
                          <div className={isRTL ? 'text-right' : ''}>
                            <p className="font-semibold text-stone-800">{member.name}</p>
                            <p className="text-sm text-haggai">{member.role}</p>
                            {member.term_start && (
                              <p className="text-xs text-stone-500">{txt.term}: {member.term_start} →</p>
                            )}
                          </div>
                        </div>
                        {member.email && (
                          <div className={`flex items-center gap-2 mt-2 text-xs text-stone-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className={`flex items-center gap-2 mt-1 text-xs text-stone-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Previous Boards Accordion */}
                  {previousBoard.length > 0 && (
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowPreviousBoard(!showPreviousBoard)}
                        className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <span>{showPreviousBoard ? txt.hidePrevious : txt.showPrevious}</span>
                        {showPreviousBoard ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      
                      {showPreviousBoard && (
                        <div className="mt-4 p-4 bg-stone-50 rounded-xl">
                          <h4 className={`font-semibold text-stone-700 mb-4 ${isRTL ? 'text-right' : ''}`}>
                            {txt.previousBoard}
                          </h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {previousBoard.map((member) => (
                              <div key={member.id} className={`p-3 bg-white rounded-lg border border-stone-200 ${isRTL ? 'text-right' : ''}`}>
                                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  {member.image_url ? (
                                    <img 
                                      src={member.image_url} 
                                      alt={member.name}
                                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 opacity-75"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                                      <User className="h-5 w-5 text-stone-400" />
                                    </div>
                                  )}
                                  <div className={isRTL ? 'text-right' : ''}>
                                    <p className="font-medium text-stone-700">{member.name}</p>
                                    <p className="text-xs text-stone-500">{member.role}</p>
                                    <p className="text-xs text-stone-400">
                                      {member.term_start} - {member.term_end}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-xl mt-8">
            <CardContent className="p-6">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-haggai-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-haggai" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="font-semibold text-stone-800">Haggai Sweden</p>
                  <p className="text-stone-600">Modulvägen 6, 141 75 Kungens Kurva</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MembersArea;
