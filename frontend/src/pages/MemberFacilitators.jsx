import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, UserCog, Mail, Phone, BookOpen, Search, User
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberFacilitators = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    sv: {
      title: 'Facilitatorer/Tränare',
      subtitle: 'Våra erfarna facilitatorer som guidar och inspirerar',
      back: 'Tillbaka till Mina Sidor',
      search: 'Sök facilitator...',
      topics: 'Specialområden',
      contact: 'Kontakt',
      noFacilitators: 'Inga facilitatorer hittades.',
      loading: 'Laddar...',
      email: 'E-post',
      phone: 'Telefon',
      bio: 'Om'
    },
    en: {
      title: 'Facilitators/Trainers',
      subtitle: 'Our experienced facilitators who guide and inspire',
      back: 'Back to My Pages',
      search: 'Search facilitator...',
      topics: 'Areas of Expertise',
      contact: 'Contact',
      noFacilitators: 'No facilitators found.',
      loading: 'Loading...',
      email: 'Email',
      phone: 'Phone',
      bio: 'About'
    },
    ar: {
      title: 'الميسرين/المدربين',
      subtitle: 'ميسرونا ذوو الخبرة الذين يوجهون ويلهمون',
      back: 'العودة إلى صفحاتي',
      search: 'ابحث عن ميسر...',
      topics: 'مجالات الخبرة',
      contact: 'اتصل',
      noFacilitators: 'لم يتم العثور على ميسرين.',
      loading: 'جاري التحميل...',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      bio: 'نبذة'
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
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }
    fetchFacilitators();
  }, [navigate]);

  const fetchFacilitators = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders?active_only=true`);
      if (response.ok) {
        const data = await response.json();
        // Only show approved facilitators
        const approved = data.filter(f => f.status === 'approved');
        setFacilitators(approved);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haggai"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-20 pb-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/mina-sidor" 
          className={`inline-flex items-center text-stone-600 hover:text-haggai mb-6 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {txt.back}
        </Link>

        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <UserCog className="h-8 w-8 text-haggai" />
            <h1 className="text-3xl font-bold text-stone-800">{txt.title}</h1>
          </div>
          <p className="text-stone-600">{txt.subtitle}</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="text"
              placeholder={txt.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-white`}
            />
          </div>
        </div>

        {/* Facilitators Grid */}
        {filteredFacilitators.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <UserCog className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noFacilitators}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilitators.map((facilitator) => (
              <Card key={facilitator.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with photo or placeholder */}
                  <div className="bg-gradient-to-br from-haggai to-haggai-dark p-6 text-center">
                    {facilitator.profile_photo_url ? (
                      <img 
                        src={facilitator.profile_photo_url} 
                        alt={facilitator.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/20"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto bg-white/20 flex items-center justify-center">
                        <User className="h-12 w-12 text-white/80" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mt-4">{facilitator.name}</h3>
                    {facilitator.role_sv && (
                      <p className="text-white/80 text-sm mt-1">{facilitator.role_sv}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                    {/* Topics */}
                    {facilitator.primary_topic && (
                      <div className="mb-4">
                        <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                          {txt.topics}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {getTopicName(facilitator.primary_topic)}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {facilitator.bio && (
                      <div className="mb-4">
                        <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                          {txt.bio}
                        </p>
                        <p className="text-stone-600 text-sm line-clamp-3">
                          {facilitator.bio}
                        </p>
                      </div>
                    )}

                    {/* Contact */}
                    <div className="pt-4 border-t border-stone-100">
                      <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">
                        {txt.contact}
                      </p>
                      <div className="space-y-2">
                        {facilitator.email && (
                          <a 
                            href={`mailto:${facilitator.email}`}
                            className={`flex items-center text-sm text-haggai hover:underline ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <Mail className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {facilitator.email}
                          </a>
                        )}
                        {facilitator.phone && (
                          <a 
                            href={`tel:${facilitator.phone}`}
                            className={`flex items-center text-sm text-stone-600 hover:text-haggai ${isRTL ? 'flex-row-reverse' : ''}`}
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
