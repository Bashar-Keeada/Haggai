import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LeaderSessions = () => {
  const { leaderId } = useParams();
  const { language, isRTL } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);

  const txt = {
    sv: {
      title: 'Mina sessioner',
      back: 'Tillbaka',
      noSessions: 'Du har inga tilldelade sessioner just nu',
      workshop: 'Utbildning',
      day: 'Dag',
      time: 'Tid',
      session: 'Session'
    },
    en: {
      title: 'My Sessions',
      back: 'Back',
      noSessions: 'You have no assigned sessions at the moment',
      workshop: 'Workshop',
      day: 'Day',
      time: 'Time',
      session: 'Session'
    }
  }[language] || {};

  useEffect(() => {
    fetchData();
  }, [leaderId]);

  const fetchData = async () => {
    try {
      const [sessionsRes, leaderRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/leaders/${leaderId}/sessions`),
        fetch(`${BACKEND_URL}/api/leaders/${leaderId}`)
      ]);

      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data);
      }

      if (leaderRes.ok) {
        const data = await leaderRes.json();
        setLeader(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const locale = language === 'en' ? 'en-US' : 'sv-SE';
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

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/ledare" 
            className="inline-flex items-center text-haggai hover:text-haggai-dark mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {txt.back}
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-haggai rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{txt.title}</h1>
              {leader && <p className="text-stone-600">{leader.name}</p>}
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
                <CardHeader className="bg-haggai text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {group.workshop_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-stone-100">
                    {group.sessions.map((item, idx) => (
                      <div key={idx} className="p-4 hover:bg-stone-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge className="bg-haggai-100 text-haggai-dark mb-2">
                              {txt.day} {item.day_number} - {formatDate(item.day_date)}
                            </Badge>
                            <h3 className="font-semibold text-stone-800">
                              {item.session.title}
                            </h3>
                            {item.session.description && (
                              <p className="text-sm text-stone-500 mt-1">
                                {item.session.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-haggai font-mono">
                              <Clock className="h-4 w-4" />
                              {item.session.start_time} - {item.session.end_time}
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
