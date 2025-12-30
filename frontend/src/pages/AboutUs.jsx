import React from 'react';
import { Users, Target, Heart, Award, Eye, Compass, Lightbulb, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { boardTranslations } from '../data/translations';

const AboutUs = () => {
  const { t, language, isRTL } = useLanguage();
  const boardMembers = boardTranslations[language] || boardTranslations.sv;

  const content = {
    sv: {
      pageTitle: 'Om Oss',
      pageHeading: 'Haggai Sweden',
      pageDescription: 'Vi är en del av det globala Haggai International-nätverket och arbetar för att stärka kyrkoledare i Sverige genom utbildning och gemenskap.',
      
      // Vision & Mission
      visionTitle: 'Haggais Vision',
      visionText: 'Återlösning och förändring av varje nation genom Jesu Kristi evangelium.',
      
      missionTitle: 'Haggais Uppdrag',
      missionText: 'Att utrusta och inspirera strategiskt placerade ledare att mer effektivt presentera och leva ut Jesu Kristi evangelium, och att förbereda andra att göra detsamma.',
      
      // Strategy
      strategyTitle: 'Haggais Strategi',
      strategyItems: [
        'Betona "hur" man evangeliserar',
        'Rikta in sig på affärsledare, yrkesverksamma och trovärdiga, kompetenta religiösa ledare inom strategiska områden, inklusive länder som är stängda för traditionell evangelisation',
        'Välja facilitatorer, särskilt från Asien, Afrika och Latinamerika, som är experter med ständigt förnyad "praktisk" erfarenhet av evangelisation',
        'Kräva att facilitatorer utvecklar sitt eget innovativa och kulturellt relevanta material enligt läroplanens riktlinjer',
        'Använda mycket interaktiva och motiverande undervisnings- och inlärningsmetoder',
        'Motivera ledare att utveckla andras färdigheter inom trosgemenskapen genom att överföra vad de har lärt sig. Detta är multiplikatoreffekten som producerar enorm tillväxt i evangelisationsprocessen',
        'Förbereda ledare att utveckla tjänsteresurser i sina länder med hjälp av bibliska principer om förvaltarskap'
      ],
      
      // Approach
      approachTitle: 'Haggais Tillvägagångssätt',
      approachItems: [
        { title: 'Börja inifrån', desc: 'Utbilda tjänare från hemlandet. Betona nationellt ledarskap.' },
        { title: 'Börja från toppen', desc: 'Rikta in sig på nyckelledare. Sträva efter kvalitet.' },
        { title: 'Utveckla ledarskapsförmågor', desc: 'Ledarskap gör hela skillnaden. Betona karaktär och disciplin.' },
        { title: 'Betona hur man evangeliserar', desc: 'Undvik marginella problem. Praktisk utbildning. Tänd en eld, inte bara ett ljus.' },
        { title: 'Fokusera på de som inte nåtts', desc: 'Nå de onåbara. Utveckla ett globalt perspektiv.' },
        { title: 'Arbeta genom kyrkan', desc: 'Inifrån kyrkan, inte utifrån. Respektera konfessionella skillnader.' },
        { title: 'Utveckla inhemska resurser', desc: 'Lära ut hur man fiskar. Betona förvaltarskapets koncept.' },
        { title: 'Använd multiplikatoreffekten', desc: 'Investera och multiplicera. Utbilda ledare att utbilda andra.' },
        { title: 'Uppnå paradigmskiften', desc: 'Var öppen för förändring. Internationell lärandegemenskap.' },
        { title: 'Förlita sig på den Helige Ande', desc: 'Sätt höga mål.' }
      ],
      
      // Other sections
      globalNetwork: 'Del av ett globalt nätverk',
      globalNetworkText: 'Haggai International grundades 1969 och har sedan dess utbildat över 120,000 ledare i mer än 185 länder. Haggai Sweden är stolta att vara en del av detta globala nätverk.',
      trainedLeaders: 'Utbildade ledare globalt',
      countries: 'Länder',
      yearsExperience: 'År av erfarenhet',
      board: 'Vår Styrelse',
      boardSubtitle: 'Engagerade ledare som driver Haggai Sweden framåt',
      whoWeServe: 'Vilka vi tjänar',
      whoWeServeSubtitle: 'Våra program riktar sig till:',
      individuals: 'Individer',
      individualsDesc: 'Personer med vision och ledarförmåga som vill utvecklas',
      churches: 'Kyrkor & Församlingar',
      churchesDesc: 'Alla kyrkor oavsett samfund eller inriktning',
      organizations: 'Organisationer',
      organizationsDesc: 'Kristna organisationer och nätverk som vill stärka sitt ledarskap'
    },
    en: {
      pageTitle: 'About Us',
      pageHeading: 'Haggai Sweden',
      pageDescription: 'We are part of the global Haggai International network and work to strengthen church leaders in Sweden through training and fellowship.',
      
      visionTitle: 'Haggai Vision',
      visionText: 'Redemption and transformation of every nation through the Gospel of Jesus Christ.',
      
      missionTitle: 'Haggai Mission',
      missionText: 'To equip and inspire strategically placed leaders to more effectively present and live out the Gospel of Jesus Christ, and to prepare others to do the same.',
      
      strategyTitle: 'Haggai Strategy',
      strategyItems: [
        'Emphasize "how" to evangelize',
        'Target business executives, professionals, and credible, competent religious leaders within strategic areas, including countries closed to traditional evangelism',
        'Select facilitators, especially from Asia, Africa, and Latin America, who are experts with constantly renewed "practical" experience in evangelism',
        'Require facilitators to develop their own innovative and culturally relevant materials according to curriculum guidelines',
        'Use highly interactive and motivating teaching-learning methods',
        'Motivate leaders to develop others\' skills within the community of believers by transferring what they have learned. This is the multiplier effect that produces tremendous growth in the evangelism process',
        'Prepare leaders to develop ministry resources in their countries using biblical principles of stewardship'
      ],
      
      approachTitle: 'Haggai Approach',
      approachItems: [
        { title: 'Start from within', desc: 'Train servants from the homeland. Emphasize national leadership.' },
        { title: 'Start from the top', desc: 'Target key leaders. Strive for quality.' },
        { title: 'Develop leadership skills', desc: 'Leadership makes all the difference. Emphasize character and discipline.' },
        { title: 'Emphasize how to evangelize', desc: 'Avoid marginal issues. Practical training. Light a fire, not just a light.' },
        { title: 'Focus on the unreached', desc: 'Reach the unreachable. Develop a global perspective.' },
        { title: 'Work through the church', desc: 'From within the church, not from outside. Respect denominational differences.' },
        { title: 'Develop indigenous resources', desc: 'Teach how to fish. Emphasize the concept of stewardship.' },
        { title: 'Use the multiplier effect', desc: 'Invest and multiply. Train leaders to train others.' },
        { title: 'Achieve paradigm shifts', desc: 'Be open to change. International learning community.' },
        { title: 'Rely on the Holy Spirit', desc: 'Set high goals.' }
      ],
      
      globalNetwork: 'Part of a global network',
      globalNetworkText: 'Haggai International was founded in 1969 and has since trained over 120,000 leaders in more than 185 countries. Haggai Sweden is proud to be part of this global network.',
      trainedLeaders: 'Trained leaders globally',
      countries: 'Countries',
      yearsExperience: 'Years of experience',
      board: 'Our Board',
      boardSubtitle: 'Dedicated leaders driving Haggai Sweden forward',
      whoWeServe: 'Who we serve',
      whoWeServeSubtitle: 'Our programs are aimed at:',
      individuals: 'Individuals',
      individualsDesc: 'People with vision and leadership ability who want to develop',
      churches: 'Churches & Congregations',
      churchesDesc: 'All churches regardless of denomination or direction',
      organizations: 'Organizations',
      organizationsDesc: 'Christian organizations and networks that want to strengthen their leadership'
    },
    ar: {
      pageTitle: 'من نحن',
      pageHeading: 'هجاي السويد',
      pageDescription: 'نحن جزء من شبكة هجاي الدولية العالمية ونعمل على تقوية قادة الكنائس في السويد من خلال التدريب والشركة.',
      
      visionTitle: 'رؤية حجاي',
      visionText: 'افتداء وتغيير كل أمة من خلال إنجيل يسوع المسيح.',
      
      missionTitle: 'رسالة حجاي',
      missionText: 'تجهيز وإلهام قادة ذو مكانة إستراتيجية للقيام بتقديم إنجيل يسوع المسيح وإظهاره فى الحياة بأكثر فاعلية، وإعداد آخرين للقيام بنفس الشيء.',
      
      strategyTitle: 'استراتيجية حجاي',
      strategyItems: [
        'التأكيد على «كيفية» الكرازة',
        'استهداف مديري الأعمال والمهنيين والقادة الدينيين ذوي المصداقية والكفاءة داخل المناطق الإستراتيجية، بما في ذلك البلدان المغلقة أمام الكرازة التقليدية',
        'اختيار الميسِّرين، خاصة من آسيا وأفريقيا وأمريكا اللاتينية، والذين هم خبراء يتمتَّعون بخبرات «عملية» متجدِّدة باستمرار في الكرازة',
        'مطالبة الميسِّرين بإنشاء وتطوير مواد خاصة بهم تتميَّز بالابتكار والملاءمة الثقافية وفقًا للإرشادات الموضوعة للمناهج',
        'استخدام أساليب تدريس - تعلم ذات قدر عالي من التفاعل والتحفيز',
        'تحفيز القادة على تطوير مهارات الآخرين داخل مجتمع المؤمنين من خلال نقْل ما قد تعلَّموه. هذا هو التأثير المضاعف الذي ينتج نموًا هائلاً داخل عملية الكرازة',
        'إعداد القادة لتطوير موارد الخدمة في بلدانهم باستخدام مبادئ الكتاب المقدس حول الوكالة'
      ],
      
      approachTitle: 'نهج حجاي',
      approachItems: [
        { title: 'البدء من الداخل', desc: 'تدريب الخدام من داخل الوطن. التأكيد على القيادة الوطنية.' },
        { title: 'البدء من القمة', desc: 'استهداف القادة الرئيسيين/المفتاحيين. السعي نحو الجودة.' },
        { title: 'تطوير مهارات القيادة', desc: 'القيادة تصنع كل الفَرق. التأكيد على الشخصية والانضباط.' },
        { title: 'التأكيد على كيفية الكرازة', desc: 'تجنُّب المشكلات الهامشية. التدريب العملي. إطلاق شعلة، لا مجرد نور.' },
        { title: 'التركيز على مَن لم تصل إليهم الكرازة', desc: 'الوصول إلى الذين يتعذَّر الوصول إليهم. تطوير المنظور الكوني.' },
        { title: 'العمل من خلال الكنيسة', desc: 'من داخل الكنيسة وليس من خارجها. احترام الاختلافات الطائفية.' },
        { title: 'تطوير الموارد الأصلية', desc: 'تعليم كيفية الصيد. التأكيد على مفهوم الوكالة.' },
        { title: 'استخدام تأثير المضاعفة', desc: 'الاستثمار والمضاعفة. تدريب القادة على تدريب الآخرين.' },
        { title: 'تحقيق نقلات نوعية فكرية', desc: 'الانفتاح على التغيير. مجتمع التعلُّم الدولي.' },
        { title: 'الاعتماد على الروح القدس', desc: 'وضْع أهداف عالية.' }
      ],
      
      globalNetwork: 'جزء من شبكة عالمية',
      globalNetworkText: 'تأسست هجاي الدولية في عام 1969 ومنذ ذلك الحين درَّبت أكثر من 120,000 قائد في أكثر من 185 دولة. هجاي السويد فخورة بأن تكون جزءاً من هذه الشبكة العالمية.',
      trainedLeaders: 'قادة مدربون عالمياً',
      countries: 'دولة',
      yearsExperience: 'سنوات من الخبرة',
      board: 'مجلس الإدارة',
      boardSubtitle: 'قادة ملتزمون يقودون هجاي السويد للأمام',
      whoWeServe: 'من نخدم',
      whoWeServeSubtitle: 'برامجنا موجهة إلى:',
      individuals: 'الأفراد',
      individualsDesc: 'الأشخاص ذوو الرؤية والقدرة القيادية الذين يريدون التطور',
      churches: 'الكنائس والجماعات',
      churchesDesc: 'جميع الكنائس بغض النظر عن الطائفة أو التوجه',
      organizations: 'المنظمات',
      organizationsDesc: 'المنظمات والشبكات المسيحية التي تريد تقوية قيادتها'
    }
  };

  const txt = content[language] || content.sv;

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <span className="text-haggai font-medium text-sm tracking-wider uppercase mb-4 block">{txt.pageTitle}</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">{txt.pageHeading}</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {txt.pageDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vision */}
            <Card className="border-0 shadow-xl bg-haggai text-cream-50 overflow-hidden">
              <CardContent className={`p-10 ${isRTL ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-cream-50/20 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                  <Eye className="h-8 w-8 text-cream-50" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{txt.visionTitle}</h2>
                <p className="text-xl text-haggai-100 leading-relaxed">
                  {txt.visionText}
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-0 shadow-xl bg-haggai-dark text-cream-50 overflow-hidden">
              <CardContent className={`p-10 ${isRTL ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-cream-50/20 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                  <Target className="h-8 w-8 text-cream-50" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{txt.missionTitle}</h2>
                <p className="text-xl text-haggai-100 leading-relaxed">
                  {txt.missionText}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="py-24 bg-haggai-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <div className={`w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
              <Compass className="h-8 w-8 text-cream-50" />
            </div>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{txt.strategyTitle}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {txt.strategyItems.map((item, index) => (
              <div key={index} className={`flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg ${isRTL ? 'space-x-reverse flex-row-reverse text-right' : ''}`}>
                <div className="w-10 h-10 bg-haggai rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-cream-50 font-bold">{index + 1}</span>
                </div>
                <p className="text-stone-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <div className={`w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
              <Lightbulb className="h-8 w-8 text-cream-50" />
            </div>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{txt.approachTitle}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {txt.approachItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <div className={`w-8 h-8 bg-haggai-100 rounded-full flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                      <span className="text-haggai font-bold text-sm">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800">{item.title}</h3>
                  </div>
                  <p className="text-stone-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Stats */}
      <section className="py-24 bg-haggai-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl mx-auto text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-6">{txt.globalNetwork}</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              {txt.globalNetworkText}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-haggai">120K+</span>
                <p className="text-stone-600 mt-2">{txt.trainedLeaders}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-haggai">185+</span>
                <p className="text-stone-600 mt-2">{txt.countries}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-haggai">50+</span>
                <p className="text-stone-600 mt-2">{txt.yearsExperience}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{txt.board}</h2>
            <p className="text-lg text-stone-600">{txt.boardSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-haggai-100 to-haggai-50 flex items-center justify-center">
                    <div className="w-24 h-24 bg-haggai rounded-full flex items-center justify-center">
                      <Users className="h-12 w-12 text-cream-50" />
                    </div>
                  </div>
                  <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                    <h3 className="text-lg font-semibold text-stone-800 mb-1">{member.name}</h3>
                    <p className="text-haggai text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-stone-600 text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 bg-haggai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-cream-50 mb-4">{txt.whoWeServe}</h2>
            <p className="text-haggai-200 text-lg">{txt.whoWeServeSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`bg-haggai/50 backdrop-blur rounded-2xl p-8 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-haggai-light rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                <Users className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">{txt.individuals}</h3>
              <p className="text-haggai-200">{txt.individualsDesc}</p>
            </div>
            <div className={`bg-haggai/50 backdrop-blur rounded-2xl p-8 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-haggai-light rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                <Award className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">{txt.churches}</h3>
              <p className="text-haggai-200">{txt.churchesDesc}</p>
            </div>
            <div className={`bg-haggai/50 backdrop-blur rounded-2xl p-8 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-haggai-light rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                <Target className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">{txt.organizations}</h3>
              <p className="text-haggai-200">{txt.organizationsDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
