import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import { useEffect } from 'react';

const MemberBylaws = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
    }
  }, [isMembersAuthenticated, navigate]);

  const translations = {
    sv: {
      title: 'Stadgar',
      subtitle: 'Föreningens regler och riktlinjer',
      back: 'Tillbaka',
      adoptedDate: 'Antagna 16 april 2025',
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
      title: 'Bylaws',
      subtitle: 'Association rules and guidelines',
      back: 'Back',
      adoptedDate: 'Adopted April 16, 2025',
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
      title: 'النظام الأساسي',
      subtitle: 'قواعد وإرشادات الجمعية',
      back: 'رجوع',
      adoptedDate: 'اعتمدت في 16 أبريل 2025',
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

  const bylawsContent = [
    { section: '§1', title: txt.sections.name, content: 'Föreningens namn är Haggai Sweden.' },
    { section: '§2', title: txt.sections.purpose, content: 'Syftet är att stärka och utrusta kristna ledare genom utbildning, mentorskap och nätverkande. Föreningen främjar etisk och samhällelig utveckling baserat på kristna värderingar.' },
    { section: '§3', title: txt.sections.seat, content: 'Föreningen har sitt säte i Stockholm. Adress: Modulvägen 6, 141 75 Kungens Kurva.' },
    { section: '§4', title: txt.sections.membership, content: 'Medlemskap är öppet för alla som delar föreningens syfte. Medlemsavgiften är 1200 kr per år. Medlemskap erhålls genom att betala avgiften och godkänna stadgarna.' },
    { section: '§5', title: txt.sections.board, content: 'Styrelsen består av minst tre personer: Ordförande (Bashar), Kassör (Ravi) och Ledamöter (Mazin, Peter, Alen). Styrelsen ansvarar för verksamhet, ekonomi och beslut.' },
    { section: '§6', title: txt.sections.annualMeeting, content: 'Årsmötet hålls årligen och är föreningens högsta beslutande organ. Beslut fattas med enkel majoritet. Vid lika röstetal har ordföranden utslagsröst.' },
    { section: '§7', title: txt.sections.economy, content: 'Kassören ansvarar för föreningens ekonomi. Föreningens ekonomi granskas av en revisor utsedd av årsmötet.' },
    { section: '§8', title: txt.sections.dissolution, content: 'Vid upplösning av föreningen ska eventuella tillgångar användas enligt föreningens syfte eller skänkas till en ideell organisation med liknande ändamål.' },
    { section: '§9', title: txt.sections.boardWork, content: 'Styrelsens mandatperiod är tre år. Styrelsen sammanträder minst 4 gånger per år och är beslutsmässig när mer än hälften är närvarande.' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-emerald-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
            <Scale className="h-3 w-3 mr-1" />
            {txt.adoptedDate}
          </Badge>
        </div>

        {/* Compact Title */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
            <p className="text-xs text-stone-500">{txt.subtitle}</p>
          </div>
        </div>

        {/* Bylaws Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {bylawsContent.map((item, idx) => (
            <Card key={idx} className="border-0 shadow-md overflow-hidden bg-white">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-3 py-2">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge className="bg-white/20 text-white text-xs">{item.section}</Badge>
                  <span className="text-white font-medium text-xs">{item.title}</span>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-stone-600 text-xs leading-relaxed">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberBylaws;
