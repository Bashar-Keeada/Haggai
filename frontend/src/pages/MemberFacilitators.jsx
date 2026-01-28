import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, UserCog, Mail, Phone, BookOpen, Search, User, MapPin
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberFacilitators = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    sv: {
      title: 'Våra Facilitatorer/Tränare',
      subtitle: 'Erfarna facilitatorer som guidar och inspirerar i våra utbildningar',
      back: 'Tillbaka till Medlemsområdet',
      search: 'Sök facilitator...',
      topics: 'Specialområden',
      contact: 'Kontakt',
      noFacilitators: 'Inga facilitatorer registrerade än. Nya facilitatorer kommer att visas här när de registrerar sig.',
      loading: 'Laddar...',
      email: 'E-post',
      phone: 'Telefon',
      bio: 'Om mig'
    },
    en: {
      title: 'Our Facilitators/Trainers',
      subtitle: 'Experienced facilitators who guide and inspire in our trainings',
      back: 'Back to Members Area',
      search: 'Search facilitator...',
      topics: 'Areas of Expertise',
      contact: 'Contact',
      noFacilitators: 'No facilitators registered yet. New facilitators will appear here when they register.',
      loading: 'Loading...',
      email: 'Email',
      phone: 'Phone',
      bio: 'About me'
    },
    ar: {
      title: 'ميسرونا ومدربونا',
      subtitle: 'ميسرون ذوو خبرة يوجهون ويلهمون في تدريباتنا',
      back: 'العودة إلى منطقة الأعضاء',
      search: 'ابحث عن ميسر...',
      topics: 'مجالات الخبرة',
      contact: 'اتصل',
      noFacilitators: 'لم يتم تسجيل ميسرين بعد. سيظهر الميسرون الجدد هنا عند تسجيلهم.',
      loading: 'جاري التحميل...',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      bio: 'نبذة عني'
    }
  };

  const txt = translations[language] || translations.sv;

  // Topic translations
  const topicNames = {
    sv: {
      'biblical_mandate': 'Bibliskt Mandat',
      'stewardship': 'Förvaltarskap',
      'context': 'Sammanhang',
      'next_generation': 'Nästa Generation',
      'leadership': 'Ledarskap',
      'goal_setting': 'Målsättning',
      'time_management': 'Tidshantering',
      'vision': 'Vision',
      'communication': 'Kommunikation',
      'team_building': 'Teambuilding',
      'conflict_resolution': 'Konflikthantering'
    },
    en: {
      'biblical_mandate': 'Biblical Mandate',
      'stewardship': 'Stewardship',
      'context': 'Context',
      'next_generation': 'Next Generation',
      'leadership': 'Leadership',
      'goal_setting': 'Goal Setting',
      'time_management': 'Time Management',
      'vision': 'Vision',
      'communication': 'Communication',
      'team_building': 'Team Building',
      'conflict_resolution': 'Conflict Resolution'
    },
    ar: {
      'biblical_mandate': 'التفويض الكتابي',
      'stewardship': 'الوكالة',
      'context': 'السياق',
      'next_generation': 'الجيل القادم',
      'leadership': 'القيادة',
      'goal_setting': 'تحديد الأهداف',
      'time_management': 'إدارة الوقت',
      'vision': 'الرؤية',
      'communication': 'التواصل',
      'team_building': 'بناء الفريق',
      'conflict_resolution': 'حل النزاعات'
    }
  };

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
      return;
    }
    fetchFacilitators();
  }, [isMembersAuthenticated, navigate]);

  const fetchFacilitators = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-registrations?status=approved`);
      if (response.ok) {
        const data = await response.json();
        setFacilitators(data);
      }
    } catch (error) {
      console.error('Error fetching facilitators:', error);
      toast.error('Kunde inte ladda facilitatorer');
    } finally {
      setLoading(false);
    }
  };

  const getTopicName = (topicKey) => {
    const langTopics = topicNames[language] || topicNames.sv;
    return langTopics[topicKey] || topicKey?.replace(/_/g, ' ');
  };

  const filteredFacilitators = facilitators.filter(f => 
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.primary_topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-cream-100 pt-24 pb-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/medlemmar" 
          className={`inline-flex items-center text-stone-600 hover:text-amber-600 mb-8 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {txt.back}
        </Link>

        {/* Header */}
        <div className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}>
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-6 shadow-lg`}>
            <UserCog className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">{txt.title}</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">{txt.subtitle}</p>
        </div>

        {/* Search */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400 ${isRTL ? 'right-4' : 'left-4'}`} />
            <Input
              type="text"
              placeholder={txt.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-12 text-right' : 'pl-12'} py-6 text-lg bg-white shadow-lg border-0 rounded-xl`}
            />
          </div>
        </div>

        {/* Facilitators Grid */}
        {filteredFacilitators.length === 0 ? (
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardContent className="p-16 text-center">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCog className="h-12 w-12 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-stone-700 mb-4">
                {language === 'sv' ? 'Inga facilitatorer än' : language === 'ar' ? 'لا يوجد ميسرون بعد' : 'No facilitators yet'}
              </h3>
              <p className="text-stone-500 max-w-md mx-auto">{txt.noFacilitators}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilitators.map((facilitator) => (
              <Card 
                key={facilitator.id} 
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white group"
              >
                <CardContent className="p-0">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-8 text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    {facilitator.profile_photo_url ? (
                      <img 
                        src={facilitator.profile_photo_url} 
                        alt={facilitator.name}
                        className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white/30 shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full mx-auto bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-xl relative z-10">
                        <User className="h-14 w-14 text-white/90" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mt-5 relative z-10">{facilitator.name}</h3>
                    {facilitator.role_sv && (
                      <p className="text-white/80 text-sm mt-1 relative z-10">{facilitator.role_sv}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                    {/* Topics/Expertise */}
                    {facilitator.primary_topic && (
                      <div className="mb-5">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-2 font-semibold">
                          {txt.topics}
                        </p>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-4 py-2 text-sm font-medium">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {getTopicName(facilitator.primary_topic)}
                        </Badge>
                      </div>
                    )}

                    {/* Bio */}
                    {facilitator.bio && (
                      <div className="mb-5">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-2 font-semibold">
                          {txt.bio}
                        </p>
                        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                          {facilitator.bio}
                        </p>
                      </div>
                    )}

                    {/* Contact */}
                    <div className="pt-5 border-t border-stone-100">
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-3 font-semibold">
                        {txt.contact}
                      </p>
                      <div className="space-y-3">
                        {facilitator.email && (
                          <a 
                            href={`mailto:${facilitator.email}`}
                            className={`flex items-center text-sm text-amber-600 hover:text-amber-700 hover:underline transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {facilitator.email}
                          </a>
                        )}
                        {facilitator.phone && (
                          <a 
                            href={`tel:${facilitator.phone}`}
                            className={`flex items-center text-sm text-stone-600 hover:text-amber-600 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <Phone className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {facilitator.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberFacilitators;
