import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, BookOpen, Clock, GraduationCap } from 'lucide-react';
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
      subtitle: '21 timmars certifierad utbildning',
      back: 'Tillbaka',
      hours: 'timmar',
      totalHours: 'Totalt 21 timmar',
      diploma: 'Certifierad Workshop med Diplom',
      diplomaDesc: 'Efter genomförd utbildning erhåller du ett officiellt diplom från Haggai International.',
      overview: 'Översikt',
      topics: 'Ämnen',
      outcome: 'Lärandemål'
    },
    en: {
      title: 'Core Subjects',
      subtitle: '21 hours of certified training',
      back: 'Back',
      hours: 'hours',
      totalHours: 'Total 21 hours',
      diploma: 'Certified Workshop with Diploma',
      diplomaDesc: 'Upon completion, you will receive an official diploma from Haggai International.',
      overview: 'Overview',
      topics: 'Topics',
      outcome: 'Learning Outcome'
    },
    ar: {
      title: 'المواضيع الأساسية',
      subtitle: '21 ساعة من التدريب المعتمد',
      back: 'رجوع',
      hours: 'ساعات',
      totalHours: 'المجموع 21 ساعة',
      diploma: 'ورشة عمل معتمدة مع شهادة',
      diplomaDesc: 'بعد إتمام التدريب، ستحصل على شهادة رسمية من حجاي الدولية.',
      overview: 'نظرة عامة',
      topics: 'المواضيع',
      outcome: 'نتائج التعلم'
    }
  };

  const txt = translations[language] || translations.sv;

  const coreSubjects = [
    { id: 1, title: { sv: 'Bibliskt Mandat', en: 'Biblical Mandate', ar: 'الأساس الكتابي' }, hours: 3, color: 'from-blue-500 to-blue-600', description: { sv: 'Det bibliska mandatet för evangelisation.', en: 'The biblical foundation for evangelism.', ar: 'الأساس الكتابي للكرازة.' }, fullContent: { sv: { overview: 'Förstå Guds plan för evangelisation och vårt personliga engagemang.', topics: ['Guds natur som sändare', 'Människans fall och syndens herravälde', 'Frälsning genom Kristus', 'Den stora missionsbefallningen', 'Den Helige Andes verk'], outcome: 'Förstå det bibliska mandatet och göra ett personligt åtagande för evangelisation.' }, en: { overview: 'Understanding God\'s plan for evangelism and our personal commitment.', topics: ['God\'s nature as sender', 'The fall of man', 'Salvation through Christ', 'The Great Commission', 'The work of the Holy Spirit'], outcome: 'Understand the biblical mandate and make a personal commitment.' }, ar: { overview: 'فهم خطة الله للكرازة والتزامنا الشخصي.', topics: ['طبيعة الله كمرسل', 'سقوط الإنسان', 'الخلاص بالمسيح', 'المأمورية العظمى', 'عمل الروح القدس'], outcome: 'فهم الأساس الكتابي والالتزام الشخصي.' } } },
    { id: 2, title: { sv: 'Förvaltarskap', en: 'Stewardship', ar: 'الوكالة' }, hours: 3, color: 'from-green-500 to-green-600', description: { sv: 'Bibliskt förvaltarskap och resursutveckling.', en: 'Biblical stewardship and resource development.', ar: 'الوكالة الكتابية وتطوير الموارد.' }, fullContent: { sv: { overview: 'Utrusta deltagare att förvalta ekonomiska resurser effektivt.', topics: ['Utveckla lokala resurser', 'Bibliska principer för tionde', 'Andramils-givande', 'Färdigheter för resursutveckling', 'Sätta mål för bidrag'], outcome: 'Utveckla och använda lokala resurser för effektiv tjänst.' }, en: { overview: 'Equipping participants to manage financial resources effectively.', topics: ['Developing local resources', 'Biblical tithing principles', 'Second mile giving', 'Resource development skills', 'Setting contribution goals'], outcome: 'Develop and use local resources for effective ministry.' }, ar: { overview: 'تجهيز المشاركين لإدارة الموارد المالية بفعالية.', topics: ['تطوير الموارد المحلية', 'مبادئ العشور الكتابية', 'عطاء الميل الثاني', 'مهارات تطوير الموارد', 'وضع أهداف التبرعات'], outcome: 'تطوير واستخدام الموارد المحلية للخدمة الفعالة.' } } },
    { id: 3, title: { sv: 'Kontext', en: 'Context', ar: 'السياق' }, hours: 5, color: 'from-purple-500 to-purple-600', description: { sv: 'Evangeliet i det nuvarande sammanhanget.', en: 'The Gospel in the present context.', ar: 'الإنجيل في السياق الحاضر.' }, fullContent: { sv: { overview: 'Utrusta deltagare att förmedla evangeliet till majoritetsbefolkningen.', topics: ['Islams utmaning för evangelisation', 'Grundläggande islamiska principer', 'Religiösa seder', 'Vad man bör och inte bör göra', 'Visa kärlek och be för muslimska vänner'], outcome: 'Närma dig och dela evangeliet med människor från olika bakgrunder.' }, en: { overview: 'Equipping participants to communicate the Gospel to the majority.', topics: ['Islam\'s challenge for evangelism', 'Basic Islamic principles', 'Religious practices', 'Dos and don\'ts', 'Show love and pray for Muslim friends'], outcome: 'Approach and share the Gospel with people from different backgrounds.' }, ar: { overview: 'تجهيز المشاركين لتوصيل الإنجيل للأغلبية.', topics: ['تحدي الإسلام للكرازة', 'المبادئ الإسلامية الأساسية', 'الممارسات الدينية', 'ما يجب وما لا يجب', 'إظهار المحبة والصلاة للأصدقاء المسلمين'], outcome: 'الوصول ومشاركة الإنجيل مع خلفيات مختلفة.' } } },
    { id: 4, title: { sv: 'Nästa Generation', en: 'Next Generation', ar: 'الجيل القادم' }, hours: 5, color: 'from-orange-500 to-orange-600', description: { sv: 'Förmedla evangeliet till unga.', en: 'Communicating the Gospel to the youth.', ar: 'توصيل الإنجيل للشباب.' }, fullContent: { sv: { overview: 'Visa hur man förmedlar evangeliet till den unga generationen.', topics: ['Ungdomsvärlden (13-30 år)', 'Kommunicera genom lyssnande', 'Metoder: musik, sport', 'Ungas roll i kyrkan', 'Unga som kraft för evangelisation'], outcome: 'Engagera och utrusta nästa generation för evangelisation.' }, en: { overview: 'Demonstrating how to communicate the Gospel to the youth.', topics: ['Youth world (ages 13-30)', 'Communicate through listening', 'Methods: music, sports', 'Youth role in church', 'Youth as evangelism force'], outcome: 'Engage and equip the next generation for evangelism.' }, ar: { overview: 'إظهار كيفية نقل الإنجيل لجيل الشباب.', topics: ['عالم الشباب (13-30)', 'التواصل من خلال الاستماع', 'الوسائل: الموسيقى والرياضة', 'دور الشباب في الكنيسة', 'الشباب كقوة للكرازة'], outcome: 'إشراك وتجهيز الجيل القادم للكرازة.' } } },
    { id: 5, title: { sv: 'Ledarskap', en: 'Leadership', ar: 'القيادة' }, hours: 4, color: 'from-red-500 to-red-600', description: { sv: 'Effektivt vittnesbörd i ledarskap.', en: 'Effective witness in leadership.', ar: 'شهادة فعالة في القيادة.' }, fullContent: { sv: { overview: 'Principer och verktyg för effektivt ledarskap.', topics: ['Ledaren enligt Bibeln', 'Roller och ansvar', 'Ledare vs icke-ledare', 'Ledarstilar', 'Tjänande ledarskap', 'Utveckla andra generations ledarskap'], outcome: 'Leda effektivt i evangelisationsarbetet.' }, en: { overview: 'Principles and tools for effective leadership.', topics: ['Biblical leader', 'Roles and responsibilities', 'Leaders vs non-leaders', 'Leadership styles', 'Servant leadership', 'Develop second-level leadership'], outcome: 'Lead effectively in evangelism work.' }, ar: { overview: 'مبادئ وأدوات للقيادة الفعالة.', topics: ['القائد الكتابي', 'الأدوار والمسؤوليات', 'القادة وغير القادة', 'أساليب القيادة', 'القيادة الخادمة', 'تطوير قيادة المستوى الثاني'], outcome: 'قيادة بفعالية في عمل الكرازة.' } } },
    { id: 6, title: { sv: 'Målsättning', en: 'Goal Setting', ar: 'وضع الأهداف' }, hours: 5, color: 'from-teal-500 to-teal-600', description: { sv: 'Sätta och uppnå mål för evangelisation.', en: 'Setting and achieving goals for evangelism.', ar: 'وضع وتحقيق الأهداف للكرازة.' }, fullContent: { sv: { overview: 'Använda målsättning som ett effektivt verktyg.', topics: ['Guds syfte för ditt liv', 'Personlig uppdragsbeskrivning', 'Integrera mål genom vision', 'Skriva personliga mål', 'Mål för: tjänst, familj, ekonomi, hälsa'], outcome: 'Sätta och nå mål som driver evangelisationsarbetet framåt.' }, en: { overview: 'Using goal setting as an effective tool.', topics: ['God\'s purpose for your life', 'Personal mission statement', 'Integrate goals through vision', 'Write personal goals', 'Goals for: ministry, family, finances, health'], outcome: 'Set and achieve goals that drive evangelism forward.' }, ar: { overview: 'استخدام وضع الأهداف كأداة فعالة.', topics: ['قصد الله لحياتك', 'بيان المهمة الشخصية', 'دمج الأهداف من خلال الرؤية', 'كتابة أهداف شخصية', 'أهداف: الخدمة، الأسرة، المال، الصحة'], outcome: 'وضع وتحقيق أهداف تدفع عمل الكرازة للأمام.' } } }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-purple-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          <Badge className="bg-purple-100 text-purple-700 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {txt.totalHours}
          </Badge>
        </div>

        {/* Compact Title */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
            <p className="text-xs text-stone-500">{txt.subtitle}</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {coreSubjects.map(subject => (
            <Card 
              key={subject.id} 
              className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white cursor-pointer"
              onClick={() => setSelectedSubject(subject)}
            >
              <div className={`bg-gradient-to-br ${subject.color} p-3 text-center`}>
                <BookOpen className="h-5 w-5 text-white mx-auto mb-1" />
                <p className="text-white font-medium text-xs">{subject.title[language]}</p>
                <Badge className="bg-white/20 text-white text-[10px] mt-1">{subject.hours}h</Badge>
              </div>
              <CardContent className="p-2">
                <p className="text-stone-600 text-[10px] leading-tight line-clamp-2">{subject.description[language]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Diploma Notice */}
        <Card className="border-0 shadow-md bg-purple-50">
          <CardContent className="p-3">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">{txt.diploma}</p>
                <p className="text-xs text-purple-600">{txt.diplomaDesc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Detail Modal */}
        {selectedSubject && (
          <Dialog open={!!selectedSubject} onOpenChange={() => setSelectedSubject(null)}>
            <DialogContent className={`max-w-lg max-h-[80vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
              <DialogHeader>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 bg-gradient-to-br ${selectedSubject.color} rounded-lg flex items-center justify-center`}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-base text-stone-800">{selectedSubject.title[language]}</DialogTitle>
                    <Badge variant="outline" className="text-xs">{selectedSubject.hours} {txt.hours}</Badge>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3 mt-3">
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="text-xs font-semibold text-stone-800 mb-1">{txt.overview}</h3>
                  <p className="text-xs text-stone-600">{selectedSubject.fullContent[language].overview}</p>
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="text-xs font-semibold text-stone-800 mb-1">{txt.topics}</h3>
                  <ul className="space-y-1">
                    {selectedSubject.fullContent[language].topics.map((topic, idx) => (
                      <li key={idx} className={`flex items-start gap-1 text-xs text-stone-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-1 h-1 bg-gradient-to-br ${selectedSubject.color} rounded-full mt-1.5`} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-2 bg-purple-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="text-xs font-semibold text-purple-800 mb-1">{txt.outcome}</h3>
                  <p className="text-xs text-purple-700">{selectedSubject.fullContent[language].outcome}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default MemberKnowledge;
