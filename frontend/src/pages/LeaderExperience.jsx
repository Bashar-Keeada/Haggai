import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, Globe, ChevronRight,
  Sparkles, Briefcase, Church, Award, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { leaderExperiences, targetGroups } from '../data/mock';

const LeaderExperience = () => {
  const { t, language, isRTL } = useLanguage();

  const getIcon = (iconName) => {
    const icons = {
      Church: Church,
      Sparkles: Sparkles,
      Briefcase: Briefcase,
      Globe: Globe
    };
    return icons[iconName] || Users;
  };

  const getColorClasses = (color) => {
    const colors = {
      rose: 'bg-rose-100 text-rose-800 border-rose-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      violet: 'bg-violet-100 text-violet-800 border-violet-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[color] || colors.amber;
  };

  const getBgColorClasses = (color) => {
    const colors = {
      rose: 'bg-rose-600',
      blue: 'bg-blue-600',
      emerald: 'bg-emerald-600',
      violet: 'bg-violet-600',
      amber: 'bg-amber-600'
    };
    return colors[color] || colors.amber;
  };

  const translations = {
    sv: {
      pageTitle: 'Haggai Leader Experience',
      pageSubtitle: 'Internationella & Nationella Program',
      pageDescription: 'Transformerande ledarprogram för dig som redan har en ledande roll i kyrkan eller samhället. Våra program ger dig verktyg, nätverk och inspiration att maximera din påverkan.',
      requirements: 'Krav för deltagande',
      requirementsText: 'Du måste redan ha en ledande roll i kyrkan, samhället eller näringslivet för att kvalificera dig till våra program.',
      targetGroups: 'Våra Målgrupper',
      targetGroupsSubtitle: 'Vi utrustar ledare från olika samhällssektorer',
      internationalPrograms: 'Internationella Program',
      nationalPrograms: 'Nationella Program',
      duration: 'Längd',
      period: 'Period',
      location: 'Plats',
      language: 'Språk',
      ageRequirement: 'Ålderskrav',
      spotsLeft: 'platser kvar',
      applyNow: 'Ansök Nu',
      learnMore: 'Läs mer',
      arabic: 'Arabiska',
      english: 'Engelska',
      swedish: 'Svenska',
      women: 'Kvinnor',
      men: 'Män',
      all: 'Alla',
      ctaTitle: 'Redo för din Leader Experience?',
      ctaDescription: 'Ta första steget mot att maximera din ledarskapsförmåga och påverkan.'
    },
    en: {
      pageTitle: 'Haggai Leader Experience',
      pageSubtitle: 'International & National Programs',
      pageDescription: 'Transformative leadership programs for those who already have a leadership role in the church or society. Our programs provide tools, networks and inspiration to maximize your impact.',
      requirements: 'Requirements for Participation',
      requirementsText: 'You must already have a leadership role in the church, society or business to qualify for our programs.',
      targetGroups: 'Our Target Groups',
      targetGroupsSubtitle: 'We equip leaders from various sectors of society',
      internationalPrograms: 'International Programs',
      nationalPrograms: 'National Programs',
      duration: 'Duration',
      period: 'Period',
      location: 'Location',
      language: 'Language',
      ageRequirement: 'Age Requirement',
      spotsLeft: 'spots left',
      applyNow: 'Apply Now',
      learnMore: 'Learn more',
      arabic: 'Arabic',
      english: 'English',
      swedish: 'Swedish',
      women: 'Women',
      men: 'Men',
      all: 'All',
      ctaTitle: 'Ready for your Leader Experience?',
      ctaDescription: 'Take the first step towards maximizing your leadership ability and impact.'
    },
    ar: {
      pageTitle: 'تجربة هجاي للقيادة',
      pageSubtitle: 'البرامج الدولية والوطنية',
      pageDescription: 'برامج قيادية تحويلية لأولئك الذين لديهم بالفعل دور قيادي في الكنيسة أو المجتمع. توفر برامجنا الأدوات والشبكات والإلهام لتعظيم تأثيرك.',
      requirements: 'متطلبات المشاركة',
      requirementsText: 'يجب أن يكون لديك بالفعل دور قيادي في الكنيسة أو المجتمع أو الأعمال للتأهل لبرامجنا.',
      targetGroups: 'فئاتنا المستهدفة',
      targetGroupsSubtitle: 'نجهز القادة من مختلف قطاعات المجتمع',
      internationalPrograms: 'البرامج الدولية',
      nationalPrograms: 'البرامج الوطنية',
      duration: 'المدة',
      period: 'الفترة',
      location: 'الموقع',
      language: 'اللغة',
      ageRequirement: 'شرط العمر',
      spotsLeft: 'أماكن متبقية',
      applyNow: 'قدم الآن',
      learnMore: 'اقرأ المزيد',
      arabic: 'العربية',
      english: 'الإنجليزية',
      swedish: 'السويدية',
      women: 'النساء',
      men: 'الرجال',
      all: 'الجميع',
      ctaTitle: 'مستعد لتجربة القيادة الخاصة بك؟',
      ctaDescription: 'اتخذ الخطوة الأولى نحو تعظيم قدرتك القيادية وتأثيرك.'
    }
  };

  const txt = translations[language] || translations.sv;

  const getLanguageLabel = (lang) => {
    const labels = {
      arabic: txt.arabic,
      english: txt.english,
      swedish: txt.swedish
    };
    return labels[lang] || lang;
  };

  const getGenderLabel = (gender) => {
    const labels = {
      women: txt.women,
      men: txt.men,
      all: txt.all
    };
    return labels[gender] || gender;
  };

  const internationalPrograms = leaderExperiences.filter(p => p.type === 'international');
  const nationalPrograms = leaderExperiences.filter(p => p.type === 'national');

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-4xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 text-sm px-4 py-2">
              Haggai International
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6">
              {txt.pageTitle}
            </h1>
            <p className="text-2xl text-amber-700 font-medium mb-4">{txt.pageSubtitle}</p>
            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              {txt.pageDescription}
            </p>
            
            {/* Requirements Box */}
            <div className="bg-amber-700 text-cream-50 rounded-2xl p-6 shadow-xl">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-cream-50/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{txt.requirements}</h3>
                  <p className="text-cream-100">{txt.requirementsText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Groups */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{txt.targetGroups}</h2>
            <p className="text-lg text-stone-600">{txt.targetGroupsSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetGroups.map((group) => {
              const Icon = getIcon(group.icon);
              return (
                <Card key={group.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-700 transition-colors ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                      <Icon className="h-7 w-7 text-amber-700 group-hover:text-cream-50 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 mb-2">{group.title[language]}</h3>
                    <p className="text-stone-600 text-sm">{group.description[language]}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* International Programs */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-stone-800 mb-12 ${isRTL ? 'text-right' : ''}`}>
            {txt.internationalPrograms}
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {internationalPrograms.map((program) => (
              <Card key={program.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
                <div className={`h-3 ${getBgColorClasses(program.color)}`} />
                <CardHeader className={`pb-4 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-3 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Badge className={getColorClasses(program.color)}>
                      {getGenderLabel(program.targetGender)}
                    </Badge>
                    <Badge variant="outline" className="border-stone-300">
                      {getLanguageLabel(program.language)}
                    </Badge>
                    {program.ageRange && (
                      <Badge variant="outline" className="border-stone-300">
                        {program.ageRange} {language === 'sv' ? 'år' : language === 'ar' ? 'سنة' : 'years'}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-stone-800">
                    {program.title[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`flex-1 flex flex-col ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-stone-600 mb-6 leading-relaxed">{program.description[language]}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Clock className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span><strong>{txt.duration}:</strong> {program.duration[language]}</span>
                    </div>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Calendar className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span><strong>{txt.period}:</strong> {program.period[language]}</span>
                    </div>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <MapPin className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span><strong>{txt.location}:</strong> {program.location[language]}</span>
                    </div>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Users className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span><strong>{program.spotsLeft}</strong> {txt.spotsLeft}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Link to={`/leader-experience/${program.id}`}>
                      <Button className={`w-full bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {txt.applyNow}
                        <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* National Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-stone-800 mb-12 ${isRTL ? 'text-right' : ''}`}>
            {txt.nationalPrograms}
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {nationalPrograms.map((program) => (
              <Card key={program.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`h-3 ${getBgColorClasses(program.color)}`} />
                <CardContent className={`p-8 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Badge className={getColorClasses(program.color)}>
                      {program.type === 'national' ? (language === 'sv' ? 'Nationellt' : language === 'ar' ? 'وطني' : 'National') : ''}
                    </Badge>
                    <Badge variant="outline" className="border-stone-300">
                      {getLanguageLabel(program.language)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-stone-800 mb-3">{program.title[language]}</h3>
                  <p className="text-stone-600 mb-6 leading-relaxed">{program.description[language]}</p>
                  
                  <div className={`grid grid-cols-2 gap-4 mb-6 ${isRTL ? 'direction-rtl' : ''}`}>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Clock className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span>{program.duration[language]}</span>
                    </div>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <MapPin className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span>{program.location[language]}</span>
                    </div>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Calendar className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span>{new Date(program.nextDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE')}</span>
                    </div>
                    <div className={`flex items-center text-sm text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <Users className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      <span>{program.spotsLeft} {txt.spotsLeft}</span>
                    </div>
                  </div>
                  
                  <Link to={`/leader-experience/${program.id}`}>
                    <Button className={`bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {txt.applyNow}
                      <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-stone-800">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-bold text-cream-50 mb-6">
            {txt.ctaTitle}
          </h2>
          <p className="text-xl text-cream-300 mb-10">
            {txt.ctaDescription}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link to="/kontakt">
              <Button size="lg" className={`bg-amber-600 hover:bg-amber-700 text-cream-50 px-10 py-6 text-lg rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('home.contactUs')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeaderExperience;
