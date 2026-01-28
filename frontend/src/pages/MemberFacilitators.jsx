import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, UserCog, Mail, Phone, BookOpen, Search, User
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
      title: 'Facilitatorer/Tränare',
      subtitle: 'Erfarna facilitatorer som guidar i våra utbildningar',
      back: 'Tillbaka',
      search: 'Sök...',
      topics: 'Specialområde',
      contact: 'Kontakt',
      noFacilitators: 'Inga facilitatorer registrerade än.',
      email: 'E-post',
      phone: 'Telefon',
      bio: 'Om'
    },
    en: {
      title: 'Facilitators/Trainers',
      subtitle: 'Experienced facilitators who guide in our trainings',
      back: 'Back',
      search: 'Search...',
      topics: 'Expertise',
      contact: 'Contact',
      noFacilitators: 'No facilitators registered yet.',
      email: 'Email',
      phone: 'Phone',
      bio: 'About'
    },
    ar: {
      title: 'الميسرين/المدربين',
      subtitle: 'ميسرون ذوو خبرة يوجهون في تدريباتنا',
      back: 'رجوع',
      search: 'بحث...',
      topics: 'الخبرة',
      contact: 'اتصل',
      noFacilitators: 'لم يتم تسجيل ميسرين بعد.',
      email: 'البريد',
      phone: 'الهاتف',
      bio: 'نبذة'
    }
  };

  const txt = translations[language] || translations.sv;

  const topicNames = {
    sv: {
      'biblical_mandate': 'Bibliskt Mandat',
      'stewardship': 'Förvaltarskap',
      'context': 'Sammanhang',
      'next_generation': 'Nästa Generation',
      'leadership': 'Ledarskap',
      'goal_setting': 'Målsättning'
    },
    en: {
      'biblical_mandate': 'Biblical Mandate',
      'stewardship': 'Stewardship',
      'context': 'Context',
      'next_generation': 'Next Generation',
      'leadership': 'Leadership',
      'goal_setting': 'Goal Setting'
    },
    ar: {
      'biblical_mandate': 'التفويض الكتابي',
      'stewardship': 'الوكالة',
      'context': 'السياق',
      'next_generation': 'الجيل القادم',
      'leadership': 'القيادة',
      'goal_setting': 'تحديد الأهداف'
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-amber-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative w-40">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="text"
                placeholder={txt.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isRTL ? 'pr-9' : 'pl-9'} py-1 text-sm bg-white border-stone-200 rounded-lg h-8`}
              />
            </div>
            <Link 
              to="/admin/ledare"
              className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              {language === 'sv' ? 'Lägg till' : language === 'ar' ? 'إضافة' : 'Add'}
            </Link>
          </div>
        </div>

        {/* Compact Title */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow">
            <UserCog className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
            <p className="text-xs text-stone-500">{txt.subtitle}</p>
          </div>
        </div>

        {/* Facilitators Grid */}
        {filteredFacilitators.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCog className="h-6 w-6 text-amber-400" />
              </div>
              <p className="text-stone-500 text-sm">{txt.noFacilitators}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredFacilitators.map((facilitator) => (
              <Card 
                key={facilitator.id} 
                className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white"
              >
                <CardContent className="p-0">
                  {/* Compact Profile Header */}
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-center">
                    {facilitator.profile_photo_url ? (
                      <img 
                        src={facilitator.profile_photo_url} 
                        alt={facilitator.name}
                        className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-white/30 shadow"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full mx-auto bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <User className="h-7 w-7 text-white/90" />
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-white mt-2">{facilitator.name}</h3>
                    {facilitator.role_sv && (
                      <p className="text-white/80 text-xs">{facilitator.role_sv}</p>
                    )}
                  </div>

                  {/* Compact Content */}
                  <div className={`p-3 ${isRTL ? 'text-right' : ''}`}>
                    {facilitator.primary_topic && (
                      <Badge className="bg-amber-100 text-amber-800 px-2 py-0.5 text-xs mb-2">
                        {getTopicName(facilitator.primary_topic)}
                      </Badge>
                    )}

                    {facilitator.bio && (
                      <p className="text-stone-600 text-xs leading-relaxed line-clamp-2 mb-2">
                        {facilitator.bio}
                      </p>
                    )}

                    <div className="pt-2 border-t border-stone-100 space-y-1">
                      {facilitator.email && (
                        <a 
                          href={`mailto:${facilitator.email}`}
                          className={`flex items-center text-xs text-amber-600 hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <Mail className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          <span className="truncate">{facilitator.email}</span>
                        </a>
                      )}
                      {facilitator.phone && (
                        <a 
                          href={`tel:${facilitator.phone}`}
                          className={`flex items-center text-xs text-stone-600 hover:text-amber-600 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <Phone className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {facilitator.phone}
                        </a>
                      )}
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
