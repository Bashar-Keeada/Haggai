import React from 'react';
import { Users, Target, Heart, Award } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { boardTranslations } from '../data/translations';

const AboutUs = () => {
  const { t, language, isRTL } = useLanguage();
  const boardMembers = boardTranslations[language] || boardTranslations.sv;

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <span className="text-haggai font-medium text-sm tracking-wider uppercase mb-4 block">{t('about.title')}</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">{t('about.heading')}</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {t('about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-2 gap-16 ${isRTL ? 'direction-rtl' : ''}`}>
            <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
              <div>
                <div className={`w-14 h-14 bg-haggai-100 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                  <Target className="h-7 w-7 text-haggai" />
                </div>
                <h2 className="text-3xl font-bold text-stone-800 mb-4">{t('about.missionTitle')}</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {t('about.missionText')}
                </p>
              </div>
              <div>
                <div className={`w-14 h-14 bg-haggai-100 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                  <Heart className="h-7 w-7 text-haggai" />
                </div>
                <h2 className="text-3xl font-bold text-stone-800 mb-4">{t('about.visionTitle')}</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {t('about.visionText')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-haggai-100/30 rounded-3xl blur-2xl" />
              <div className={`relative bg-cream-100 rounded-3xl p-10 h-full flex flex-col justify-center ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-2xl font-bold text-stone-800 mb-8">{t('about.leadershipPerspective')}</h3>
                <div className="space-y-6">
                  {[
                    { num: 1, title: t('about.servantLeadership'), desc: t('about.servantLeadershipDesc') },
                    { num: 2, title: t('about.integrity'), desc: t('about.integrityDesc') },
                    { num: 3, title: t('about.visionary'), desc: t('about.visionaryDesc') },
                    { num: 4, title: t('about.unity'), desc: t('about.unityDesc') }
                  ].map((item) => (
                    <div key={item.num} className={`flex items-start space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 bg-haggai rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-cream-50 font-bold text-sm">{item.num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-800 mb-1">{item.title}</h4>
                        <p className="text-stone-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Haggai International */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl mx-auto text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-6">{t('about.globalNetwork')}</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              {t('about.globalNetworkText')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-haggai">120K+</span>
                <p className="text-stone-600 mt-2">{t('about.trainedLeaders')}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-haggai">185+</span>
                <p className="text-stone-600 mt-2">{t('about.countries')}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-haggai">50+</span>
                <p className="text-stone-600 mt-2">{t('about.yearsExperience')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{t('about.board')}</h2>
            <p className="text-lg text-stone-600">{t('about.boardSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-amber-100 to-cream-100 flex items-center justify-center">
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
      <section className="py-24 bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-cream-50 mb-4">{t('about.whoWeServe')}</h2>
            <p className="text-cream-300 text-lg">{t('about.whoWeServeSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`bg-stone-700/50 backdrop-blur rounded-2xl p-8 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                <Users className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">{t('about.individuals')}</h3>
              <p className="text-cream-300">{t('about.individualsDesc')}</p>
            </div>
            <div className={`bg-stone-700/50 backdrop-blur rounded-2xl p-8 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                <Award className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">{t('about.churches')}</h3>
              <p className="text-cream-300">{t('about.churchesDesc')}</p>
            </div>
            <div className={`bg-stone-700/50 backdrop-blur rounded-2xl p-8 text-center ${isRTL ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                <Target className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">{t('about.organizations')}</h3>
              <p className="text-cream-300">{t('about.organizationsDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
