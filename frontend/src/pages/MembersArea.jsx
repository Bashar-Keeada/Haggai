import React, { useState, useEffect } from 'react';
import { FileText, Users, Building2, Calendar, Lock, BookOpen, Clock, GraduationCap, ChevronRight, User, Eye, EyeOff, LogIn, X, Heart, Globe, MapPin, UserPlus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import BoardMeetings from '../components/BoardMeetings';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MembersArea = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated, loginMembers, logoutMembers } = useAuth();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [showPreviousBoard, setShowPreviousBoard] = useState(false);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [previousBoard, setPreviousBoard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [workshops, setWorkshops] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [facilitators, setFacilitators] = useState([]);
  const [loadingFacilitators, setLoadingFacilitators] = useState(true);
  
  // Members login state
  const [membersPassword, setMembersPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    if (isMembersAuthenticated) {
      fetchBoardMembers();
      fetchWorkshops();
      fetchFacilitators();
    }
  }, [isMembersAuthenticated]);

  const fetchWorkshops = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/workshops?active_only=true`);
      if (res.ok) {
        const data = await res.json();
        setWorkshops(data);
      }
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
    } finally {
      setLoadingWorkshops(false);
    }
  };

  const fetchFacilitators = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/leader-registrations?status=approved`);
      if (res.ok) {
        const data = await res.json();
        setFacilitators(data);
      }
    } catch (error) {
      console.error('Failed to fetch facilitators:', error);
    } finally {
      setLoadingFacilitators(false);
    }
  };

  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.sv || field.en || '';
  };

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
      pageTitle: 'Kunskapsstöd',
      ourUnity: 'Vår Enhet',
      ourUnityDesc: 'Tillsammans gör vi skillnad',
      unityTitle: 'Var med och förändra Sverige',
      unityText: 'Som medlem i Haggai Sweden har du möjlighet att vara en del av något större än dig själv. Ditt engagemang, din tid och ditt ansvar är avgörande för att vi tillsammans ska kunna göra en positiv påverkan i vårt samhälle.',
      unityCall: 'Ta ansvar. Engagera dig. Ge av din tid. Tillsammans kan vi förändra världen – en ledare i taget.',
      upcomingWorkshops: 'Utbildningar',
      nominateBtn: 'Nominera',
      noWorkshops: 'Inga kommande utbildningar',
      spotsLeft: 'platser',
      facilitatorsTitle: 'Facilitatorer',
      facilitatorsDesc: 'Våra erfarna facilitatorer',
      noFacilitators: 'Inga facilitatorer än',
      haggaiGlobal: 'Haggai International',
      haggaiVision: 'Haggai Internationals vision är att utrusta kristna ledare världen över.',
      bylaws: 'Stadgar',
      adoptedDate: 'Antagna 16 april 2025',
      coreSubjectsTitle: 'Kärnämnen',
      coreSubjectsDesc: '21 timmars utbildning',
      hours: 'timmar',
      currentBoard: 'Styrelse',
      boardMembers: 'Styrelse',
      showPrevious: 'Visa tidigare',
      hidePrevious: 'Dölj tidigare',
      loginTitle: 'Medlemsinloggning',
      loginSubtitle: 'Ange lösenord för tillgång',
      password: 'Lösenord',
      passwordPlaceholder: 'Ange lösenord...',
      loginButton: 'Logga in',
      loginError: 'Felaktigt lösenord',
      contactForAccess: 'Kontakta oss för tillgång',
      logout: 'Logga ut',
      meetings: 'Möten',
      sections: {
        name: 'Föreningens namn',
        purpose: 'Syfte',
        seat: 'Säte',
        membership: 'Medlemskap',
        board: 'Styrelse',
        annualMeeting: 'Årsmöte',
        economy: 'Ekonomi',
        dissolution: 'Upplösning',
        boardWork: 'Styrelsearbete'
      }
    },
    en: {
      pageTitle: 'Knowledge Support',
      ourUnity: 'Our Unity',
      ourUnityDesc: 'Together we make a difference',
      unityTitle: 'Be part of changing Sweden',
      unityText: 'As a member of Haggai Sweden, you have the opportunity to be part of something greater than yourself. Your commitment, your time, and your responsibility are crucial for us to make a positive impact.',
      unityCall: 'Take responsibility. Get involved. Give your time. Together we can change the world – one leader at a time.',
      upcomingWorkshops: 'Trainings',
      nominateBtn: 'Nominate',
      noWorkshops: 'No upcoming trainings',
      spotsLeft: 'spots',
      facilitatorsTitle: 'Facilitators',
      facilitatorsDesc: 'Our experienced facilitators',
      noFacilitators: 'No facilitators yet',
      haggaiGlobal: 'Haggai International',
      haggaiVision: 'Haggai International\'s vision is to equip Christian leaders worldwide.',
      bylaws: 'Bylaws',
      adoptedDate: 'Adopted April 16, 2025',
      coreSubjectsTitle: 'Core Subjects',
      coreSubjectsDesc: '21 hours of training',
      hours: 'hours',
      currentBoard: 'Board',
      boardMembers: 'Board',
      showPrevious: 'Show previous',
      hidePrevious: 'Hide previous',
      loginTitle: 'Members Login',
      loginSubtitle: 'Enter password for access',
      password: 'Password',
      passwordPlaceholder: 'Enter password...',
      loginButton: 'Log in',
      loginError: 'Incorrect password',
      contactForAccess: 'Contact us for access',
      logout: 'Log out',
      meetings: 'Meetings',
      sections: {
        name: 'Association Name',
        purpose: 'Purpose',
        seat: 'Seat',
        membership: 'Membership',
        board: 'Board',
        annualMeeting: 'Annual Meeting',
        economy: 'Economy',
        dissolution: 'Dissolution',
        boardWork: 'Board Work'
      }
    },
    ar: {
      pageTitle: 'دعم المعرفة',
      ourUnity: 'وحدتنا',
      ourUnityDesc: 'معاً نصنع الفرق',
      unityTitle: 'كن جزءاً من التغيير',
      unityText: 'كعضو في حجاي السويد، لديك الفرصة لتكون جزءاً من شيء أكبر منك. التزامك ووقتك ومسؤوليتك ضرورية لكي نتمكن معاً من إحداث تأثير إيجابي.',
      unityCall: 'تحمل المسؤولية. شارك. أعطِ من وقتك. معاً يمكننا تغيير العالم.',
      upcomingWorkshops: 'التدريبات',
      nominateBtn: 'رشح',
      noWorkshops: 'لا توجد تدريبات',
      spotsLeft: 'أماكن',
      facilitatorsTitle: 'الميسرين',
      facilitatorsDesc: 'ميسرونا ذوو الخبرة',
      noFacilitators: 'لم يتم تسجيل ميسرين',
      haggaiGlobal: 'حجاي الدولية',
      haggaiVision: 'رؤية حجاي الدولية هي تجهيز القادة المسيحيين في العالم.',
      bylaws: 'النظام الأساسي',
      adoptedDate: 'اعتمدت في 16 أبريل 2025',
      coreSubjectsTitle: 'المواضيع الأساسية',
      coreSubjectsDesc: '21 ساعة تدريب',
      hours: 'ساعات',
      currentBoard: 'المجلس',
      boardMembers: 'المجلس',
      showPrevious: 'عرض السابق',
      hidePrevious: 'إخفاء السابق',
      loginTitle: 'تسجيل الدخول',
      loginSubtitle: 'أدخل كلمة المرور',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور...',
      loginButton: 'تسجيل الدخول',
      loginError: 'كلمة المرور غير صحيحة',
      contactForAccess: 'اتصل بنا للوصول',
      logout: 'تسجيل الخروج',
      meetings: 'الاجتماعات',
      sections: {
        name: 'اسم الجمعية',
        purpose: 'الغرض',
        seat: 'المقر',
        membership: 'العضوية',
        board: 'المجلس',
        annualMeeting: 'الاجتماع السنوي',
        economy: 'الاقتصاد',
        dissolution: 'الحل',
        boardWork: 'عمل المجلس'
      }
    }
  };

  const txt = translations[language] || translations.sv;

  // Core subjects
  const coreSubjects = [
    { id: 1, title: { sv: 'Bibliskt Mandat', en: 'Biblical Mandate', ar: 'الأساس الكتابي' }, hours: 3, color: 'bg-blue-600', description: { sv: 'Det bibliska mandatet för evangelisation.', en: 'The biblical foundation for evangelism.', ar: 'الأساس الكتابي للكرازة.' }, fullContent: { sv: { overview: 'Förstå Guds plan för evangelisation.', topics: ['Guds natur som sändare', 'Frälsning genom Kristus', 'Den stora missionsbefallningen'], outcome: 'Förstå det bibliska mandatet.' }, en: { overview: 'Understanding God\'s plan for evangelism.', topics: ['God\'s nature as sender', 'Salvation through Christ', 'The Great Commission'], outcome: 'Understand the biblical mandate.' }, ar: { overview: 'فهم خطة الله للكرازة.', topics: ['طبيعة الله كمرسل', 'الخلاص بالمسيح', 'المأمورية العظمى'], outcome: 'فهم الأساس الكتابي.' } } },
    { id: 2, title: { sv: 'Förvaltarskap', en: 'Stewardship', ar: 'الوكالة' }, hours: 3, color: 'bg-green-500', description: { sv: 'Bibliskt förvaltarskap.', en: 'Biblical stewardship.', ar: 'الوكالة الكتابية.' }, fullContent: { sv: { overview: 'Utrusta för förvaltarskap.', topics: ['Lokala resurser', 'Tionde och givande', 'Resursutveckling'], outcome: 'Utveckla lokala resurser.' }, en: { overview: 'Equipping for stewardship.', topics: ['Local resources', 'Tithing and giving', 'Resource development'], outcome: 'Develop local resources.' }, ar: { overview: 'التجهيز للوكالة.', topics: ['الموارد المحلية', 'العشور والعطاء', 'تطوير الموارد'], outcome: 'تطوير الموارد المحلية.' } } },
    { id: 3, title: { sv: 'Kontext', en: 'Context', ar: 'السياق' }, hours: 5, color: 'bg-purple-500', description: { sv: 'Evangeliet i nuvarande sammanhang.', en: 'The Gospel in context.', ar: 'الإنجيل في السياق.' }, fullContent: { sv: { overview: 'Förmedla till majoriteten.', topics: ['Utmaning', 'Islamiska principer', 'Visa kärlek'], outcome: 'Dela evangeliet med olika bakgrunder.' }, en: { overview: 'Reaching the majority.', topics: ['Challenge', 'Islamic principles', 'Show love'], outcome: 'Share the Gospel with different backgrounds.' }, ar: { overview: 'الوصول للأغلبية.', topics: ['التحدي', 'المبادئ الإسلامية', 'إظهار المحبة'], outcome: 'مشاركة الإنجيل مع خلفيات مختلفة.' } } },
    { id: 4, title: { sv: 'Nästa Generation', en: 'Next Generation', ar: 'الجيل القادم' }, hours: 5, color: 'bg-orange-500', description: { sv: 'Förmedla till unga.', en: 'Reaching the youth.', ar: 'الوصول للشباب.' }, fullContent: { sv: { overview: 'Förmedla till unga.', topics: ['Ungdomsvärlden', 'Kommunikation', 'Unga i kyrkan'], outcome: 'Engagera nästa generation.' }, en: { overview: 'Reaching the youth.', topics: ['Youth world', 'Communication', 'Youth in church'], outcome: 'Engage next generation.' }, ar: { overview: 'الوصول للشباب.', topics: ['عالم الشباب', 'التواصل', 'الشباب في الكنيسة'], outcome: 'إشراك الجيل القادم.' } } },
    { id: 5, title: { sv: 'Ledarskap', en: 'Leadership', ar: 'القيادة' }, hours: 4, color: 'bg-red-500', description: { sv: 'Effektivt vittnesbörd i ledarskap.', en: 'Effective witness in leadership.', ar: 'شهادة فعالة في القيادة.' }, fullContent: { sv: { overview: 'Principer för ledarskap.', topics: ['Ledaren enligt Bibeln', 'Roller och ansvar', 'Tjänande ledarskap'], outcome: 'Leda effektivt.' }, en: { overview: 'Leadership principles.', topics: ['Biblical leader', 'Roles and responsibilities', 'Servant leadership'], outcome: 'Lead effectively.' }, ar: { overview: 'مبادئ القيادة.', topics: ['القائد الكتابي', 'الأدوار والمسؤوليات', 'القيادة الخادمة'], outcome: 'قيادة بفعالية.' } } },
    { id: 6, title: { sv: 'Målsättning', en: 'Goal Setting', ar: 'وضع الأهداف' }, hours: 5, color: 'bg-teal-500', description: { sv: 'Sätta och uppnå mål.', en: 'Setting and achieving goals.', ar: 'وضع وتحقيق الأهداف.' }, fullContent: { sv: { overview: 'Målsättning för evangelisation.', topics: ['Guds syfte', 'Personlig uppdragsbeskrivning', 'Skriva mål'], outcome: 'Sätta och nå mål.' }, en: { overview: 'Goal setting for evangelism.', topics: ['God\'s purpose', 'Personal mission', 'Writing goals'], outcome: 'Set and achieve goals.' }, ar: { overview: 'وضع الأهداف للكرازة.', topics: ['قصد الله', 'المهمة الشخصية', 'كتابة الأهداف'], outcome: 'وضع وتحقيق الأهداف.' } } }
  ];

  // Bylaws content
  const bylawsContent = [
    { section: '§1', title: txt.sections.name, content: 'Föreningens namn är Haggai Sweden.' },
    { section: '§2', title: txt.sections.purpose, content: 'Syftet är att stärka och utrusta kristna ledare genom utbildning, mentorskap och nätverkande.' },
    { section: '§3', title: txt.sections.seat, content: 'Föreningen har sitt säte i Stockholm. Adress: Modulvägen 6, 141 75 Kungens Kurva.' },
    { section: '§4', title: txt.sections.membership, content: 'Medlemsavgiften är 1200 kr per år.' },
    { section: '§5', title: txt.sections.board, content: 'Styrelsen består av minst tre personer: Ordförande, Kassör och Ledamöter.' },
    { section: '§6', title: txt.sections.annualMeeting, content: 'Årsmötet hålls årligen och är föreningens högsta beslutande organ.' },
    { section: '§7', title: txt.sections.economy, content: 'Kassören ansvarar för föreningens ekonomi.' },
    { section: '§8', title: txt.sections.dissolution, content: 'Vid upplösning ska tillgångar användas enligt föreningens syfte.' },
    { section: '§9', title: txt.sections.boardWork, content: 'Styrelsen sammanträder minst 4 gånger per år.' }
  ];

  // Handle members login
  const handleMembersLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginMembers(membersPassword)) {
      toast.success(txt.pageTitle);
      setMembersPassword('');
    } else {
      setLoginError(txt.loginError);
    }
  };

  // Login screen
  if (!isMembersAuthenticated) {
    return (
      <div className={`min-h-screen bg-cream-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl text-stone-800">{txt.loginTitle}</CardTitle>
            <p className="text-stone-500 text-sm mt-1">{txt.loginSubtitle}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMembersLogin} className="space-y-3">
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={membersPassword}
                  onChange={(e) => setMembersPassword(e.target.value)}
                  placeholder={txt.passwordPlaceholder}
                  className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-5`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 ${isRTL ? 'left-3' : 'right-3'}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
              <Button type="submit" className="w-full bg-haggai hover:bg-haggai-dark text-white py-5">
                <LogIn className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {txt.loginButton}
              </Button>
              <div className="text-center pt-3 border-t border-stone-200">
                <p className="text-xs text-stone-500">{txt.contactForAccess}</p>
                <a href="tel:+46707825082" className="text-haggai hover:underline text-xs">+46 70 782 50 82</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Compact Header */}
      <section className="pt-16 pb-3 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge className="bg-haggai text-cream-50 text-xs">
                <Lock className="h-3 w-3 mr-1" />
                {language === 'sv' ? 'Medlem' : language === 'ar' ? 'عضو' : 'Member'}
              </Badge>
              <h1 className="text-lg font-semibold text-stone-800">{txt.pageTitle}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={logoutMembers} className="text-stone-600 hover:text-stone-800 text-xs h-8">
              {txt.logout}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact Grid - 6 columns on large screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            
            {/* Vår Enhet */}
            <Card 
              className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${expandedSection === 'unity' ? 'ring-2 ring-rose-500' : ''}`}
              onClick={() => toggleSection('unity')}
              data-testid="unity-card"
            >
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-3 text-center">
                <Heart className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{txt.ourUnity}</p>
              </div>
            </Card>

            {/* Utbildningar */}
            <Card 
              className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${expandedSection === 'workshops' ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => toggleSection('workshops')}
              data-testid="workshops-card"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-center">
                <Calendar className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{txt.upcomingWorkshops}</p>
                <Badge className="bg-white/20 text-white text-[10px] mt-1">{workshops.length}</Badge>
              </div>
            </Card>

            {/* Facilitatorer */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/facilitatorer')}
              data-testid="facilitators-card"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 text-center">
                <Users className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{txt.facilitatorsTitle}</p>
                <Badge className="bg-white/20 text-white text-[10px] mt-1">{facilitators.length}</Badge>
              </div>
            </Card>

            {/* Kärnämnen */}
            <Card 
              className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${expandedSection === 'knowledge' ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => toggleSection('knowledge')}
              data-testid="knowledge-card"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-center">
                <BookOpen className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{txt.coreSubjectsTitle}</p>
                <Badge className="bg-white/20 text-white text-[10px] mt-1">21h</Badge>
              </div>
            </Card>

            {/* Stadgar */}
            <Card 
              className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${expandedSection === 'bylaws' ? 'ring-2 ring-emerald-500' : ''}`}
              onClick={() => toggleSection('bylaws')}
              data-testid="bylaws-card"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 text-center">
                <FileText className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{txt.bylaws}</p>
              </div>
            </Card>

            {/* Styrelse */}
            <Card 
              className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${expandedSection === 'board' ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => toggleSection('board')}
              data-testid="board-card"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 text-center">
                <Building2 className="h-6 w-6 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{txt.boardMembers}</p>
                <Badge className="bg-white/20 text-white text-[10px] mt-1">{displayBoard.length}</Badge>
              </div>
            </Card>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-3">
            
            {/* Unity Content */}
            {expandedSection === 'unity' && (
              <Card className="border-0 shadow-lg animate-in slide-in-from-top-2 duration-200" data-testid="unity-content">
                <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 px-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {txt.ourUnity}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="text-white hover:bg-white/20 h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className={`p-4 bg-rose-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                    <h3 className="text-base font-bold text-rose-800 mb-2">{txt.unityTitle}</h3>
                    <p className="text-stone-700 text-sm leading-relaxed mb-2">{txt.unityText}</p>
                    <p className="text-rose-700 font-medium italic text-sm">"{txt.unityCall}"</p>
                  </div>
                  <div className={`mt-3 p-3 bg-stone-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Globe className="h-4 w-4 text-stone-400" />
                      <span className="text-sm font-medium text-stone-600">{txt.haggaiGlobal}</span>
                    </div>
                    <p className="text-xs text-stone-500">{txt.haggaiVision}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Workshops Content */}
            {expandedSection === 'workshops' && (
              <Card className="border-0 shadow-lg animate-in slide-in-from-top-2 duration-200" data-testid="workshops-content">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {txt.upcomingWorkshops}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="text-white hover:bg-white/20 h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {loadingWorkshops ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : workshops.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {workshops.map(workshop => (
                        <div key={workshop.id} className={`p-3 bg-blue-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                          <h4 className="font-semibold text-stone-800 text-sm">{getLocalizedText(workshop.title)}</h4>
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            {workshop.date && new Date(workshop.date).toLocaleDateString('sv-SE')}
                            {workshop.location && (
                              <>
                                <MapPin className="h-3 w-3 ml-2" />
                                {workshop.location}
                              </>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-xs h-7"
                            onClick={(e) => { e.stopPropagation(); navigate(`/nominera/${workshop.id}`); }}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            {txt.nominateBtn}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-stone-500 text-sm py-4">{txt.noWorkshops}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Knowledge/Core Subjects Content */}
            {expandedSection === 'knowledge' && (
              <Card className="border-0 shadow-lg animate-in slide-in-from-top-2 duration-200" data-testid="knowledge-content">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {txt.coreSubjectsTitle}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="text-white hover:bg-white/20 h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {coreSubjects.map(subject => (
                      <div 
                        key={subject.id} 
                        className={`p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors ${isRTL ? 'text-right' : ''}`}
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 ${subject.color} rounded-lg flex items-center justify-center`}>
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-stone-800 text-sm">{subject.title[language]}</h4>
                            <Badge variant="outline" className="text-[10px]">{subject.hours}h</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{subject.description[language]}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-3 p-3 bg-purple-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">
                        {language === 'sv' ? 'Certifierad Workshop med Diplom' : 'Certified Workshop with Diploma'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bylaws Content */}
            {expandedSection === 'bylaws' && (
              <Card className="border-0 shadow-lg animate-in slide-in-from-top-2 duration-200" data-testid="bylaws-content">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {txt.bylaws}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="text-white hover:bg-white/20 h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {bylawsContent.map((item, idx) => (
                      <div key={idx} className={`p-2 bg-stone-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Badge className="bg-haggai text-white text-xs">{item.section}</Badge>
                          <span className="font-medium text-stone-800 text-xs">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Board Content */}
            {expandedSection === 'board' && (
              <Card className="border-0 shadow-lg animate-in slide-in-from-top-2 duration-200" data-testid="board-content">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 px-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {txt.currentBoard}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSection(null)} className="text-white hover:bg-white/20 h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {loadingBoard ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                      {displayBoard.map((member, idx) => (
                        <div key={member.id || idx} className={`p-2 bg-stone-50 rounded-lg text-center`}>
                          {member.image_url ? (
                            <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover mx-auto mb-1" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-1">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                          <p className="font-medium text-stone-800 text-xs">{member.name}</p>
                          <p className="text-[10px] text-stone-500">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {previousBoard.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreviousBoard(!showPreviousBoard)}
                      className="mt-3 text-xs"
                    >
                      {showPreviousBoard ? txt.hidePrevious : txt.showPrevious}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Meetings Section - Always visible */}
            <Card className="border-0 shadow-lg" data-testid="meetings-section">
              <CardHeader className="bg-gradient-to-r from-stone-600 to-stone-700 text-white py-2 px-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {txt.meetings}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <BoardMeetings />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
          <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
            <DialogHeader>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 ${selectedSubject.color} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <DialogTitle className="text-lg text-stone-800">{selectedSubject.title[language]}</DialogTitle>
                  <Badge variant="outline" className="text-xs mt-1">{selectedSubject.hours} {txt.hours}</Badge>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-sm font-semibold text-stone-800 mb-2">
                  {language === 'sv' ? 'Översikt' : 'Overview'}
                </h3>
                <p className="text-sm text-stone-600">{selectedSubject.fullContent[language].overview}</p>
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-sm font-semibold text-stone-800 mb-2">
                  {language === 'sv' ? 'Ämnen' : 'Topics'}
                </h3>
                <ul className="space-y-1">
                  {selectedSubject.fullContent[language].topics.map((topic, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm text-stone-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-1.5 h-1.5 ${selectedSubject.color} rounded-full mt-1.5`} />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`p-3 bg-haggai-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-sm font-semibold text-haggai-dark mb-1">
                  {language === 'sv' ? 'Lärandemål' : 'Outcome'}
                </h3>
                <p className="text-sm text-haggai-dark">{selectedSubject.fullContent[language].outcome}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MembersArea;
