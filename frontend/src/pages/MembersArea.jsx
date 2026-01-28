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
    facilitators: false,
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
  const [facilitators, setFacilitators] = useState([]);
  const [loadingFacilitators, setLoadingFacilitators] = useState(true);
  
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

  // Helper to get localized text from object or string
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
      // Facilitators section
      facilitatorsTitle: 'Facilitatorer/Tränare',
      facilitatorsDesc: 'Våra erfarna facilitatorer som guidar och inspirerar',
      noFacilitators: 'Inga facilitatorer registrerade än',
      facilitatorTopic: 'Specialområde',
      facilitatorContact: 'Kontakt',
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
      // Facilitators section
      facilitatorsTitle: 'Facilitators/Trainers',
      facilitatorsDesc: 'Our experienced facilitators who guide and inspire',
      noFacilitators: 'No facilitators registered yet',
      facilitatorTopic: 'Area of expertise',
      facilitatorContact: 'Contact',
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
      // Our Unity section
      ourUnity: 'وحدتنا',
      ourUnityDesc: 'معاً نصنع الفرق في السويد',
      unityTitle: 'كن جزءاً من تغيير السويد',
      unityText: 'كعضو في حجاي السويد، لديك الفرصة لتكون جزءاً من شيء أكبر منك. التزامك ووقتك ومسؤوليتك ضرورية لكي نتمكن معاً من إحداث تأثير إيجابي في مجتمعنا. كل تدريب قيادي، كل علاقة إرشادية، وكل خطوة نتخذها معاً تساهم في بناء سويد أقوى - وفي نهاية المطاف عالم أفضل.',
      unityCall: 'تحمل المسؤولية. شارك. أعطِ من وقتك. معاً يمكننا تغيير العالم - قائد واحد في كل مرة.',
      // Workshops section
      upcomingWorkshops: 'التدريبات القادمة',
      upcomingWorkshopsDesc: 'عرض ورش العمل المخططة وترشيح المشاركين',
      nominateBtn: 'رشح شخصاً',
      viewCalendar: 'عرض التقويم الكامل',
      noWorkshops: 'لا توجد تدريبات قادمة حالياً',
      spotsLeft: 'أماكن متبقية',
      // Haggai global
      haggaiGlobal: 'حجاي الدولية',
      haggaiGlobalDesc: 'رؤيتنا العالمية',
      haggaiVision: 'رؤية حجاي الدولية هي تجهيز القادة المسيحيين في جميع أنحاء العالم لصنع تلاميذ من جميع الشعوب.',
      haggaiMission: 'من خلال تدريب القادة الذين يضاعفون أنفسهم، نسعى للوصول إلى كل أمة بالإنجيل.',
      // Rest
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
      currentBoard: 'مجلس الإدارة الحالي',
      previousBoard: 'المجالس السابقة',
      showPrevious: 'عرض المجالس السابقة',
      hidePrevious: 'إخفاء المجالس السابقة',
      term: 'الفترة',
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
  // Based on Haggai curriculum: Biblical Mandate, Stewardship, Context, Next Generation, Leadership, Goal Setting
  const coreSubjects = [
    {
      id: 1,
      title: { sv: 'Bibliskt Mandat', en: 'Biblical Mandate', ar: 'الأساس الكتابي' },
      hours: 3,
      color: 'bg-blue-600',
      description: { 
        sv: 'Det bibliska mandatet för evangelisation - varför vi evangeliserar.',
        en: 'The biblical foundation for evangelism - why we evangelize.',
        ar: 'الأساس الكتابي للكرازة - لماذا نكرز؟'
      },
      fullContent: {
        sv: {
          overview: 'Förstå Guds plan för evangelisation och vårt personliga engagemang i uppdraget.',
          topics: [
            'Vem är Gud och vad betyder evangelisation',
            'Guds natur som sändare',
            'Människans fall och syndens herravälde',
            'Frälsning endast genom Kristus',
            'Engagemanget för evangelisation - den stora missionsbefallningen',
            'Den Helige Andes verk och kyrkans kallelse'
          ],
          outcome: 'Du kommer att förstå det bibliska mandatet och göra ett personligt åtagande för evangelisation.'
        },
        en: {
          overview: 'Understanding God\'s plan for evangelism and our personal commitment to the mission.',
          topics: [
            'Who is God and what does evangelism mean',
            'God\'s nature as sender',
            'The fall of man and the dominion of sin',
            'Salvation through Christ alone',
            'Commitment to evangelism - the Great Commission',
            'The work of the Holy Spirit and the church\'s calling'
          ],
          outcome: 'You will understand the biblical mandate and make a personal commitment to evangelism.'
        },
        ar: {
          overview: 'فهم خطة الله للكرازة والتزامنا الشخصي بالمهمة.',
          topics: [
            'من هو الله وما معنى الكرازة',
            'طبيعة الله كمرسل',
            'سقوط الإنسان وسيادة الخطية',
            'الخلاص بالمسيح وحده',
            'الالتزام بالكرازة - المأمورية العظمى',
            'عمل الروح القدس ودعوة الكنيسة للكرازة'
          ],
          outcome: 'ستفهم الأساس الكتابي وتلتزم شخصياً بالكرازة.'
        }
      }
    },
    {
      id: 2,
      title: { sv: 'Förvaltarskap', en: 'Stewardship', ar: 'الوكالة' },
      hours: 3,
      color: 'bg-green-500',
      description: { 
        sv: 'Bibliskt förvaltarskap - hur vi samlar resurser för evangelisation.',
        en: 'Biblical stewardship - how we gather resources for evangelism.',
        ar: 'الوكالة الكتابية - جمع الموارد للكرازة.'
      },
      fullContent: {
        sv: {
          overview: 'Utrusta deltagare att förvalta ekonomiska resurser som en grundprincip för effektiv evangelisation.',
          topics: [
            'Utveckla lokala resurser och risker med utländskt beroende',
            'Bibliska principer för förvaltarskap - tionde och "andramils"-givande',
            'Undervisa förvaltarskapsprinciper för att hjälpa andra',
            'Förstå ansvar och färdigheter för lokal resursutveckling',
            'Sätta mål för bidrag och insamling till evangelisation'
          ],
          outcome: 'Du kommer att kunna utveckla och använda lokala resurser för effektiv tjänst.'
        },
        en: {
          overview: 'Equipping participants to manage financial resources as a foundational principle for effective evangelism.',
          topics: [
            'Developing local resources and risks of foreign dependency',
            'Biblical principles of stewardship - tithing and "second mile" giving',
            'Teaching stewardship principles to help others',
            'Understanding responsibility and skills for local resource development',
            'Setting goals for contributions and fundraising for evangelism'
          ],
          outcome: 'You will be able to develop and use local resources for effective ministry.'
        },
        ar: {
          overview: 'تجهيز المشاركين لإدارة الموارد المالية كمبدأ أساسي للكرازة الفعالة.',
          topics: [
            'تطوير الموارد المحلية ومخاطر الاعتماد على التمويل الأجنبي',
            'المبادئ الكتابية للوكالة - العشور وعطاء "الميل الثاني"',
            'تعليم مبادئ الوكالة لمساعدة الآخرين',
            'إدراك مسؤولية ومهارة تطوير الموارد المحلية',
            'وضع أهداف للتبرعات وجمع الأموال للكرازة'
          ],
          outcome: 'ستكون قادراً على تطوير واستخدام الموارد المحلية للخدمة الفعالة.'
        }
      }
    },
    {
      id: 3,
      title: { sv: 'Kontext/Majoriteten', en: 'Context', ar: 'السياق' },
      hours: 5,
      color: 'bg-purple-500',
      description: { 
        sv: 'Evangeliet i det nuvarande sammanhanget - förmedla till majoriteten.',
        en: 'The Gospel in the present context - reaching the majority.',
        ar: 'توصيل الإنجيل في السياق الحاضر - الوصول للأغلبية.'
      },
      fullContent: {
        sv: {
          overview: 'Utrusta deltagare att förmedla evangeliet till majoritetsbefolkningen, särskilt muslimer.',
          topics: [
            'Islam utgör den största utmaningen för evangelisation idag',
            'Erkänna svårigheten men inte omöjligheten av evangelisation till muslimer',
            'Förstå grundläggande islamiska principer och religiösa seder',
            'Utveckla vad man bör och inte bör göra när man talar med muslimer',
            'Visa kärlek och be för muslimska vänner och länder'
          ],
          outcome: 'Du kommer att kunna närma dig och dela evangeliet med människor från olika bakgrunder.'
        },
        en: {
          overview: 'Equipping participants to communicate the Gospel to the majority population, especially Muslims.',
          topics: [
            'Islam presents the greatest challenge for evangelism today',
            'Recognizing the difficulty but not impossibility of evangelism to Muslims',
            'Understanding basic Islamic principles and religious practices',
            'Developing dos and don\'ts when talking to Muslims about the Gospel',
            'Showing love and praying for Muslim friends and nations'
          ],
          outcome: 'You will be able to approach and share the Gospel with people from different backgrounds.'
        },
        ar: {
          overview: 'تجهيز المشاركين لتوصيل رسالة الإنجيل إلى الأغلبية، خاصة أصحاب الإيمان الإسلامي.',
          topics: [
            'إدراك أن الإسلام يشكل أكبر تحدٍّ للكرازة في عالمنا اليوم',
            'إدراك صعوبة الكرازة للمسلمين لكن عدم استحالتها',
            'التعرف على المبادئ الأساسية للإسلام وممارسة المسلمين لشعائرهم',
            'تطوير خطوات ما يجب وما لا يجب عند التحدث إلى مسلم عن الإنجيل',
            'إظهار المحبة والصلاة لأجل الأصدقاء المسلمين والدول الإسلامية'
          ],
          outcome: 'ستكون قادراً على الوصول ومشاركة الإنجيل مع أشخاص من خلفيات مختلفة.'
        }
      }
    },
    {
      id: 4,
      title: { sv: 'Nästa Generation', en: 'Next Generation', ar: 'الجيل القادم' },
      hours: 5,
      color: 'bg-orange-500',
      description: { 
        sv: 'Förmedla evangeliet till den yngre generationen.',
        en: 'Communicating the Gospel to the younger generation.',
        ar: 'توصيل الإنجيل للجيل القادم.'
      },
      fullContent: {
        sv: {
          overview: 'Visa hur man förmedlar evangeliet till den unga generationen.',
          topics: [
            'Uppleva ungdomsvärlden (13-30 år) - en subkultur med egna identiteter, värderingar och osäkerheter',
            'Kommunicera med unga genom lyssnande och relationer',
            'Utforska olika metoder (musik, sport) som hjälpt unga att öppna sig för evangeliet',
            'Förstå hur unga kan spela en aktiv roll i kyrkan',
            'Unga som en kraft för att nå andra unga för Kristus'
          ],
          outcome: 'Du kommer att kunna engagera och utrusta nästa generation för evangelisation.'
        },
        en: {
          overview: 'Demonstrating how to communicate the Gospel to the youth generation.',
          topics: [
            'Experiencing the youth world (ages 13-30) - a subculture with unique identities, values and insecurities',
            'Communicating with youth through listening and relationships',
            'Exploring various methods (music, sports) that helped youth open up to the Gospel',
            'Understanding how youth can play an active role in the church',
            'Youth as a force to bring other young people to Christ'
          ],
          outcome: 'You will be able to engage and equip the next generation for evangelism.'
        },
        ar: {
          overview: 'إظهار كيفية نقل رسالة الإنجيل لجيل الشباب.',
          topics: [
            'خوض تجربة عالم الشباب (سن 13-30) - ثقافة فرعية بهوياتها الخاصة وقيمها وحالات عدم الأمان',
            'التواصل مع الشباب من خلال الاستماع والعلاقات',
            'استكشاف وسائل متنوعة (الموسيقى والرياضة) التي ساعدت الشباب للانفتاح على الإنجيل',
            'التعرف على كيفية لعب الشباب دوراً ناشطاً في الكنيسة',
            'الشباب كقوة لجلب شباب آخرين للمسيح'
          ],
          outcome: 'ستكون قادراً على إشراك وتجهيز الجيل القادم للكرازة.'
        }
      }
    },
    {
      id: 5,
      title: { sv: 'Ledarskap', en: 'Leadership', ar: 'القيادة' },
      hours: 4,
      color: 'bg-red-500',
      description: { 
        sv: 'Effektivt vittnesbörd i ledarskap.',
        en: 'Effective witness in leadership.',
        ar: 'شهادة فعالة في القيادة.'
      },
      fullContent: {
        sv: {
          overview: 'Tillhandahålla principer och verktyg för effektivt ledarskap för att utföra evangelisationsarbete.',
          topics: [
            'Förstå ledaren enligt Bibelns principer',
            'Förstå ledarens roller och ansvar',
            'Skilja mellan ledare och icke-ledare',
            'Utvärdera olika ledarstilar och deras funktioner',
            'Integrera "tjänande ledarskap" i livsstilen',
            'Påverka människor effektivt att vittna om Kristus',
            'Utveckla andra generations ledarskap för att tjäna Gud'
          ],
          outcome: 'Du kommer att ha verktyg för att leda effektivt i evangelisationsarbetet.'
        },
        en: {
          overview: 'Providing principles and tools for effective leadership to carry out evangelism work.',
          topics: [
            'Understanding the leader according to Bible principles',
            'Understanding the leader\'s roles and responsibilities',
            'Distinguishing between leaders and non-leaders',
            'Evaluating different leadership styles and their functions',
            'Integrating "servant leadership" into lifestyle',
            'Effectively influencing people to witness for Christ',
            'Developing second-level leadership to serve God'
          ],
          outcome: 'You will have tools for leading effectively in evangelism work.'
        },
        ar: {
          overview: 'توفير مبادئ وأدوات لقيادة فعالة لينفذ عمل الكرازة على وجه السرعة.',
          topics: [
            'التعرف على القائد وفقاً لمبادئ الكتاب المقدس',
            'التعرف على دور ومسؤوليات القائد',
            'التمييز بين القادة وغير القادة',
            'تقييم وظائف أساليب القيادة المختلفة',
            'دمج "القائد الخادم" في أنماط حياتهم',
            'التأثير على الناس بشكل فعال ليشهدوا للمسيح',
            'تطوير مستويات من الدرجة الثانية في القيادة لخدمة الله باستمرار'
          ],
          outcome: 'ستكون لديك أدوات للقيادة بفعالية في عمل الكرازة.'
        }
      }
    },
    {
      id: 6,
      title: { sv: 'Målsättning', en: 'Goal Setting', ar: 'وضع الأهداف' },
      hours: 5,
      color: 'bg-teal-500',
      description: { 
        sv: 'Sätta och uppnå mål för evangelisation.',
        en: 'Setting and achieving goals for evangelism.',
        ar: 'وضع وتحقيق الأهداف للكرازة.'
      },
      fullContent: {
        sv: {
          overview: 'Använda målsättning som ett effektivt verktyg för ledarskap i evangelisation.',
          topics: [
            'Förstå att den individuella visionen kommer från Guds syfte för ens liv',
            'Förbereda en personlig uppdragsbeskrivning',
            'Integrera mål för missionen genom visionen',
            'Förstå att målsättning för liv och tjänst är bibliskt',
            'Skriva personliga mål inom områden: tjänst, familj, ekonomi, hälsa, samhälle, intellektuell utveckling'
          ],
          outcome: 'Du kommer att kunna sätta och nå mål som driver evangelisationsarbetet framåt.'
        },
        en: {
          overview: 'Using goal setting as an effective tool for leadership in evangelism.',
          topics: [
            'Understanding that individual vision emerges from God\'s purpose for one\'s life',
            'Preparing a personal mission statement',
            'Integrating goals for the mission through the vision',
            'Understanding that goal setting for life and ministry is biblical',
            'Writing personal goals in areas: ministry, family, finances, health, community, intellectual growth'
          ],
          outcome: 'You will be able to set and achieve goals that drive evangelism work forward.'
        },
        ar: {
          overview: 'استخدام وضع الأهداف كأداة فعالة للقيادة في الكرازة.',
          topics: [
            'إدراك أن الرؤية الفردية تنبثق من قصد الله لحياة المرء',
            'إعداد بيان مهمة شخصية',
            'دمج أهداف المرء للإرسالية من خلال الرؤية',
            'الاقتناع بأن وضع أهداف للحياة والخدمة أمر كتابي',
            'كتابة أهداف شخصية في مجالات: الخدمة، الأسرة، المال، الصحة، المجتمع، النمو الفكري'
          ],
          outcome: 'ستكون قادراً على وضع وتحقيق أهداف تدفع عمل الكرازة للأمام.'
        }
      }
    }
  ];

  // Total hours: 3+3+5+5+4+5 = 25 hours (but displayed as 21 for certification)
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
          
          {/* Section 0: Vår Enhet - Motiverande sektion */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <Collapsible open={openSections.unity} onOpenChange={() => toggleSection('unity')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white cursor-pointer hover:from-rose-600 hover:to-rose-700 transition-all">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <CardTitle className="text-xl text-white">{txt.ourUnity}</CardTitle>
                        <p className="text-white/80 text-sm">{txt.ourUnityDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-white/80" />
                      {openSections.unity ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-6">
                  <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
                    <div className="p-6 bg-rose-50 rounded-xl border border-rose-100">
                      <h3 className="text-xl font-bold text-rose-800 mb-4">{txt.unityTitle}</h3>
                      <p className="text-stone-700 leading-relaxed mb-4">
                        {txt.unityText}
                      </p>
                      <p className="text-rose-700 font-semibold italic text-lg">
                        "{txt.unityCall}"
                      </p>
                    </div>
                    
                    {/* Haggai International - Global vision (less prominent) */}
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                      <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Globe className="h-5 w-5 text-stone-400" />
                        <h4 className="font-medium text-stone-600">{txt.haggaiGlobal}</h4>
                      </div>
                      <p className="text-sm text-stone-500 mb-2">{txt.haggaiVision}</p>
                      <p className="text-sm text-stone-400">{txt.haggaiMission}</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Section 1: Kommande Utbildningar */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <Collapsible open={openSections.workshops} onOpenChange={() => toggleSection('workshops')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <CardTitle className="text-xl text-white">{txt.upcomingWorkshops}</CardTitle>
                        <p className="text-white/80 text-sm">{txt.upcomingWorkshopsDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/20 text-white">{workshops.length}</Badge>
                      {openSections.workshops ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-6">
                  {loadingWorkshops ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : workshops.length > 0 ? (
                    <div className="space-y-4">
                      {workshops.map((workshop) => (
                        <div key={workshop.id} className={`p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors ${isRTL ? 'text-right' : ''}`}>
                          <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-1">
                              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                <h4 className="font-semibold text-stone-800">
                                  {getLocalizedText(workshop.title)}
                                </h4>
                                {workshop.is_online && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">Online</Badge>
                                )}
                                {workshop.type === 'tot' && (
                                  <Badge className="bg-purple-100 text-purple-700 text-xs">ToT</Badge>
                                )}
                              </div>
                              <div className={`flex flex-wrap gap-3 text-sm text-stone-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                {workshop.date && (
                                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Calendar className="h-4 w-4" />
                                    {new Date(workshop.date).toLocaleDateString('sv-SE')}
                                    {workshop.end_date && ` - ${new Date(workshop.end_date).toLocaleDateString('sv-SE')}`}
                                  </span>
                                )}
                                {workshop.location && (
                                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <MapPin className="h-4 w-4" />
                                    {workshop.location}
                                  </span>
                                )}
                                {workshop.spots && (
                                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <Users className="h-4 w-4" />
                                    {workshop.spots} {txt.spotsLeft}
                                  </span>
                                )}
                              </div>
                              {workshop.price && (
                                <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                                  {workshop.price} {workshop.currency || 'SEK'}
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => navigate('/kalender')}
                              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                            >
                              <UserPlus className="h-4 w-4" />
                              {txt.nominateBtn}
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-stone-200">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/kalender')}
                          className="w-full"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {txt.viewCalendar}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${isRTL ? 'text-right' : ''}`}>
                      <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                      <p className="text-stone-500">{txt.noWorkshops}</p>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/kalender')}
                        className="mt-4"
                      >
                        {txt.viewCalendar}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Section 2: Core Subjects (Kärnämnen) */}
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
