import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Leaders = () => {
  const { language, isRTL } = useLanguage();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    sv: {
      pageTitle: 'Våra Ledare & Facilitatorer',
      pageSubtitle: 'Erfarna ledare som guidar och inspirerar',
      pageDescription: 'Möt de dedikerade ledarna och facilitatorerna som driver våra program och utbildningar. Varje ledare bidrar med unik erfarenhet och expertis.',
      topics: 'Specialområden',
      contact: 'Kontakt',
      noLeaders: 'Information om ledare kommer snart.',
      loading: 'Laddar...'
    },
    en: {
      pageTitle: 'Our Leaders & Facilitators',
      pageSubtitle: 'Experienced leaders who guide and inspire',
      pageDescription: 'Meet the dedicated leaders and facilitators who drive our programs and training. Each leader brings unique experience and expertise.',
      topics: 'Areas of Expertise',
      contact: 'Contact',
      noLeaders: 'Information about leaders coming soon.',
      loading: 'Loading...'
    },
    ar: {
      pageTitle: 'قادتنا والميسرون',
      pageSubtitle: 'قادة ذوو خبرة يوجهون ويلهمون',
      pageDescription: 'تعرف على القادة والميسرين المتفانين الذين يقودون برامجنا وتدريباتنا. يجلب كل قائد خبرة فريدة ومهارات متميزة.',
      topics: 'مجالات الخبرة',
      contact: 'اتصل',
      noLeaders: 'معلومات عن القادة قريباً.',
      loading: 'جاري التحميل...'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders`);
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-haggai border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">{txt.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <Badge className="mb-6 bg-haggai-100 text-haggai-dark border-haggai-100">
              Haggai Sweden
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              {txt.pageTitle}
            </h1>
            <p className="text-xl text-haggai font-medium mb-4">
              {txt.pageSubtitle}
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              {txt.pageDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Leaders Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {leaders.length === 0 ? (
            <Card className="border-0 shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <User className="h-20 w-20 text-stone-300 mx-auto mb-6" />
                <p className="text-xl text-stone-500">{txt.noLeaders}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <Card key={leader.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    {/* Image Section */}
                    <div className="relative h-64 bg-gradient-to-br from-haggai-100 to-haggai-200 overflow-hidden">
                      {leader.image_url ? (
                        <img 
                          src={leader.image_url} 
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-24 w-24 text-haggai/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute bottom-0 left-0 right-0 p-6 ${isRTL ? 'text-right' : ''}`}>
                        <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                        <p className="text-haggai-100 font-medium">
                          {leader.role?.[language] || leader.role?.sv}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-stone-600 mb-6 line-clamp-4">
                        {leader.bio?.[language] || leader.bio?.sv}
                      </p>

                      {/* Topics */}
                      {(leader.topics?.[language]?.length > 0 || leader.topics?.sv?.length > 0) && (
                        <div className="mb-6">
                          <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <BookOpen className="h-4 w-4 text-haggai" />
                            <span className="text-sm font-semibold text-stone-700">{txt.topics}</span>
                          </div>
                          <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                            {(leader.topics?.[language] || leader.topics?.sv || []).map((topic, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="bg-haggai-50 text-haggai-dark border-haggai-100"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      {(leader.email || leader.phone) && (
                        <div className="pt-4 border-t border-stone-100">
                          <p className={`text-sm font-semibold text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                            {txt.contact}
                          </p>
                          <div className="space-y-2">
                            {leader.email && (
                              <a 
                                href={`mailto:${leader.email}`}
                                className={`flex items-center gap-2 text-sm text-stone-600 hover:text-haggai transition-colors ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                              >
                                <Mail className="h-4 w-4" />
                                {leader.email}
                              </a>
                            )}
                            {leader.phone && (
                              <a 
                                href={`tel:${leader.phone}`}
                                className={`flex items-center gap-2 text-sm text-stone-600 hover:text-haggai transition-colors ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                              >
                                <Phone className="h-4 w-4" />
                                {leader.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Leaders;
