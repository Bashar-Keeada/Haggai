import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Heart, Globe, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { testimonialsTranslations, eventsTranslations } from '../data/translations';
import { events } from '../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const { t, language, isRTL } = useLanguage();
  const fallbackTestimonials = testimonialsTranslations[language] || testimonialsTranslations.sv;
  const translatedEvents = eventsTranslations[language] || eventsTranslations.sv;
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/testimonials?active_only=true`);
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match expected format
        const transformed = data.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          church: t.church,
          quote: language === 'ar' && t.quote_ar ? t.quote_ar : 
                 language === 'en' && t.quote_en ? t.quote_en : t.quote_sv,
          image_url: t.image_url
        }));
        setTestimonials(transformed);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  // Merge translated content with event data
  const localizedEvents = events.map(event => {
    const translation = translatedEvents.find(te => te.id === event.id);
    return {
      ...event,
      title: translation?.title || event.title,
      description: translation?.description || event.description
    };
  });

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 ${isRTL ? 'left-10' : 'right-10'} w-72 h-72 bg-haggai-100/50 rounded-full blur-3xl`} />
          <div className={`absolute bottom-20 ${isRTL ? 'right-10' : 'left-10'} w-96 h-96 bg-cream-300/40 rounded-full blur-3xl`} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <div className={`inline-flex items-center px-4 py-2 bg-haggai-100 rounded-full mb-8`}>
              <span className="text-haggai text-sm font-medium">{t('home.badge')}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-800 leading-tight mb-6">
              {t('home.heroTitle1')}
              <span className="block text-haggai">{t('home.heroTitle2')}</span>
            </h1>
            
            <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-2xl">
              {t('home.heroDescription')}
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link to="/bli-medlem">
                <Button size="lg" className={`bg-haggai hover:bg-haggai-light text-cream-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('home.becomeMember')}
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
              <Link to="/leader-experience">
                <Button variant="outline" size="lg" className="border-2 border-haggai text-haggai hover:bg-haggai hover:text-cream-50 px-8 py-6 text-lg rounded-xl">
                  {language === 'sv' ? 'Haggai Leader Experience' : language === 'ar' ? 'تجربة هجاي للقيادة' : 'Haggai Leader Experience'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{t('home.coreValues')}</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {t('home.coreValuesSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: t('home.community'), desc: t('home.communityDesc') },
              { icon: BookOpen, title: t('home.education'), desc: t('home.educationDesc') },
              { icon: Heart, title: t('home.service'), desc: t('home.serviceDesc') },
              { icon: Globe, title: t('home.impact'), desc: t('home.impactDesc') }
            ].map((value, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-cream-50 hover:-translate-y-1">
                <CardContent className={`p-8 text-center ${isRTL ? 'text-right' : ''}`}>
                  <div className={`w-16 h-16 mb-6 bg-haggai-100 rounded-2xl flex items-center justify-center group-hover:bg-haggai transition-colors duration-300 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                    <value.icon className="h-8 w-8 text-haggai group-hover:text-cream-50 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">{value.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-haggai-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRTL ? 'direction-rtl' : ''}`}>
            <div className={isRTL ? 'text-right order-1 lg:order-2' : ''}>
              <span className="text-haggai font-medium text-sm tracking-wider uppercase mb-4 block">{t('home.aboutTitle')}</span>
              <h2 className="text-4xl font-bold text-stone-800 mb-6">{t('home.aboutHeading')}</h2>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                {t('home.aboutText1')}
              </p>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                {t('home.aboutText2')}
              </p>
              <Link to="/om-oss">
                <Button variant="outline" className={`border-2 border-haggai text-haggai hover:bg-haggai hover:text-cream-50 rounded-xl px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('home.readMore')}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
            <div className={`relative ${isRTL ? 'order-2 lg:order-1' : ''}`}>
              <div className="absolute -inset-4 bg-haggai-100/50 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-haggai-50 rounded-2xl">
                    <span className="text-4xl font-bold text-haggai">50+</span>
                    <p className="text-stone-600 mt-2">{t('home.members')}</p>
                  </div>
                  <div className="text-center p-6 bg-haggai-50 rounded-2xl">
                    <span className="text-4xl font-bold text-haggai">10+</span>
                    <p className="text-stone-600 mt-2">{t('home.trainingsPerYear')}</p>
                  </div>
                  <div className="text-center p-6 bg-haggai-50 rounded-2xl">
                    <span className="text-4xl font-bold text-haggai">20+</span>
                    <p className="text-stone-600 mt-2">{t('home.denominations')}</p>
                  </div>
                  <div className="text-center p-6 bg-haggai-50 rounded-2xl">
                    <span className="text-4xl font-bold text-haggai">∞</span>
                    <p className="text-stone-600 mt-2">{t('home.potential')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 ${isRTL ? 'sm:flex-row-reverse text-right' : ''}`}>
            <div>
              <h2 className="text-4xl font-bold text-stone-800 mb-2">{t('home.upcomingEvents')}</h2>
              <p className="text-stone-600">{t('home.upcomingEventsSubtitle')}</p>
            </div>
            <Link to="/kalender" className="mt-4 sm:mt-0">
              <Button variant="outline" className={`border-haggai text-haggai hover:bg-haggai hover:text-cream-50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('home.seeAllEvents')}
                <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {localizedEvents.slice(0, 3).map((event) => (
              <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="h-2 bg-haggai" />
                <CardContent className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-medium text-haggai bg-haggai-50 px-3 py-1 rounded-full">
                      {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-sm text-stone-500">{event.time}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-haggai transition-colors">{event.title}</h3>
                  <p className="text-stone-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-stone-500">{event.spotsLeft} {t('home.spotsLeft')}</span>
                    <Link to="/kalender">
                      <Button size="sm" className="bg-haggai hover:bg-haggai-light text-cream-50 rounded-lg">
                        {t('home.signUp')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-haggai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-cream-50 mb-4">{t('home.testimonials')}</h2>
            <p className="text-haggai-200">{t('home.testimonialsSubtitle')}</p>
          </div>
          
          {loadingTestimonials ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-cream-50 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="bg-haggai-700/50 border-haggai-700 backdrop-blur">
                  <CardContent className={`p-8 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`text-haggai-200 text-4xl mb-4 ${isRTL ? 'text-right' : ''}`}>"</div>
                    <p className="text-cream-100 mb-6 leading-relaxed italic">{testimonial.quote}</p>
                    <div className={`border-t border-haggai-700 pt-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {testimonial.image_url ? (
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-haggai-600 flex items-center justify-center">
                          <User className="h-6 w-6 text-haggai-200" />
                        </div>
                      )}
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="text-cream-50 font-semibold">{testimonial.name}</p>
                        <p className="text-haggai-300 text-sm">
                          {testimonial.role}{testimonial.role && testimonial.church && ' – '}{testimonial.church}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-haggai-50">
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${isRTL ? 'text-right' : ''}`}>
          <h2 className="text-4xl font-bold text-stone-800 mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            {t('home.ctaDescription')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link to="/bli-medlem">
              <Button size="lg" className={`bg-haggai hover:bg-haggai-light text-cream-50 px-10 py-6 text-lg rounded-xl shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('home.becomeMemberToday')}
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

export default Home;
