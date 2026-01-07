import React, { useState, useEffect } from 'react';
import { Handshake, Globe, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Partners = () => {
  const { language, isRTL } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const txt = {
    sv: {
      pageTitle: 'Våra Partners',
      pageSubtitle: 'Tillsammans skapar vi större påverkan',
      pageDescription: 'Vi samarbetar med organisationer och företag som delar vår vision om att utveckla ledare och stärka samhällen.',
      strategicPartners: 'Strategiska Partners',
      premiumPartners: 'Premium Partners',
      standardPartners: 'Partners',
      visitWebsite: 'Besök webbplats',
      becomePartner: 'Bli Partner',
      becomePartnerDesc: 'Vill du samarbeta med oss? Kontakta oss för att diskutera partnerskapsmöjligheter.',
      contactUs: 'Kontakta oss',
      noPartners: 'Inga partners att visa just nu.',
      strategic: 'Strategisk',
      premium: 'Premium',
      standard: 'Partner'
    },
    en: {
      pageTitle: 'Our Partners',
      pageSubtitle: 'Together we create greater impact',
      pageDescription: 'We collaborate with organizations and companies that share our vision of developing leaders and strengthening communities.',
      strategicPartners: 'Strategic Partners',
      premiumPartners: 'Premium Partners',
      standardPartners: 'Partners',
      visitWebsite: 'Visit website',
      becomePartner: 'Become a Partner',
      becomePartnerDesc: 'Want to collaborate with us? Contact us to discuss partnership opportunities.',
      contactUs: 'Contact us',
      noPartners: 'No partners to display at this time.',
      strategic: 'Strategic',
      premium: 'Premium',
      standard: 'Partner'
    },
    ar: {
      pageTitle: 'شركاؤنا',
      pageSubtitle: 'معًا نصنع تأثيرًا أكبر',
      pageDescription: 'نتعاون مع المنظمات والشركات التي تشاركنا رؤيتنا في تطوير القادة وتعزيز المجتمعات.',
      strategicPartners: 'الشركاء الاستراتيجيون',
      premiumPartners: 'الشركاء المميزون',
      standardPartners: 'الشركاء',
      visitWebsite: 'زيارة الموقع',
      becomePartner: 'كن شريكًا',
      becomePartnerDesc: 'هل تريد التعاون معنا؟ اتصل بنا لمناقشة فرص الشراكة.',
      contactUs: 'اتصل بنا',
      noPartners: 'لا يوجد شركاء للعرض حاليًا.',
      strategic: 'استراتيجي',
      premium: 'مميز',
      standard: 'شريك'
    }
  }[language] || {
    sv: {}
  }.sv;

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/partners?active_only=true`);
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const strategicPartners = partners.filter(p => p.partnership_type === 'strategic');
  const premiumPartners = partners.filter(p => p.partnership_type === 'premium');
  const standardPartners = partners.filter(p => p.partnership_type === 'standard');

  const getPartnershipBadge = (type) => {
    const badges = {
      strategic: { label: txt.strategic, className: 'bg-haggai text-white' },
      premium: { label: txt.premium, className: 'bg-amber-500 text-white' },
      standard: { label: txt.standard, className: 'bg-stone-500 text-white' }
    };
    const badge = badges[type] || badges.standard;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const PartnerCard = ({ partner, featured = false }) => (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all group ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}>
      <CardContent className={`p-6 ${featured ? 'lg:p-8' : ''}`}>
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {partner.logo_url ? (
            <img 
              src={partner.logo_url} 
              alt={partner.name} 
              className={`rounded-xl object-contain bg-white border border-stone-100 p-2 ${featured ? 'w-24 h-24' : 'w-16 h-16'}`}
            />
          ) : (
            <div className={`rounded-xl bg-gradient-to-br from-haggai-100 to-haggai-50 flex items-center justify-center flex-shrink-0 ${featured ? 'w-24 h-24' : 'w-16 h-16'}`}>
              <Handshake className={`text-haggai ${featured ? 'h-12 w-12' : 'h-8 w-8'}`} />
            </div>
          )}
          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <h3 className={`font-bold text-stone-800 ${featured ? 'text-xl' : 'text-lg'}`}>{partner.name}</h3>
              {featured && <Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
            </div>
            {getPartnershipBadge(partner.partnership_type)}
          </div>
        </div>
        {partner.description && (
          <p className={`text-stone-600 mt-4 ${featured ? 'text-base' : 'text-sm'}`}>{partner.description}</p>
        )}
        {partner.website && (
          <a 
            href={partner.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-4"
          >
            <Button variant="outline" size="sm" className="group-hover:bg-haggai group-hover:text-white transition-all">
              <Globe className="h-4 w-4 mr-2" />
              {txt.visitWebsite}
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="w-12 h-12 bg-haggai rounded-xl flex items-center justify-center">
                <Handshake className="h-6 w-6 text-white" />
              </div>
              <span className="text-haggai font-medium text-sm tracking-wider uppercase">{txt.pageTitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              {txt.pageSubtitle}
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {txt.pageDescription}
            </p>
          </div>
        </div>
      </section>

      {partners.length === 0 ? (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Handshake className="h-20 w-20 text-stone-300 mx-auto mb-6" />
            <p className="text-xl text-stone-500">{txt.noPartners}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Strategic Partners */}
          {strategicPartners.length > 0 && (
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Star className="h-6 w-6 text-haggai fill-haggai" />
                  <h2 className="text-2xl font-bold text-stone-800">{txt.strategicPartners}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strategicPartners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} featured />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Premium Partners */}
          {premiumPartners.length > 0 && (
            <section className="py-16 bg-cream-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Star className="h-6 w-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-stone-800">{txt.premiumPartners}</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumPartners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Standard Partners */}
          {standardPartners.length > 0 && (
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-2xl font-bold text-stone-800 mb-8 ${isRTL ? 'text-right' : ''}`}>
                  {txt.standardPartners}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {standardPartners.map(partner => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Become a Partner CTA */}
      <section className="py-24 bg-haggai-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="h-16 w-16 text-haggai-200 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">{txt.becomePartner}</h2>
          <p className="text-haggai-200 text-lg mb-8 max-w-2xl mx-auto">
            {txt.becomePartnerDesc}
          </p>
          <a href="/kontakt">
            <Button className="bg-white text-haggai hover:bg-cream-50 px-8 py-6 text-lg">
              {txt.contactUs}
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Partners;
