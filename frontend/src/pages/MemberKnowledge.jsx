import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, BookOpen, Clock, GraduationCap, CheckCircle, Target, List, X } from 'lucide-react';
import { useEffect } from 'react';

const MemberKnowledge = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
    }
  }, [isMembersAuthenticated, navigate]);

  const translations = {
    sv: {
      title: 'Kärnämnen',
      subtitle: '21 timmars certifierad ledarskapsutbildning',
      back: 'Tillbaka',
      hours: 'timmar',
      hour: 'timme',
      totalHours: 'Totalt 21 timmar',
      diploma: 'Certifierad Workshop med Diplom',
      diplomaDesc: 'Efter genomförd utbildning erhåller du ett officiellt diplom från Haggai International som erkänns globalt.',
      overview: 'Översikt',
      topics: 'Ämnen som behandlas',
      outcome: 'Lärandemål',
      close: 'Stäng',
      clickToLearn: 'Klicka för att lära dig mer'
    },
    en: {
      title: 'Core Subjects',
      subtitle: '21 hours of certified leadership training',
      back: 'Back',
      hours: 'hours',
      hour: 'hour',
      totalHours: 'Total 21 hours',
      diploma: 'Certified Workshop with Diploma',
      diplomaDesc: 'Upon completion, you will receive an official diploma from Haggai International recognized globally.',
      overview: 'Overview',
      topics: 'Topics Covered',
      outcome: 'Learning Outcome',
      close: 'Close',
      clickToLearn: 'Click to learn more'
    },
    ar: {
      title: 'المواضيع الأساسية',
      subtitle: '21 ساعة من التدريب القيادي المعتمد',
      back: 'رجوع',
      hours: 'ساعات',
      hour: 'ساعة',
      totalHours: 'المجموع 21 ساعة',
      diploma: 'ورشة عمل معتمدة مع شهادة',
      diplomaDesc: 'بعد إتمام التدريب، ستحصل على شهادة رسمية من حجاي الدولية معترف بها عالمياً.',
      overview: 'نظرة عامة',
      topics: 'المواضيع المغطاة',
      outcome: 'نتائج التعلم',
      close: 'إغلاق',
      clickToLearn: 'انقر لمعرفة المزيد'
    }
  };

  const txt = translations[language] || translations.sv;

  const coreSubjects = [
    { 
      id: 1, 
      title: { sv: 'Bibliskt Mandat', en: 'Biblical Mandate', ar: 'الأساس الكتابي' }, 
      hours: 3, 
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: '📖',
      description: { 
        sv: 'Utforska det bibliska mandatet för evangelisation och förstå Guds plan för världen.', 
        en: 'Explore the biblical mandate for evangelism and understand God\'s plan for the world.', 
        ar: 'استكشف الأساس الكتابي للكرازة وافهم خطة الله للعالم.' 
      }, 
      fullContent: { 
        sv: { 
          overview: 'Detta ämne ger dig en djup förståelse för Guds plan för evangelisation och ditt personliga engagemang i den stora missionsbefallningen. Du kommer att upptäcka hur Bibeln från början till slut visar Guds hjärta för alla folk.', 
          topics: ['Guds natur som den sändande Guden', 'Människans fall och syndens konsekvenser', 'Frälsning genom Jesus Kristus allena', 'Den stora missionsbefallningen i Matteus 28', 'Den Helige Andes kraft för vittnesbörd', 'Församlingens roll i Guds plan'], 
          outcome: 'Efter detta ämne kommer du att förstå det bibliska mandatet för evangelisation och kunna göra ett personligt åtagande för att dela evangeliet med andra.' 
        }, 
        en: { 
          overview: 'This subject gives you a deep understanding of God\'s plan for evangelism and your personal involvement in the Great Commission. You will discover how the Bible from beginning to end shows God\'s heart for all peoples.', 
          topics: ['God\'s nature as the sending God', 'The fall of man and consequences of sin', 'Salvation through Jesus Christ alone', 'The Great Commission in Matthew 28', 'The Holy Spirit\'s power for witness', 'The church\'s role in God\'s plan'], 
          outcome: 'After this subject, you will understand the biblical mandate for evangelism and be able to make a personal commitment to share the Gospel with others.' 
        }, 
        ar: { 
          overview: 'يمنحك هذا الموضوع فهماً عميقاً لخطة الله للكرازة ومشاركتك الشخصية في المأمورية العظمى.', 
          topics: ['طبيعة الله كالإله المرسل', 'سقوط الإنسان وعواقب الخطية', 'الخلاص بيسوع المسيح وحده', 'المأمورية العظمى في متى 28', 'قوة الروح القدس للشهادة', 'دور الكنيسة في خطة الله'], 
          outcome: 'بعد هذا الموضوع، ستفهم الأساس الكتابي للكرازة وستتمكن من الالتزام الشخصي بمشاركة الإنجيل.' 
        } 
      } 
    },
    { 
      id: 2, 
      title: { sv: 'Förvaltarskap', en: 'Stewardship', ar: 'الوكالة' }, 
      hours: 3, 
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      icon: '💰',
      description: { 
        sv: 'Lär dig bibliska principer för förvaltarskap och hur du kan utveckla resurser för Guds rike.', 
        en: 'Learn biblical principles of stewardship and how to develop resources for God\'s kingdom.', 
        ar: 'تعلم المبادئ الكتابية للوكالة وكيفية تطوير الموارد لملكوت الله.' 
      }, 
      fullContent: { 
        sv: { 
          overview: 'Detta ämne utrustar dig att förvalta ekonomiska och materiella resurser på ett sätt som ärar Gud och främjar evangelisation. Du kommer att lära dig praktiska verktyg för resursutveckling.', 
          topics: ['Bibliska principer för tionde och givande', 'Utveckla lokala resurser för tjänst', 'Andramils-givande - att ge utöver det förväntade', 'Praktiska färdigheter för resursutveckling', 'Sätta ekonomiska mål för din församling', 'Ansvarsfull förvaltning av Guds gåvor'], 
          outcome: 'Du kommer att kunna utveckla och använda lokala resurser effektivt för att stödja evangelisationsarbete utan att vara beroende av utomstående finansiering.' 
        }, 
        en: { 
          overview: 'This subject equips you to manage financial and material resources in a way that honors God and promotes evangelism. You will learn practical tools for resource development.', 
          topics: ['Biblical principles for tithing and giving', 'Developing local resources for ministry', 'Second mile giving - giving beyond expectations', 'Practical skills for resource development', 'Setting financial goals for your church', 'Responsible stewardship of God\'s gifts'], 
          outcome: 'You will be able to develop and use local resources effectively to support evangelism work without depending on outside funding.' 
        }, 
        ar: { 
          overview: 'يجهزك هذا الموضوع لإدارة الموارد المالية والمادية بطريقة تكرم الله وتعزز الكرازة.', 
          topics: ['المبادئ الكتابية للعشور والعطاء', 'تطوير الموارد المحلية للخدمة', 'عطاء الميل الثاني', 'مهارات عملية لتطوير الموارد', 'وضع أهداف مالية لكنيستك', 'الوكالة المسؤولة لعطايا الله'], 
          outcome: 'ستتمكن من تطوير واستخدام الموارد المحلية بفعالية لدعم عمل الكرازة.' 
        } 
      } 
    },
    { 
      id: 3, 
      title: { sv: 'Kontext', en: 'Context', ar: 'السياق' }, 
      hours: 5, 
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      icon: '🌍',
      description: { 
        sv: 'Förstå hur du kan kommunicera evangeliet effektivt i olika kulturella sammanhang.', 
        en: 'Understand how to communicate the Gospel effectively in different cultural contexts.', 
        ar: 'افهم كيفية توصيل الإنجيل بفعالية في سياقات ثقافية مختلفة.' 
      }, 
      fullContent: { 
        sv: { 
          overview: 'Detta omfattande ämne utrustar dig att förmedla evangeliet till människor med muslimsk bakgrund och andra kulturella sammanhang. Du kommer att lära dig att bygga broar och visa kärlek.', 
          topics: ['Islams utmaning för kristen evangelisation', 'Grundläggande islamiska principer och trosuppfattningar', 'Kulturella seder och traditioner att förstå', 'Vad man bör och inte bör göra i mötet', 'Bygga äkta vänskapsrelationer', 'Be för och visa kärlek till muslimska vänner'], 
          outcome: 'Du kommer att kunna närma dig och dela evangeliet med människor från olika religiösa och kulturella bakgrunder på ett respektfullt och kärleksfullt sätt.' 
        }, 
        en: { 
          overview: 'This comprehensive subject equips you to communicate the Gospel to people with Muslim backgrounds and other cultural contexts. You will learn to build bridges and show love.', 
          topics: ['Islam\'s challenge for Christian evangelism', 'Basic Islamic principles and beliefs', 'Cultural customs and traditions to understand', 'Dos and don\'ts in encounters', 'Building genuine friendship relationships', 'Praying for and showing love to Muslim friends'], 
          outcome: 'You will be able to approach and share the Gospel with people from different religious and cultural backgrounds in a respectful and loving way.' 
        }, 
        ar: { 
          overview: 'يجهزك هذا الموضوع الشامل لتوصيل الإنجيل للأشخاص من خلفيات إسلامية وسياقات ثقافية أخرى.', 
          topics: ['تحدي الإسلام للكرازة المسيحية', 'المبادئ والمعتقدات الإسلامية الأساسية', 'العادات والتقاليد الثقافية', 'ما يجب وما لا يجب في اللقاءات', 'بناء علاقات صداقة حقيقية', 'الصلاة وإظهار المحبة للأصدقاء المسلمين'], 
          outcome: 'ستتمكن من الوصول ومشاركة الإنجيل مع أشخاص من خلفيات دينية وثقافية مختلفة بطريقة محترمة ومحبة.' 
        } 
      } 
    },
    { 
      id: 4, 
      title: { sv: 'Nästa Generation', en: 'Next Generation', ar: 'الجيل القادم' }, 
      hours: 5, 
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      icon: '👥',
      description: { 
        sv: 'Lär dig strategier för att nå och engagera unga människor med evangeliet.', 
        en: 'Learn strategies for reaching and engaging young people with the Gospel.', 
        ar: 'تعلم استراتيجيات للوصول وإشراك الشباب بالإنجيل.' 
      }, 
      fullContent: { 
        sv: { 
          overview: 'Detta viktiga ämne visar hur du kan förmedla evangeliet till den unga generationen (13-30 år) på sätt som är relevanta och engagerande för dem.', 
          topics: ['Förstå ungdomsvärlden idag (13-30 år)', 'Kommunicera genom aktivt lyssnande', 'Kreativa metoder: musik, sport, sociala medier', 'Ungas roll och potential i församlingen', 'Unga som kraft för evangelisation', 'Mentorskap av nästa generations ledare'], 
          outcome: 'Du kommer att kunna engagera och utrusta nästa generation för evangelisation och ledarskap i församlingen.' 
        }, 
        en: { 
          overview: 'This important subject shows how to communicate the Gospel to the young generation (ages 13-30) in ways that are relevant and engaging for them.', 
          topics: ['Understanding today\'s youth world (ages 13-30)', 'Communicating through active listening', 'Creative methods: music, sports, social media', 'Youth role and potential in the church', 'Youth as a force for evangelism', 'Mentoring next generation leaders'], 
          outcome: 'You will be able to engage and equip the next generation for evangelism and leadership in the church.' 
        }, 
        ar: { 
          overview: 'يوضح هذا الموضوع المهم كيفية توصيل الإنجيل لجيل الشباب (13-30 سنة) بطرق مناسبة وجذابة لهم.', 
          topics: ['فهم عالم الشباب اليوم (13-30 سنة)', 'التواصل من خلال الاستماع النشط', 'أساليب إبداعية: الموسيقى والرياضة ووسائل التواصل', 'دور الشباب وإمكاناتهم في الكنيسة', 'الشباب كقوة للكرازة', 'إرشاد قادة الجيل القادم'], 
          outcome: 'ستتمكن من إشراك وتجهيز الجيل القادم للكرازة والقيادة في الكنيسة.' 
        } 
      } 
    },
    { 
      id: 5, 
      title: { sv: 'Ledarskap', en: 'Leadership', ar: 'القيادة' }, 
      hours: 4, 
      color: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      icon: '🎯',
      description: { 
        sv: 'Utveckla ditt ledarskap enligt bibliska principer för effektivt vittnesbörd.', 
        en: 'Develop your leadership according to biblical principles for effective witness.', 
        ar: 'طور قيادتك وفقاً للمبادئ الكتابية للشهادة الفعالة.' 
      }, 
      fullContent: { 
        sv: { 
          overview: 'Detta ämne ger dig principer och praktiska verktyg för att leda effektivt i evangelisationsarbetet. Du kommer att lära dig tjänande ledarskap efter Jesu exempel.', 
          topics: ['Den bibliska ledarens karaktär och kvaliteter', 'Ledarskapets roller och ansvar', 'Skillnaden mellan ledare och följare', 'Olika ledarstilar och när de passar', 'Tjänande ledarskap efter Jesu modell', 'Utveckla andra generations ledarskap'], 
          outcome: 'Du kommer att kunna leda effektivt i evangelisationsarbetet och multiplicera ditt ledarskap genom att utrusta andra.' 
        }, 
        en: { 
          overview: 'This subject gives you principles and practical tools for leading effectively in evangelism work. You will learn servant leadership following Jesus\' example.', 
          topics: ['The biblical leader\'s character and qualities', 'Leadership roles and responsibilities', 'Difference between leaders and followers', 'Different leadership styles and when they fit', 'Servant leadership following Jesus\' model', 'Developing second generation leadership'], 
          outcome: 'You will be able to lead effectively in evangelism work and multiply your leadership by equipping others.' 
        }, 
        ar: { 
          overview: 'يمنحك هذا الموضوع مبادئ وأدوات عملية للقيادة بفعالية في عمل الكرازة. ستتعلم القيادة الخادمة على مثال يسوع.', 
          topics: ['شخصية وصفات القائد الكتابي', 'أدوار ومسؤوليات القيادة', 'الفرق بين القادة والأتباع', 'أساليب القيادة المختلفة ومتى تناسب', 'القيادة الخادمة على نموذج يسوع', 'تطوير قيادة الجيل الثاني'], 
          outcome: 'ستتمكن من القيادة بفعالية في عمل الكرازة ومضاعفة قيادتك من خلال تجهيز الآخرين.' 
        } 
      } 
    },
    { 
      id: 6, 
      title: { sv: 'Målsättning', en: 'Goal Setting', ar: 'وضع الأهداف' }, 
      hours: 5, 
      color: 'from-teal-500 to-teal-600',
      bgLight: 'bg-teal-50',
      textColor: 'text-teal-600',
      icon: '✅',
      description: { 
        sv: 'Lär dig sätta och uppnå mål som driver evangelisationsarbetet framåt.', 
        en: 'Learn to set and achieve goals that drive evangelism work forward.', 
        ar: 'تعلم وضع وتحقيق أهداف تدفع عمل الكرازة للأمام.' 
      }, 
      fullContent: { 
        sv: { 
          overview: 'Detta avslutande ämne lär dig använda målsättning som ett kraftfullt verktyg för att förverkliga Guds syfte för ditt liv och din tjänst.', 
          topics: ['Upptäck Guds syfte för ditt liv', 'Skriv din personliga uppdragsbeskrivning', 'Integrera mål genom en tydlig vision', 'Formulera SMARTA personliga mål', 'Mål för olika livsområden: tjänst, familj, ekonomi, hälsa', 'Uppföljning och utvärdering av framsteg'], 
          outcome: 'Du kommer att kunna sätta tydliga, mätbara mål som driver ditt evangelisationsarbete framåt och hålla dig ansvarig för att nå dem.' 
        }, 
        en: { 
          overview: 'This concluding subject teaches you to use goal setting as a powerful tool for realizing God\'s purpose for your life and ministry.', 
          topics: ['Discover God\'s purpose for your life', 'Write your personal mission statement', 'Integrate goals through a clear vision', 'Formulate SMART personal goals', 'Goals for different life areas: ministry, family, finances, health', 'Follow-up and evaluation of progress'], 
          outcome: 'You will be able to set clear, measurable goals that drive your evangelism work forward and hold yourself accountable for reaching them.' 
        }, 
        ar: { 
          overview: 'يعلمك هذا الموضوع الختامي استخدام وضع الأهداف كأداة قوية لتحقيق قصد الله لحياتك وخدمتك.', 
          topics: ['اكتشف قصد الله لحياتك', 'اكتب بيان مهمتك الشخصية', 'ادمج الأهداف من خلال رؤية واضحة', 'صِغ أهدافاً شخصية ذكية', 'أهداف لمجالات الحياة المختلفة: الخدمة والأسرة والمال والصحة', 'المتابعة وتقييم التقدم'], 
          outcome: 'ستتمكن من وضع أهداف واضحة وقابلة للقياس تدفع عمل الكرازة للأمام ومحاسبة نفسك على تحقيقها.' 
        } 
      } 
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-purple-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          <Badge className="bg-purple-600 text-white text-sm px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {txt.totalHours}
          </Badge>
        </div>

        {/* Title Section */}
        <div className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.title}</h1>
          <p className="text-stone-600">{txt.subtitle}</p>
        </div>

        {/* Subjects Grid - Larger Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {coreSubjects.map(subject => (
            <Card 
              key={subject.id} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white cursor-pointer group"
              onClick={() => setSelectedSubject(subject)}
            >
              <div className={`bg-gradient-to-br ${subject.color} p-6 text-center relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <span className="text-4xl mb-3 block relative z-10">{subject.icon}</span>
                <h3 className="text-lg font-bold text-white relative z-10">{subject.title[language]}</h3>
                <Badge className="bg-white/20 text-white mt-2 text-sm">
                  {subject.hours} {subject.hours === 1 ? txt.hour : txt.hours}
                </Badge>
              </div>
              <CardContent className="p-4">
                <p className="text-stone-600 text-sm leading-relaxed mb-3">{subject.description[language]}</p>
                <p className={`text-xs ${subject.textColor} font-medium group-hover:underline`}>
                  {txt.clickToLearn} →
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Diploma Notice */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-lg font-bold text-white mb-1">{txt.diploma}</h3>
                <p className="text-white/80 text-sm">{txt.diplomaDesc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Large Subject Detail Modal */}
        {selectedSubject && (
          <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
            <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto p-0 ${isRTL ? 'rtl' : 'ltr'}`}>
              {/* Modal Header with gradient */}
              <div className={`bg-gradient-to-br ${selectedSubject.color} p-8 text-center relative overflow-hidden`}>
                <button 
                  onClick={() => setSelectedSubject(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <span className="text-6xl mb-4 block relative z-10">{selectedSubject.icon}</span>
                <DialogTitle className="text-2xl font-bold text-white relative z-10 mb-2">
                  {selectedSubject.title[language]}
                </DialogTitle>
                <Badge className="bg-white/20 text-white text-base px-4 py-1">
                  <Clock className="h-4 w-4 mr-2" />
                  {selectedSubject.hours} {selectedSubject.hours === 1 ? txt.hour : txt.hours}
                </Badge>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Overview Section */}
                <div className={`${selectedSubject.bgLight} rounded-xl p-6 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Target className={`h-5 w-5 ${selectedSubject.textColor}`} />
                    <h3 className={`text-lg font-bold ${selectedSubject.textColor}`}>{txt.overview}</h3>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    {selectedSubject.fullContent[language].overview}
                  </p>
                </div>

                {/* Topics Section */}
                <div className={isRTL ? 'text-right' : ''}>
                  <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <List className={`h-5 w-5 ${selectedSubject.textColor}`} />
                    <h3 className={`text-lg font-bold ${selectedSubject.textColor}`}>{txt.topics}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedSubject.fullContent[language].topics.map((topic, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-3 p-3 bg-stone-50 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                      >
                        <div className={`w-6 h-6 bg-gradient-to-br ${selectedSubject.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-stone-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcome Section */}
                <div className={`border-2 border-dashed ${selectedSubject.textColor.replace('text', 'border')} rounded-xl p-6 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CheckCircle className={`h-5 w-5 ${selectedSubject.textColor}`} />
                    <h3 className={`text-lg font-bold ${selectedSubject.textColor}`}>{txt.outcome}</h3>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    {selectedSubject.fullContent[language].outcome}
                  </p>
                </div>

                {/* Close Button */}
                <Button 
                  onClick={() => setSelectedSubject(null)}
                  className={`w-full bg-gradient-to-r ${selectedSubject.color} hover:opacity-90 text-white py-6 text-lg`}
                >
                  {txt.close}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default MemberKnowledge;
