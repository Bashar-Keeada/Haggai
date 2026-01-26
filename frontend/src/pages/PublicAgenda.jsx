import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Coffee, ArrowLeft, Globe, Home } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PublicAgenda = () => {
  const { workshopId } = useParams();
  const { language, isRTL } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const txt = {
    sv: {
      program: 'Program',
      day: 'Dag',
      noProgram: 'Programmet är inte tillgängligt ännu',
      back: 'Tillbaka',
      leader: 'Ledare',
      break: 'Paus',
      lunch: 'Lunch',
      location: 'Plats',
      date: 'Datum',
      printProgram: 'Skriv ut program'
    },
    en: {
      program: 'Program',
      day: 'Day',
      noProgram: 'The program is not available yet',
      back: 'Back',
      leader: 'Leader',
      break: 'Break',
      lunch: 'Lunch',
      location: 'Location',
      date: 'Date',
      printProgram: 'Print program'
    },
    ar: {
      program: 'البرنامج',
      day: 'اليوم',
      noProgram: 'البرنامج غير متاح بعد',
      back: 'رجوع',
      leader: 'القائد',
      break: 'استراحة',
      lunch: 'غداء',
      location: 'الموقع',
      date: 'التاريخ',
      printProgram: 'طباعة البرنامج'
    }
  }[language] || {};

  useEffect(() => {
    fetchAgenda();
  }, [workshopId]);

  const fetchAgenda = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agenda/public/${workshopId}`);
      if (response.ok) {
        const agendaData = await response.json();
        setData(agendaData);
      } else if (response.status === 404) {
        setError('not_found');
      }
    } catch (err) {
      console.error('Error fetching agenda:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (item, field) => {
    if (!item) return '';
    // Handle direct text values (can be string or object with language keys)
    const value = field ? item[field] : item;
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // If it's a multilingual object {sv: ..., en: ..., ar: ...}
      return value[language] || value.sv || value.en || Object.values(value)[0] || '';
    }
    return String(value);
  };

  // Simplified helper for direct multilingual values
  const getText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[language] || value.sv || value.en || Object.values(value)[0] || '';
    }
    return String(value);
  };

  const getSessionStyle = (type) => {
    switch (type) {
      case 'break':
        return 'bg-white border-stone-200';
      case 'lunch':
      case 'meal':
        return 'bg-white border-stone-200';
      case 'evaluation':
        return 'bg-stone-50 border-stone-200';
      case 'registration':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-stone-200';
    }
  };

  const getSessionColor = (sessionTitle) => {
    // Assign colors based on session content to match Excel
    const title = sessionTitle?.toLowerCase() || '';
    if (title.includes('atheism') || title.includes('goals') || title.includes('leadership')) {
      return 'bg-blue-200/60';  // Light blue background
    }
    if (title.includes('mandate') || title.includes('stewardship')) {
      return 'bg-orange-200/60';  // Light orange/peach background
    }
    if (title.includes('next gen')) {
      return 'bg-green-200/60';  // Light green background
    }
    if (title.includes('evaluation')) {
      return 'bg-purple-100/50';  // Very light purple
    }
    return 'bg-white';  // White for breaks
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Calendar className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.noProgram}</h1>
          <Link to="/" className="text-haggai hover:underline">
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            {txt.back}
          </Link>
        </div>
      </div>
    );
  }

  const { workshop, days } = data;

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Header */}
      <section className="py-12 text-white" style={{background: 'linear-gradient(135deg, #014D73 0%, #012d44 50%, #1c1917 100%)'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white mb-4 border-white/30">
              {txt.program}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {getText(workshop?.title)}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 text-white/90 mt-6">
              {workshop?.date && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {workshop.date} {workshop.end_date && `- ${workshop.end_date}`}
                </span>
              )}
              {workshop?.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {getText(workshop.location)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Program Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Print Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => window.print()}
            className="text-haggai hover:text-haggai-dark text-sm flex items-center gap-2"
          >
            🖨️ {txt.printProgram}
          </button>
        </div>

        {/* Days */}
        <div className="space-y-8">
          {days.map((day, dayIndex) => (
            <Card key={day.id || dayIndex} className="border-0 shadow-xl overflow-hidden print:shadow-none print:border mb-8">
              {/* Day Header with Dark Background */}
              <div className="bg-gradient-to-r from-haggai to-haggai-dark text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {day.day_title || `${txt.day} ${day.day_number}`}
                    </h2>
                    {day.date && (
                      <p className="text-white/90 mt-1">{formatDate(day.date)}</p>
                    )}
                  </div>
                  <div className="text-4xl font-bold text-white/20">
                    {day.day_number}
                  </div>
                </div>
              </div>

              {/* Sessions */}
              <CardContent className="p-0">
                <div className="divide-y divide-stone-100">
                  {day.sessions.map((session, sessionIndex) => (
                    <div 
                      key={session.id || sessionIndex}
                      className={`p-4 ${getSessionColor(session.title)} ${
                        session.session_type === 'break' || session.session_type === 'meal' || session.session_type === 'lunch'
                          ? 'py-3' 
                          : ''
                      }`}
                    >
                      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {/* Time */}
                        <div className={`min-w-[90px] ${isRTL ? 'text-left' : 'text-right'}`}>
                          <span className="font-mono text-sm font-semibold text-haggai">
                            {session.start_time}
                          </span>
                          {session.session_type !== 'break' && (
                            <span className="font-mono text-sm text-stone-400">
                              {' '}- {session.end_time}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                          {session.session_type === 'break' || session.session_type === 'lunch' ? (
                            <div className="flex items-center gap-2 text-amber-700">
                              <Coffee className="h-4 w-4" />
                              <span className="font-medium">{session.title || (session.session_type === 'lunch' ? txt.lunch : txt.break)}</span>
                            </div>
                          ) : (
                            <>
                              <h3 className="font-semibold text-stone-800 text-lg">
                                {getLocalizedText(session, 'title') || session.title}
                              </h3>
                              {session.leader_name && (
                                <p className={`text-stone-600 mt-1 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                  <User className="h-4 w-4 text-haggai" />
                                  {session.leader_name}
                                </p>
                              )}
                              {session.description && (
                                <p className="text-stone-500 mt-2 text-sm">
                                  {session.description}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-stone-500 text-sm print:hidden">
          <p>Haggai Sweden | <a href="https://haggai.se" className="text-haggai hover:underline">haggai.se</a> <span className="text-stone-400">(By Keeada)</span></p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border { border: 1px solid #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
};

export default PublicAgenda;
