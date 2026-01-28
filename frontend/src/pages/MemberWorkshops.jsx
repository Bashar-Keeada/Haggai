import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, MapPin, Users, UserPlus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberWorkshops = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
      return;
    }
    fetchWorkshops();
  }, [isMembersAuthenticated, navigate]);

  const fetchWorkshops = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/workshops?active_only=true`);
      if (res.ok) {
        const data = await res.json();
        setWorkshops(data);
      }
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.sv || field.en || '';
  };

  const translations = {
    sv: {
      title: 'Utbildningar',
      subtitle: 'Kommande workshops och seminarier',
      back: 'Tillbaka',
      nominateBtn: 'Nominera',
      noWorkshops: 'Inga kommande utbildningar just nu.',
      spotsLeft: 'platser kvar',
      online: 'Online',
      viewCalendar: 'Se hela kalendern'
    },
    en: {
      title: 'Trainings',
      subtitle: 'Upcoming workshops and seminars',
      back: 'Back',
      nominateBtn: 'Nominate',
      noWorkshops: 'No upcoming trainings at the moment.',
      spotsLeft: 'spots left',
      online: 'Online',
      viewCalendar: 'View full calendar'
    },
    ar: {
      title: 'التدريبات',
      subtitle: 'ورش العمل والندوات القادمة',
      back: 'رجوع',
      nominateBtn: 'رشح',
      noWorkshops: 'لا توجد تدريبات قادمة حالياً.',
      spotsLeft: 'أماكن متبقية',
      online: 'عبر الإنترنت',
      viewCalendar: 'عرض التقويم الكامل'
    }
  };

  const txt = translations[language] || translations.sv;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-blue-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/kalender')}
            className="text-xs h-8"
          >
            <Calendar className="h-3 w-3 mr-1" />
            {txt.viewCalendar}
          </Button>
        </div>

        {/* Compact Title */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
            <p className="text-xs text-stone-500">{txt.subtitle}</p>
          </div>
        </div>

        {/* Workshops Grid */}
        {workshops.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-stone-500 text-sm">{txt.noWorkshops}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workshops.map((workshop) => (
              <Card 
                key={workshop.id} 
                className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white"
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4">
                    <h3 className="text-sm font-bold text-white">{getLocalizedText(workshop.title)}</h3>
                    {workshop.is_online && (
                      <Badge className="bg-white/20 text-white text-xs mt-1">{txt.online}</Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-3 ${isRTL ? 'text-right' : ''}`}>
                    <div className="space-y-2 mb-3">
                      {workshop.date && (
                        <div className={`flex items-center gap-2 text-xs text-stone-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="h-3 w-3 text-blue-500" />
                          {new Date(workshop.date).toLocaleDateString('sv-SE')}
                          {workshop.end_date && ` - ${new Date(workshop.end_date).toLocaleDateString('sv-SE')}`}
                        </div>
                      )}
                      {workshop.location && (
                        <div className={`flex items-center gap-2 text-xs text-stone-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <MapPin className="h-3 w-3 text-blue-500" />
                          {workshop.location}
                        </div>
                      )}
                      {workshop.spots && (
                        <div className={`flex items-center gap-2 text-xs text-stone-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Users className="h-3 w-3 text-blue-500" />
                          {workshop.spots} {txt.spotsLeft}
                        </div>
                      )}
                    </div>

                    {workshop.price && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs mb-2">
                        {workshop.price} {workshop.currency || 'SEK'}
                      </Badge>
                    )}

                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8"
                      onClick={() => navigate(`/nominera/${workshop.id}`)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      {txt.nominateBtn}
                    </Button>
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

export default MemberWorkshops;
