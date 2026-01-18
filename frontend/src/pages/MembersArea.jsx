import React, { useState, useEffect } from 'react';
import { FileText, Users, Building2, Calendar, Mail, Download, Lock, BookOpen, Clock, GraduationCap, ChevronDown, ChevronUp, User, Phone, Eye, EyeOff, LogIn, Info, X, Briefcase, Heart, Globe, MapPin, UserPlus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
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
  const [openSections, setOpenSections] = useState({
    unity: true,
    workshops: false,
    bylaws: false,
    knowledge: false,
    board: false,
    meetings: false
  });
  const [showPreviousBoard, setShowPreviousBoard] = useState(false);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [previousBoard, setPreviousBoard] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [workshops, setWorkshops] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  
  // Members login state
  const [membersPassword, setMembersPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (isMembersAuthenticated) {
      fetchBoardMembers();
      fetchWorkshops();
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
      pageTitle: 'Kunskapsstöd',
      pageSubtitle: 'Exklusivt för Haggai Sweden medlemmar',
      welcome: 'Välkommen till kunskapsstöd',
      welcomeDesc: 'Här hittar du information som är exklusiv för våra medlemmar.',
      // Our Unity section
      ourUnity: 'Vår Enhet',
      ourUnityDesc: 'Tillsammans gör vi skillnad i Sverige',
      unityTitle: 'Var med och förändra Sverige',
      unityText: 'Som medlem i Haggai Sweden har du möjlighet att vara en del av något större än dig själv. Ditt engagemang, din tid och ditt ansvar är avgörande för att vi tillsammans ska kunna göra en positiv påverkan i vårt samhälle. Varje ledarskapsutbildning, varje mentorsrelation och varje steg vi tar tillsammans bidrar till att bygga ett starkare Sverige – och i förlängningen en bättre värld.',
      unityCall: 'Ta ansvar. Engagera dig. Ge av din tid. Tillsammans kan vi förändra världen – en ledare i taget.',
      // Workshops section
      upcomingWorkshops: 'Kommande Utbildningar',
      upcomingWorkshopsDesc: 'Se planerade workshops och nominera deltagare',
      nominateBtn: 'Nominera någon',
      viewCalendar: 'Se hela kalendern',
      noWorkshops: 'Inga kommande utbildningar just nu',
      spotsLeft: 'platser kvar',
      // Haggai global
      haggaiGlobal: 'Haggai International',
      haggaiGlobalDesc: 'Vår globala vision',
      haggaiVision: 'Haggai Internationals vision är att utrusta kristna ledare världen över att göra lärjungar av alla folk.',
      haggaiMission: 'Genom att utbilda ledare som multiplicerar sig själva, strävar vi efter att nå varje nation med evangeliet.',
      // Rest of translations
      bylaws: 'Föreningens Stadgar',
      bylawsDesc: 'Läs om föreningens regler och riktlinjer',
      adoptedDate: 'Antagna den 16 april 2025',
      downloadPdf: 'Ladda ner PDF',
      showBylaws: 'Visa stadgar',
      hideBylaws: 'Dölj stadgar',
      coreSubjectsTitle: 'Kärnämnen',
      coreSubjectsDesc: 'Kärnämnen i våra nationella utbildningar',
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
      logout: 'Logga ut från kunskapsstöd',
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
      pageTitle: 'Knowledge Support',
      pageSubtitle: 'Exclusive for Haggai Sweden members',
      welcome: 'Welcome to the Knowledge Support',
      welcomeDesc: 'Here you will find information exclusive to our members.',
      // Our Unity section
      ourUnity: 'Our Unity',
      ourUnityDesc: 'Together we make a difference in Sweden',
      unityTitle: 'Be part of changing Sweden',
      unityText: 'As a member of Haggai Sweden, you have the opportunity to be part of something greater than yourself. Your commitment, your time, and your responsibility are crucial for us to make a positive impact on our society together. Every leadership training, every mentoring relationship, and every step we take together contributes to building a stronger Sweden – and ultimately a better world.',
      unityCall: 'Take responsibility. Get involved. Give your time. Together we can change the world – one leader at a time.',
      // Workshops section
      upcomingWorkshops: 'Upcoming Trainings',
      upcomingWorkshopsDesc: 'View planned workshops and nominate participants',
      nominateBtn: 'Nominate someone',
      viewCalendar: 'View full calendar',
      noWorkshops: 'No upcoming trainings at the moment',
      spotsLeft: 'spots left',
      // Haggai global
      haggaiGlobal: 'Haggai International',
      haggaiGlobalDesc: 'Our global vision',
      haggaiVision: 'Haggai International\'s vision is to equip Christian leaders worldwide to make disciples of all nations.',
      haggaiMission: 'By training leaders who multiply themselves, we strive to reach every nation with the Gospel.',
      // Rest of translations
      bylaws: 'Association Bylaws',
      bylawsDesc: 'Read about the association\'s rules and guidelines',
      adoptedDate: 'Adopted on April 16, 2025',
      downloadPdf: 'Download PDF',
      showBylaws: 'Show bylaws',
      hideBylaws: 'Hide bylaws',
      coreSubjectsTitle: 'Core Subjects',
      coreSubjectsDesc: 'Core subjects in our national trainings',
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
      logout: 'Log out from knowledge support',
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
      pageTitle: 'دعم المعرفة',
      pageSubtitle: 'حصرياً لأعضاء حجاي السويد',
      welcome: 'مرحباً بكم في دعم المعرفة',
      welcomeDesc: 'هنا ستجد معلومات حصرية لأعضائنا.',
      bylaws: 'النظام الأساسي للجمعية',
      bylawsDesc: 'اقرأ عن قواعد وإرشادات الجمعية',
      adoptedDate: 'اعتمدت في 16 أبريل 2025',
      downloadPdf: 'تحميل PDF',
      showBylaws: 'عرض النظام الأساسي',
      hideBylaws: 'إخفاء النظام الأساسي',
      coreSubjectsTitle: 'المواضيع الأساسية',
      coreSubjectsDesc: 'المواضيع الأساسية في تدريباتنا الوطنية',
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
      logout: 'تسجيل الخروج من دعم المعرفة',
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

  // Core subjects for national trainings - Certified workshop with diploma
  const coreSubjects = [
    {
      id: 2,
      title: { sv: 'Förvaltarskap', en: 'Stewardship', ar: 'الإشراف' },
      hours: 4,
      color: 'bg-green-500',
      description: { 
        sv: 'Hur man förvaltar resurser, tid och talanger på ett ansvarigt sätt.',
        en: 'How to manage resources, time and talents responsibly.',
        ar: 'كيفية إدارة الموارد والوقت والمواهب بمسؤولية.'
      },
      fullContent: {
        sv: {
          overview: 'Förvaltarskap innebär att ansvarsfullt hantera de resurser Gud har gett oss.',
          topics: [
            'Bibliska principer för förvaltarskap',
            'Ekonomisk planering och budget',
            'Tidshantering för ledare',
            'Att utveckla och använda sina gåvor',
            'Miljöansvar och hållbarhet'
          ],
          outcome: 'Du kommer att kunna tillämpa förvaltarskapsprinciper i ditt dagliga liv och ledarskap.'
        },
        en: {
          overview: 'Stewardship means responsibly managing the resources God has given us.',
          topics: [
            'Biblical principles of stewardship',
            'Financial planning and budgeting',
            'Time management for leaders',
            'Developing and using your gifts',
            'Environmental responsibility and sustainability'
          ],
          outcome: 'You will be able to apply stewardship principles in your daily life and leadership.'
        },
        ar: {
          overview: 'الإشراف يعني إدارة الموارد التي أعطانا الله إياها بمسؤولية.',
          topics: [
            'المبادئ الكتابية للإشراف',
            'التخطيط المالي والميزانية',
            'إدارة الوقت للقادة',
            'تطوير واستخدام مواهبك',
            'المسؤولية البيئية والاستدامة'
          ],
          outcome: 'ستكون قادرًا على تطبيق مبادئ الإشراف في حياتك اليومية وقيادتك.'
        }
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
      },
      fullContent: {
        sv: {
          overview: 'Att förstå kontext är avgörande för effektivt ledarskap i en mångkulturell värld.',
          topics: [
            'Kulturell intelligens och anpassning',
            'Analysera lokala och globala sammanhang',
            'Leda i multikulturella miljöer',
            'Sociala och politiska utmaningar',
            'Kontextualisering av evangeliet'
          ],
          outcome: 'Du kommer att utveckla förmågan att anpassa ditt ledarskap till olika kulturella sammanhang.'
        },
        en: {
          overview: 'Understanding context is crucial for effective leadership in a multicultural world.',
          topics: [
            'Cultural intelligence and adaptation',
            'Analyzing local and global contexts',
            'Leading in multicultural environments',
            'Social and political challenges',
            'Contextualization of the Gospel'
          ],
          outcome: 'You will develop the ability to adapt your leadership to different cultural contexts.'
        },
        ar: {
          overview: 'فهم السياق أمر حاسم للقيادة الفعالة في عالم متعدد الثقافات.',
          topics: [
            'الذكاء الثقافي والتكيف',
            'تحليل السياقات المحلية والعالمية',
            'القيادة في البيئات متعددة الثقافات',
            'التحديات الاجتماعية والسياسية',
            'تكييف الإنجيل للسياق'
          ],
          outcome: 'ستطور القدرة على تكييف قيادتك مع السياقات الثقافية المختلفة.'
        }
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
      },
      fullContent: {
        sv: {
          overview: 'Att investera i nästa generation är nyckeln till långsiktig framgång.',
          topics: [
            'Mentorskap och coaching',
            'Identifiera och utveckla talanger',
            'Skapa ledarutvecklingsprogram',
            'Generationsöverskridande ledarskap',
            'Succession och övergångsplanering'
          ],
          outcome: 'Du kommer att kunna bygga system för att utveckla framtida ledare i din organisation.'
        },
        en: {
          overview: 'Investing in the next generation is key to long-term success.',
          topics: [
            'Mentorship and coaching',
            'Identifying and developing talents',
            'Creating leadership development programs',
            'Cross-generational leadership',
            'Succession and transition planning'
          ],
          outcome: 'You will be able to build systems for developing future leaders in your organization.'
        },
        ar: {
          overview: 'الاستثمار في الجيل القادم هو مفتاح النجاح على المدى الطويل.',
          topics: [
            'التوجيه والتدريب',
            'تحديد وتطوير المواهب',
            'إنشاء برامج تطوير القيادة',
            'القيادة عبر الأجيال',
            'التخطيط للخلافة والانتقال'
          ],
          outcome: 'ستكون قادرًا على بناء أنظمة لتطوير القادة المستقبليين في منظمتك.'
        }
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
      },
      fullContent: {
        sv: {
          overview: 'Ledarskap handlar om att påverka och inspirera andra mot gemensamma mål.',
          topics: [
            'Ledarskapsstilar och deras tillämpning',
            'Beslutsfattande under osäkerhet',
            'Kommunikation och vision',
            'Teambyggande och delegering',
            'Konflikthantering och problemlösning'
          ],
          outcome: 'Du kommer att ha en verktygslåda för att leda effektivt i olika situationer.'
        },
        en: {
          overview: 'Leadership is about influencing and inspiring others toward common goals.',
          topics: [
            'Leadership styles and their application',
            'Decision-making under uncertainty',
            'Communication and vision',
            'Team building and delegation',
            'Conflict management and problem-solving'
          ],
          outcome: 'You will have a toolbox for leading effectively in different situations.'
        },
        ar: {
          overview: 'القيادة تتعلق بالتأثير على الآخرين وإلهامهم نحو أهداف مشتركة.',
          topics: [
            'أنماط القيادة وتطبيقها',
            'اتخاذ القرارات في ظل عدم اليقين',
            'التواصل والرؤية',
            'بناء الفريق والتفويض',
            'إدارة الصراعات وحل المشكلات'
          ],
          outcome: 'ستكون لديك مجموعة أدوات للقيادة بفعالية في مواقف مختلفة.'
        }
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
      },
      fullContent: {
        sv: {
          overview: 'Effektiv målsättning är grunden för personlig och organisatorisk tillväxt.',
          topics: [
            'SMART-mål och andra ramverk',
            'Visionsutveckling och strategisk planering',
            'Mätning och uppföljning av framsteg',
            'Övervinna hinder och motgångar',
            'Fira framgångar och lära av misslyckanden'
          ],
          outcome: 'Du kommer att kunna sätta och nå mål som driver verklig förändring.'
        },
        en: {
          overview: 'Effective goal setting is the foundation for personal and organizational growth.',
          topics: [
            'SMART goals and other frameworks',
            'Vision development and strategic planning',
            'Measuring and tracking progress',
            'Overcoming obstacles and setbacks',
            'Celebrating successes and learning from failures'
          ],
          outcome: 'You will be able to set and achieve goals that drive real change.'
        },
        ar: {
          overview: 'وضع الأهداف الفعال هو أساس النمو الشخصي والتنظيمي.',
          topics: [
            'أهداف SMART وأطر أخرى',
            'تطوير الرؤية والتخطيط الاستراتيجي',
            'قياس ومتابعة التقدم',
            'التغلب على العقبات والانتكاسات',
            'الاحتفال بالنجاحات والتعلم من الإخفاقات'
          ],
          outcome: 'ستكون قادرًا على وضع وتحقيق أهداف تدفع التغيير الحقيقي.'
        }
      }
    }
  ];

  // Total hours fixed at 21
  const totalHours = 21;

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
                <a href="tel:+46707825082" className="text-haggai hover:underline text-sm">
                  +46 70 782 50 82
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

      {/* Categorized Sections */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Section 1: Core Subjects (Kärnämnen) */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <Collapsible open={openSections.knowledge} onOpenChange={() => toggleSection('knowledge')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-all">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <CardTitle className="text-xl text-white">{txt.coreSubjectsTitle}</CardTitle>
                        <p className="text-white/80 text-sm">{txt.coreSubjectsDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white">{totalHours} {txt.hours}</Badge>
                      {openSections.knowledge ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {coreSubjects.map((subject) => (
                      <div 
                        key={subject.id} 
                        className="p-4 bg-stone-50 rounded-xl hover:bg-stone-100 cursor-pointer transition-colors group"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <h4 className="font-semibold text-stone-800">{subject.title[language]}</h4>
                              <Badge variant="outline" className="text-xs">{subject.hours}h</Badge>
                            </div>
                            <p className="text-sm text-stone-500 mt-1">{subject.description[language]}</p>
                            <p className="text-xs text-haggai mt-2 group-hover:underline">
                              {language === 'sv' ? 'Klicka för mer info →' : 'Click for more →'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Certification notice */}
                  <div className={`mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800">
                          {language === 'sv' ? 'Certifierad Workshop med Diplom' : language === 'ar' ? 'ورشة عمل معتمدة مع شهادة' : 'Certified Workshop with Diploma'}
                        </p>
                        <p className="text-sm text-emerald-600">
                          {language === 'sv' 
                            ? 'Efter genomförd utbildning erhåller du ett officiellt diplom från Haggai International.' 
                            : language === 'ar'
                            ? 'بعد إتمام التدريب، ستحصل على شهادة رسمية من حجاي الدولية.'
                            : 'Upon completion, you will receive an official diploma from Haggai International.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Section 2: Bylaws */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <Collapsible open={openSections.bylaws} onOpenChange={() => toggleSection('bylaws')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white cursor-pointer hover:from-teal-700 hover:to-teal-800 transition-all">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <CardTitle className="text-xl text-white">{txt.bylaws}</CardTitle>
                        <p className="text-white/80 text-sm">{txt.adoptedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white">9 §</Badge>
                      {openSections.bylaws ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {bylawsContent.map((item, index) => (
                      <div key={index} className={`p-4 bg-stone-50 rounded-xl ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <Badge className="bg-haggai text-white">{item.section}</Badge>
                          <h4 className="font-semibold text-stone-800">{item.title}</h4>
                        </div>
                        <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-6 p-4 bg-haggai-50 rounded-xl ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm text-haggai-dark font-medium">
                      {language === 'sv' 
                        ? 'Dessa stadgar har antagits vid föreningens konstituerande möte den 16 april 2025.'
                        : 'These bylaws were adopted at the association\'s constituent meeting on April 16, 2025.'}
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Section 3: Board Members */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <Collapsible open={openSections.board} onOpenChange={() => toggleSection('board')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-violet-500 to-violet-600 text-white cursor-pointer hover:from-violet-600 hover:to-violet-700 transition-all">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <CardTitle className="text-xl text-white">{txt.currentBoard}</CardTitle>
                        <p className="text-white/80 text-sm">{language === 'sv' ? 'Nuvarande styrelsemedlemmar' : 'Current board members'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white">{displayBoard.length} {language === 'sv' ? 'ledamöter' : 'members'}</Badge>
                      {openSections.board ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-6">
                  {loadingBoard ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
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
                                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                  <User className="h-6 w-6 text-violet-600" />
                                </div>
                              )}
                              <div className={isRTL ? 'text-right' : ''}>
                                <p className="font-semibold text-stone-800">{member.name}</p>
                                <p className="text-sm text-violet-600">{member.role}</p>
                                {member.term_start && (
                                  <p className="text-xs text-stone-500">{txt.term}: {member.term_start} →</p>
                                )}
                              </div>
                            </div>
                            {member.email && (
                              <div className={`flex items-center gap-2 mt-3 text-xs text-stone-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
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

                      {previousBoard.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-stone-200">
                          <Button
                            variant="outline"
                            onClick={() => setShowPreviousBoard(!showPreviousBoard)}
                            className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <span>{showPreviousBoard ? txt.hidePrevious : txt.showPrevious}</span>
                            {showPreviousBoard ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          
                          {showPreviousBoard && (
                            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {previousBoard.map((member) => (
                                <div key={member.id} className={`p-3 bg-stone-100 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                                      <User className="h-5 w-5 text-stone-400" />
                                    </div>
                                    <div className={isRTL ? 'text-right' : ''}>
                                      <p className="font-medium text-stone-700">{member.name}</p>
                                      <p className="text-xs text-stone-500">{member.role}</p>
                                      <p className="text-xs text-stone-400">{member.term_start} - {member.term_end}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Section 4: Board Meetings */}
          {/* Section 4: Board Work (Styrelsearbete) */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <Collapsible open={openSections.meetings} onOpenChange={() => toggleSection('meetings')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white cursor-pointer hover:from-amber-600 hover:to-amber-700 transition-all">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <CardTitle className="text-xl text-white">
                          {language === 'sv' ? 'Styrelsearbete' : language === 'ar' ? 'عمل مجلس الإدارة' : 'Board Work'}
                        </CardTitle>
                        <p className="text-white/80 text-sm">
                          {language === 'sv' ? 'Planera och dokumentera styrelsearbetet' : 'Plan and document board work'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {openSections.meetings ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-6">
                  <BoardMeetings language={language} isRTL={isRTL} />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-lg bg-stone-50">
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

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
            <DialogHeader>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-12 h-12 ${selectedSubject.color} rounded-xl flex items-center justify-center`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <DialogTitle className="text-2xl text-stone-800">
                    {selectedSubject.title[language]}
                  </DialogTitle>
                  <p className="text-stone-500 mt-1">{selectedSubject.title.ar}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubject(null)}
                  className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-stone-400 hover:text-stone-600`}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Hours Badge */}
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <Badge className="bg-stone-100 text-stone-700 px-3 py-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedSubject.hours} {txt.hours}
                </Badge>
              </div>

              {/* Overview */}
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-lg font-semibold text-stone-800 mb-3">
                  {language === 'sv' ? 'Översikt' : language === 'ar' ? 'نظرة عامة' : 'Overview'}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {selectedSubject.fullContent[language].overview}
                </p>
              </div>

              {/* Topics */}
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-lg font-semibold text-stone-800 mb-3">
                  {language === 'sv' ? 'Ämnen som behandlas' : language === 'ar' ? 'المواضيع المغطاة' : 'Topics Covered'}
                </h3>
                <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
                  {selectedSubject.fullContent[language].topics.map((topic, index) => (
                    <li key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-2 h-2 ${selectedSubject.color} rounded-full mt-2 flex-shrink-0`} />
                      <span className="text-stone-600">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Outcome */}
              <div className={`p-4 bg-haggai-50 rounded-xl ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-haggai-dark mb-2">
                  {language === 'sv' ? 'Lärandemål' : language === 'ar' ? 'نتائج التعلم' : 'Learning Outcome'}
                </h3>
                <p className="text-haggai-dark">
                  {selectedSubject.fullContent[language].outcome}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MembersArea;
