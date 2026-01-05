import React from 'react';
import { FileText, Users, Building2, Calendar, Mail, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const MembersArea = () => {
  const { language, isRTL } = useLanguage();

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

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Badge className="bg-haggai text-cream-50">
                <Lock className="h-3 w-3 mr-1" />
                {language === 'sv' ? 'Endast medlemmar' : language === 'ar' ? 'الأعضاء فقط' : 'Members only'}
              </Badge>
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

      {/* Bylaws Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardHeader className="bg-haggai text-cream-50 p-8">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-16 h-16 bg-cream-50/20 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <CardTitle className="text-2xl mb-2">{txt.bylaws}</CardTitle>
                  <p className="text-cream-200">{txt.adoptedDate}</p>
                </div>
              </div>
            </CardHeader>
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
          </Card>

          {/* Board Members Quick View */}
          <Card className="border-0 shadow-xl mt-8">
            <CardHeader className={isRTL ? 'text-right' : ''}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <Users className="h-6 w-6 text-haggai" />
                <CardTitle className="text-xl">
                  {language === 'sv' ? 'Nuvarande styrelse' : language === 'ar' ? 'المجلس الحالي' : 'Current Board'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Bashar', role: language === 'sv' ? 'Ordförande' : language === 'ar' ? 'الرئيس' : 'Chairman' },
                  { name: 'Ravi', role: language === 'sv' ? 'Kassör' : language === 'ar' ? 'أمين الصندوق' : 'Treasurer' },
                  { name: 'Mazin', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' },
                  { name: 'Peter', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' },
                  { name: 'Alen', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' }
                ].map((member, idx) => (
                  <div key={idx} className={`p-4 bg-stone-50 rounded-xl ${isRTL ? 'text-right' : ''}`}>
                    <p className="font-semibold text-stone-800">{member.name}</p>
                    <p className="text-sm text-haggai">{member.role}</p>
                  </div>
                ))}
              </div>
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
