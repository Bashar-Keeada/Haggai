import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LeaderSessions = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);

  const txt = {
    sv: {
      title: 'Mina sessioner',
      back: 'Tillbaka till portalen',
      noSessions: 'Du har inga tilldelade sessioner just nu',
      workshop: 'Utbildning',
      day: 'Dag',
      time: 'Tid',
      session: 'Session',
      logout: 'Logga ut',
      notLoggedIn: 'Du är inte inloggad',
      loginRequired: 'Logga in för att se dina sessioner',
      goToLogin: 'Gå till inloggning',
      participants: 'deltagare',
      location: 'Plats',
      description: 'Beskrivning'
    },
    en: {
      title: 'My Sessions',
      back: 'Back to portal',
      noSessions: 'You have no assigned sessions at the moment',
      workshop: 'Workshop',
      day: 'Day',
      time: 'Time',
      session: 'Session',
      logout: 'Log out',
      notLoggedIn: 'You are not logged in',
      loginRequired: 'Please log in to view your sessions',
      goToLogin: 'Go to login',
      participants: 'participants',
      location: 'Location',
      description: 'Description'
    },
    ar: {
      title: 'جلساتي',
      back: 'العودة للبوابة',
      noSessions: 'ليس لديك جلسات مخصصة حالياً',
      workshop: 'الورشة',
      day: 'اليوم',
      time: 'الوقت',
      session: 'الجلسة',
      logout: 'تسجيل الخروج',
      notLoggedIn: 'لم تقم بتسجيل الدخول',
      loginRequired: 'يرجى تسجيل الدخول لعرض جلساتك',
      goToLogin: 'انتقل لتسجيل الدخول',
      participants: 'مشاركين',
      location: 'المكان',
      description: 'الوصف'
    }
  }[language] || {
    title: 'My Sessions',
    back: 'Back to portal',
    noSessions: 'You have no assigned sessions at the moment'
  };

  useEffect(() => {
    const token = localStorage.getItem('leader_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      // First get current leader data
      const leaderRes = await fetch(`${BACKEND_URL}/api/leaders/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!leaderRes.ok) {
        localStorage.removeItem('leader_token');
        setLoading(false);
        return;
      }

      const leaderData = await leaderRes.json();
      setLeader(leaderData);

      // Then fetch sessions for this leader
      const sessionsRes = await fetch(`${BACKEND_URL}/api/leaders/${leaderData.id}/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(language === 'sv' ? 'Kunde inte hämta data' : 'Could not fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('leader_token');
    navigate('/ledare/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE';
    return date.toLocaleDateString(locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Group sessions by workshop
  const groupedSessions = sessions.reduce((acc, item) => {
    const key = item.workshop_id;
    if (!acc[key]) {
      acc[key] = {
        workshop_id: item.workshop_id,
        workshop_title: item.workshop_title,
        workshop_date: item.workshop_date,
        workshop_location: item.workshop_location,
        sessions: []
      };
    }
    acc[key].sessions.push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!leader) {
    return (
      <div className={`min-h-screen bg-cream-50 flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-800 mb-2">{txt.notLoggedIn}</h2>
            <p className="text-stone-600 mb-6">{txt.loginRequired}</p>
            <Button onClick={() => navigate('/ledare/login')} className="bg-haggai hover:bg-haggai-dark">
              {txt.goToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link 
              to="/ledare/portal" 
              className={`inline-flex items-center text-haggai hover:text-haggai-dark ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {txt.back}
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-stone-600 hover:text-red-600">
              <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.logout}
            </Button>
          </div>
          
          <div className={`flex items-center gap-4 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {leader.image_url ? (
              <img src={leader.image_url} alt={leader.name} className="w-16 h-16 rounded-full object-cover border-2 border-haggai" />
            ) : (
              <div className="w-16 h-16 bg-haggai rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-2xl font-bold text-stone-800">{txt.title}</h1>
              <p className="text-stone-600">{leader.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sessions.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noSessions}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedSessions).map((group) => (
              <Card key={group.workshop_id} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-haggai to-haggai-dark text-white">
                  <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-5 w-5" />
                    {group.workshop_title}
                  </CardTitle>
                  {group.workshop_location && (
                    <p className={`text-white/80 text-sm flex items-center gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="h-4 w-4" />
                      {group.workshop_location}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-stone-100">
                    {group.sessions.map((item, idx) => (
                      <div key={idx} className="p-4 hover:bg-stone-50 transition-colors">
                        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={isRTL ? 'text-right' : ''}>
                            <Badge className="bg-haggai-100 text-haggai-dark mb-2">
                              {txt.day} {item.day_number} - {formatDate(item.day_date)}
                            </Badge>
                            <h3 className="font-semibold text-stone-800 text-lg">
                              {item.session?.title || item.session_title || 'Session'}
                            </h3>
                            {(item.session?.description || item.session_description) && (
                              <p className="text-sm text-stone-500 mt-1">
                                {item.session?.description || item.session_description}
                              </p>
                            )}
                          </div>
                          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                            <div className={`flex items-center gap-1 text-haggai font-mono text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Clock className="h-4 w-4" />
                              <span dir="ltr">
                                {item.session?.start_time || item.start_time} - {item.session?.end_time || item.end_time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default LeaderSessions;
