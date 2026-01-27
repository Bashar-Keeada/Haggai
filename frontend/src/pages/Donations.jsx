import React, { useState } from 'react';
import { Heart, Smartphone, Building2, Repeat, Gift, Users, BookOpen, Target, Globe, CheckCircle, Copy, Check, PenLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const Donations = () => {
  const { language, isRTL } = useLanguage();
  const [copiedField, setCopiedField] = useState(null);
  const [selectedOneTime, setSelectedOneTime] = useState(null);
  const [selectedRecurring, setSelectedRecurring] = useState(null);
  const [customOneTime, setCustomOneTime] = useState('');
  const [customRecurring, setCustomRecurring] = useState('');
  const [showCustomOneTime, setShowCustomOneTime] = useState(false);
  const [showCustomRecurring, setShowCustomRecurring] = useState(false);

  const txt = {
    sv: {
      pageTitle: 'Stöd Vårt Arbete',
      pageSubtitle: 'Tillsammans stärker vi ledare som förändrar världen',
      pageDescription: 'Din gåva gör det möjligt för oss att utrusta och stärka ledare som kan få kunskap, ta ansvar, agera och påverka sina samhällen.',
      
      // Donation options
      oneTime: 'Engångsgåva',
      oneTimeDesc: 'Ge en gåva när du vill',
      recurring: 'Regelbunden gåva',
      recurringDesc: 'Stöd oss månadsvis',
      
      // Payment methods
      paymentMethods: 'Betalningsalternativ',
      swish: 'Swish',
      swishDesc: 'Snabbt och enkelt via din mobil',
      swishNumber: '070 782 50 82',
      swishInstructions: 'Öppna Swish-appen och ange numret ovan',
      
      bankTransfer: 'Banköverföring',
      bankTransferDesc: 'För större gåvor eller regelbundna överföringar',
      bankName: 'Banknamn',
      bankNameValue: 'Swedbank',
      accountNumber: 'Kontonummer',
      accountNumberValue: '1234-5 678 901 234-5',
      iban: 'IBAN',
      ibanValue: 'SE12 3456 7890 1234 5678 9012',
      bic: 'BIC/SWIFT',
      bicValue: 'SWEDSESS',
      reference: 'Referens',
      referenceValue: 'Gåva + ditt namn',
      
      copyToClipboard: 'Kopiera',
      copied: 'Kopierat!',
      
      // Impact section
      yourImpact: 'Din gåva gör skillnad',
      impactItems: [
        {
          icon: 'BookOpen',
          title: 'Kunskap',
          description: 'Utbildar ledare i ledarskap, evangelisation och förvaltarskap'
        },
        {
          icon: 'Target',
          title: 'Ansvar',
          description: 'Utrusta ledare att ta ansvar i sina församlingar och samhällen'
        },
        {
          icon: 'Users',
          title: 'Handling',
          description: 'Stödjer ledare att agera och skapa förändring'
        },
        {
          icon: 'Globe',
          title: 'Påverkan',
          description: 'Möjliggör för ledare att påverka och nå ut globalt'
        }
      ],
      
      // Suggested amounts
      suggestedAmounts: 'Föreslagna belopp',
      perMonth: '/månad',
      
      // Thank you
      thankYou: 'Tack för ditt stöd!',
      thankYouDesc: 'Varje gåva, stor som liten, gör skillnad för vårt arbete att stärka ledare världen över.',
      
      // Contact
      questions: 'Frågor om gåvor?',
      contactUs: 'Kontakta oss'
    },
    en: {
      pageTitle: 'Support Our Work',
      pageSubtitle: 'Together we strengthen leaders who change the world',
      pageDescription: 'Your gift makes it possible for us to equip and strengthen leaders who can gain knowledge, take responsibility, act and influence their communities.',
      
      oneTime: 'One-time Gift',
      oneTimeDesc: 'Give a gift when you want',
      recurring: 'Regular Gift',
      recurringDesc: 'Support us monthly',
      
      paymentMethods: 'Payment Options',
      swish: 'Swish',
      swishDesc: 'Quick and easy via your mobile',
      swishNumber: '070 782 50 82',
      swishInstructions: 'Open the Swish app and enter the number above',
      
      bankTransfer: 'Bank Transfer',
      bankTransferDesc: 'For larger gifts or regular transfers',
      bankName: 'Bank Name',
      bankNameValue: 'Swedbank',
      accountNumber: 'Account Number',
      accountNumberValue: '1234-5 678 901 234-5',
      iban: 'IBAN',
      ibanValue: 'SE12 3456 7890 1234 5678 9012',
      bic: 'BIC/SWIFT',
      bicValue: 'SWEDSESS',
      reference: 'Reference',
      referenceValue: 'Gift + your name',
      
      copyToClipboard: 'Copy',
      copied: 'Copied!',
      
      yourImpact: 'Your Gift Makes a Difference',
      impactItems: [
        {
          icon: 'BookOpen',
          title: 'Knowledge',
          description: 'Educates leaders in leadership, evangelism and stewardship'
        },
        {
          icon: 'Target',
          title: 'Responsibility',
          description: 'Equips leaders to take responsibility in their churches and communities'
        },
        {
          icon: 'Users',
          title: 'Action',
          description: 'Supports leaders to act and create change'
        },
        {
          icon: 'Globe',
          title: 'Influence',
          description: 'Enables leaders to influence and reach out globally'
        }
      ],
      
      suggestedAmounts: 'Suggested Amounts',
      perMonth: '/month',
      
      thankYou: 'Thank You for Your Support!',
      thankYouDesc: 'Every gift, big or small, makes a difference for our work to strengthen leaders worldwide.',
      
      questions: 'Questions about donations?',
      contactUs: 'Contact us'
    },
    ar: {
      pageTitle: 'ادعم عملنا',
      pageSubtitle: 'معًا نقوي القادة الذين يغيرون العالم',
      pageDescription: 'هديتك تمكننا من تجهيز وتقوية القادة الذين يمكنهم اكتساب المعرفة وتحمل المسؤولية والتصرف والتأثير في مجتمعاتهم.',
      
      oneTime: 'هدية لمرة واحدة',
      oneTimeDesc: 'قدم هدية عندما تريد',
      recurring: 'هدية منتظمة',
      recurringDesc: 'ادعمنا شهريًا',
      
      paymentMethods: 'خيارات الدفع',
      swish: 'سويش',
      swishDesc: 'سريع وسهل عبر هاتفك المحمول',
      swishNumber: '070 782 50 82',
      swishInstructions: 'افتح تطبيق سويش وأدخل الرقم أعلاه',
      
      bankTransfer: 'تحويل بنكي',
      bankTransferDesc: 'للهدايا الكبيرة أو التحويلات المنتظمة',
      bankName: 'اسم البنك',
      bankNameValue: 'سويدبانك',
      accountNumber: 'رقم الحساب',
      accountNumberValue: '1234-5 678 901 234-5',
      iban: 'آيبان',
      ibanValue: 'SE12 3456 7890 1234 5678 9012',
      bic: 'بيك/سويفت',
      bicValue: 'SWEDSESS',
      reference: 'المرجع',
      referenceValue: 'هدية + اسمك',
      
      copyToClipboard: 'نسخ',
      copied: 'تم النسخ!',
      
      yourImpact: 'هديتك تصنع فرقًا',
      impactItems: [
        {
          icon: 'BookOpen',
          title: 'المعرفة',
          description: 'تعليم القادة في القيادة والتبشير والإشراف'
        },
        {
          icon: 'Target',
          title: 'المسؤولية',
          description: 'تجهيز القادة لتحمل المسؤولية في كنائسهم ومجتمعاتهم'
        },
        {
          icon: 'Users',
          title: 'العمل',
          description: 'دعم القادة للتصرف وخلق التغيير'
        },
        {
          icon: 'Globe',
          title: 'التأثير',
          description: 'تمكين القادة من التأثير والوصول عالميًا'
        }
      ],
      
      suggestedAmounts: 'المبالغ المقترحة',
      perMonth: '/شهر',
      
      thankYou: 'شكرًا لدعمك!',
      thankYouDesc: 'كل هدية، كبيرة أو صغيرة، تصنع فرقًا في عملنا لتقوية القادة في جميع أنحاء العالم.',
      
      questions: 'أسئلة حول التبرعات؟',
      contactUs: 'اتصل بنا'
    }
  }[language] || {}.sv;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(txt.copied);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const suggestedAmounts = [
    { amount: 100, description: language === 'sv' ? 'Utbildningsmaterial' : language === 'ar' ? 'مواد تعليمية' : 'Educational materials' },
    { amount: 250, description: language === 'sv' ? 'En ledarskapsbok' : language === 'ar' ? 'كتاب قيادة' : 'A leadership book' },
    { amount: 500, description: language === 'sv' ? 'En dags utbildning' : language === 'ar' ? 'يوم تدريب' : 'One day of training' },
    { amount: 1000, description: language === 'sv' ? 'Mentorskap för en ledare' : language === 'ar' ? 'إرشاد قائد' : 'Mentorship for a leader' }
  ];

  const IconComponent = ({ name }) => {
    const icons = {
      BookOpen: BookOpen,
      Target: Target,
      Users: Users,
      Globe: Globe
    };
    const Icon = icons[name] || Heart;
    return <Icon className="h-8 w-8" />;
  };

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="py-24 text-white" style={{ background: 'linear-gradient(to bottom right, #15564e, #0f403a, #0f403a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <span className="text-white/70 font-medium text-sm tracking-wider uppercase">{language === 'sv' ? 'Ge en gåva' : language === 'ar' ? 'قدم هدية' : 'Make a Gift'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {txt.pageTitle}
            </h1>
            <p className="text-xl text-white/90 mb-4">
              {txt.pageSubtitle}
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              {txt.pageDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Swish Card */}
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" />
              <CardHeader className={`pb-4 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{txt.swish}</CardTitle>
                    <p className="text-stone-500">{txt.swishDesc}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={isRTL ? 'text-right' : ''}>
                <div className="bg-green-50 rounded-2xl p-6 text-center mb-4">
                  <p className="text-sm text-stone-500 mb-2">{language === 'sv' ? 'Swish-nummer' : language === 'ar' ? 'رقم سويش' : 'Swish Number'}</p>
                  <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <p className="text-3xl font-bold text-green-700 tracking-wider">{txt.swishNumber}</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard('0707825082', 'swish')}
                      className="text-green-600 border-green-300 hover:bg-green-100"
                    >
                      {copiedField === 'swish' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-stone-600 text-center">{txt.swishInstructions}</p>
                
                {/* Swish QR placeholder */}
                <div className="mt-6 flex justify-center">
                  <div className="w-32 h-32 bg-stone-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone className="h-8 w-8 text-stone-400 mx-auto mb-1" />
                      <p className="text-xs text-stone-400">QR-kod</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Transfer Card */}
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
              <CardHeader className={`pb-4 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{txt.bankTransfer}</CardTitle>
                    <p className="text-stone-500">{txt.bankTransferDesc}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={isRTL ? 'text-right' : ''}>
                <div className="space-y-3">
                  {[
                    { label: txt.bankName, value: txt.bankNameValue, key: 'bank' },
                    { label: txt.accountNumber, value: txt.accountNumberValue, key: 'account' },
                    { label: txt.iban, value: txt.ibanValue, key: 'iban' },
                    { label: txt.bic, value: txt.bicValue, key: 'bic' },
                    { label: txt.reference, value: txt.referenceValue, key: 'ref' }
                  ].map((item) => (
                    <div key={item.key} className={`flex items-center justify-between p-3 bg-stone-50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="text-xs text-stone-500">{item.label}</p>
                        <p className="font-medium text-stone-800">{item.value}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(item.value.replace(/\s/g, ''), item.key)}
                        className="text-stone-400 hover:text-blue-600"
                      >
                        {copiedField === item.key ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* One-time */}
            <Card className={`border-2 border-haggai-100 hover:border-haggai transition-all cursor-pointer group ${isRTL ? 'text-right' : ''}`}>
              <CardContent className="p-8">
                <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-haggai-100 rounded-2xl flex items-center justify-center group-hover:bg-haggai transition-all">
                    <Gift className="h-7 w-7 text-haggai group-hover:text-white transition-all" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">{txt.oneTime}</h3>
                    <p className="text-stone-500">{txt.oneTimeDesc}</p>
                  </div>
                </div>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                  {suggestedAmounts.map((item) => (
                    <button
                      key={item.amount}
                      onClick={() => {
                        setSelectedOneTime(item.amount);
                        setCustomOneTime('');
                        setShowCustomOneTime(false);
                      }}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedOneTime === item.amount
                          ? 'bg-haggai text-white'
                          : 'bg-haggai-50 text-haggai hover:bg-haggai-100'
                      }`}
                    >
                      {item.amount} kr
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomOneTime(!showCustomOneTime)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      showCustomOneTime
                        ? 'bg-haggai text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <PenLine className="h-4 w-4 inline mr-2" />
                    {language === 'sv' ? 'Annat belopp' : language === 'ar' ? 'مبلغ آخر' : 'Custom amount'}
                  </button>
                </div>
                
                {showCustomOneTime && (
                  <div className="mt-4">
                    <Input
                      type="number"
                      value={customOneTime}
                      onChange={(e) => {
                        setCustomOneTime(e.target.value);
                        setSelectedOneTime(null);
                      }}
                      placeholder={language === 'sv' ? 'Ange belopp (kr)' : language === 'ar' ? 'أدخل المبلغ (كرون)' : 'Enter amount (SEK)'}
                      className="max-w-xs"
                      min="1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recurring */}
            <Card className={`border-2 border-violet-100 hover:border-violet-500 transition-all cursor-pointer group ${isRTL ? 'text-right' : ''}`}>
              <CardContent className="p-8">
                <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center group-hover:bg-violet-500 transition-all">
                    <Repeat className="h-7 w-7 text-violet-600 group-hover:text-white transition-all" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">{txt.recurring}</h3>
                    <p className="text-stone-500">{txt.recurringDesc}</p>
                  </div>
                </div>
                <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                  {[100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedRecurring(amount);
                        setCustomRecurring('');
                        setShowCustomRecurring(false);
                      }}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedRecurring === amount
                          ? 'bg-violet-600 text-white'
                          : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
                      }`}
                    >
                      {amount} kr{txt.perMonth}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowCustomRecurring(!showCustomRecurring)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      showCustomRecurring
                        ? 'bg-violet-600 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <PenLine className="h-4 w-4 inline mr-2" />
                    {language === 'sv' ? 'Annat belopp' : language === 'ar' ? 'مبلغ آخر' : 'Custom amount'}
                  </button>
                </div>
                
                {showCustomRecurring && (
                  <div className="mt-4">
                    <Input
                      type="number"
                      value={customRecurring}
                      onChange={(e) => {
                        setCustomRecurring(e.target.value);
                        setSelectedRecurring(null);
                      }}
                      placeholder={language === 'sv' ? 'Ange belopp (kr)' : language === 'ar' ? 'أدخل المبلغ (كرون)' : 'Enter amount (SEK)'}
                      className="max-w-xs"
                      min="1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{txt.yourImpact}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {txt.impactItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-haggai-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-haggai">
                    <IconComponent name={item.icon} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Suggested Amounts */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className={`text-2xl font-bold text-stone-800 mb-8 ${isRTL ? 'text-right' : 'text-center'}`}>
            {txt.suggestedAmounts}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedAmounts.map((item) => (
              <Card key={item.amount} className="border-2 border-stone-100 hover:border-haggai transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-haggai mb-2">{item.amount} kr</p>
                  <p className="text-sm text-stone-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-24 text-white" style={{ backgroundColor: '#0f403a' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-white/60 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-white">{txt.thankYou}</h2>
          <p className="text-white/80 text-lg mb-8">
            {txt.thankYouDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/kontakt">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-stone-800">
                {txt.questions} {txt.contactUs}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donations;
