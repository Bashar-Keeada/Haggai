import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Heart, Globe, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const MemberUnity = () => {
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
      title: 'Vår Enhet',
      subtitle: 'Tillsammans gör vi skillnad i Sverige',
      back: 'Tillbaka',
      unityTitle: 'Var med och förändra Sverige',
      unityText: 'Som medlem i Haggai Sweden har du möjlighet att vara en del av något större än dig själv. Ditt engagemang, din tid och ditt ansvar är avgörande för att vi tillsammans ska kunna göra en positiv påverkan i vårt samhälle. Varje ledarskapsutbildning, varje mentorsrelation och varje steg vi tar tillsammans bidrar till att bygga ett starkare Sverige – och i förlängningen en bättre värld.',
      unityCall: 'Ta ansvar. Engagera dig. Ge av din tid. Tillsammans kan vi förändra världen – en ledare i taget.',
      globalTitle: 'Haggai International',
      globalText: 'Haggai Internationals vision är att utrusta kristna ledare världen över att göra lärjungar av alla folk. Genom att utbilda ledare som multiplicerar sig själva, strävar vi efter att nå varje nation med evangeliet.',
      values: 'Våra värderingar',
      value1: 'Tro på Gud och hans plan',
      value2: 'Tjänande ledarskap',
      value3: 'Multiplikation av ledare',
      value4: 'Global påverkan lokalt'
    },
    en: {
      title: 'Our Unity',
      subtitle: 'Together we make a difference in Sweden',
      back: 'Back',
      unityTitle: 'Be part of changing Sweden',
      unityText: 'As a member of Haggai Sweden, you have the opportunity to be part of something greater than yourself. Your commitment, your time, and your responsibility are crucial for us to make a positive impact on our society together.',
      unityCall: 'Take responsibility. Get involved. Give your time. Together we can change the world – one leader at a time.',
      globalTitle: 'Haggai International',
      globalText: 'Haggai International\'s vision is to equip Christian leaders worldwide to make disciples of all nations.',
      values: 'Our values',
      value1: 'Faith in God and his plan',
      value2: 'Servant leadership',
      value3: 'Multiplication of leaders',
      value4: 'Global impact locally'
    },
    ar: {
      title: 'وحدتنا',
      subtitle: 'معاً نصنع الفرق في السويد',
      back: 'رجوع',
      unityTitle: 'كن جزءاً من تغيير السويد',
      unityText: 'كعضو في حجاي السويد، لديك الفرصة لتكون جزءاً من شيء أكبر منك. التزامك ووقتك ومسؤوليتك ضرورية لكي نتمكن معاً من إحداث تأثير إيجابي في مجتمعنا.',
      unityCall: 'تحمل المسؤولية. شارك. أعطِ من وقتك. معاً يمكننا تغيير العالم.',
      globalTitle: 'حجاي الدولية',
      globalText: 'رؤية حجاي الدولية هي تجهيز القادة المسيحيين في جميع أنحاء العالم.',
      values: 'قيمنا',
      value1: 'الإيمان بالله وخطته',
      value2: 'القيادة الخادمة',
      value3: 'مضاعفة القادة',
      value4: 'التأثير العالمي محلياً'
    }
  };

  const txt = translations[language] || translations.sv;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-rose-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-rose-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
        </div>

        {/* Compact Title */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center shadow">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
            <p className="text-xs text-stone-500">{txt.subtitle}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Main Unity Card */}
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-4">
              <div className="flex items-center gap-2 text-white mb-2">
                <Sparkles className="h-5 w-5" />
                <h2 className="font-bold text-sm">{txt.unityTitle}</h2>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-stone-700 text-sm leading-relaxed mb-3">{txt.unityText}</p>
              <p className="text-rose-700 font-medium italic text-sm border-l-4 border-rose-300 pl-3">
                &ldquo;{txt.unityCall}&rdquo;
              </p>
            </CardContent>
          </Card>

          {/* Global Vision Card */}
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="bg-gradient-to-br from-stone-600 to-stone-700 p-4">
              <div className="flex items-center gap-2 text-white mb-2">
                <Globe className="h-5 w-5" />
                <h2 className="font-bold text-sm">{txt.globalTitle}</h2>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-stone-600 text-sm leading-relaxed mb-3">{txt.globalText}</p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase">{txt.values}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[txt.value1, txt.value2, txt.value3, txt.value4].map((value, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberUnity;
