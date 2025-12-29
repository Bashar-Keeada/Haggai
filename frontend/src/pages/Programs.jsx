import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { programsTranslations } from '../data/translations';

const Programs = () => {
  const { t, language, isRTL } = useLanguage();
  const programs = programsTranslations[language] || programsTranslations.sv;

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">{t('programs.title')}</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">{t('programs.heading')}</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {t('programs.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="h-3 bg-amber-600 rounded-t-xl" />
                <CardHeader className={`pb-4 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {program.duration}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-stone-800 group-hover:text-amber-700 transition-colors">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`flex-1 flex flex-col ${isRTL ? 'text-right' : ''}`}>
                  <p className="text-stone-600 mb-6 leading-relaxed">{program.description}</p>
                  <div className="mb-6">
                    <h4 className={`font-semibold text-stone-800 mb-3 flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      <BookOpen className={`h-4 w-4 text-amber-700 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('programs.topics')}
                    </h4>
                    <ul className="space-y-2">
                      {program.topics.map((topic, index) => (
                        <li key={index} className={`flex items-center text-stone-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <CheckCircle className={`h-4 w-4 text-amber-600 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <Link to="/kontakt">
                      <Button className={`w-full bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {t('programs.askAbout')}
                        <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{t('programs.whyChoose')}</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t('programs.whyChooseSubtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: 1, title: t('programs.proven'), desc: t('programs.provenDesc') },
              { num: 2, title: t('programs.practical'), desc: t('programs.practicalDesc') },
              { num: 3, title: t('programs.biblical'), desc: t('programs.biblicalDesc') },
              { num: 4, title: t('programs.network'), desc: t('programs.networkDesc') }
            ].map((item) => (
              <div key={item.num} className={`bg-white rounded-2xl p-8 shadow-lg text-center ${isRTL ? 'text-right' : ''}`}>
                <div className={`w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                  <span className="text-amber-700 font-bold text-xl">{item.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-amber-50">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-bold text-stone-800 mb-6">{t('programs.ctaTitle')}</h2>
          <p className="text-xl text-stone-600 mb-10">
            {t('programs.ctaDescription')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link to="/kalender">
              <Button size="lg" className={`bg-amber-700 hover:bg-amber-800 text-cream-50 px-10 py-6 text-lg rounded-xl shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('programs.seeDates')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </Link>
            <Link to="/kontakt">
              <Button variant="outline" size="lg" className="border-2 border-stone-400 text-stone-700 hover:bg-stone-100 px-10 py-6 text-lg rounded-xl">
                {t('home.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
