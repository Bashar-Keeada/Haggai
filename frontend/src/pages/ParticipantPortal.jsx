import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, LogOut, IdCard, Calendar, Info, Download, Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ParticipantPortal = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const [participant, setParticipant] = useState(null);
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);

  const txt = {
    sv: {
      title: 'Deltagare Portal',
      welcome: 'Välkommen',
      logout: 'Logga ut',
      tabs: {
        badge: 'Namnskylt',
        agenda: 'Agenda',
        info: 'Information'
      },
      badge: {
        title: 'Din Namnskylt',
        subtitle: 'Ladda ner eller skriv ut din namnskylt',
        participant: 'PARTICIPANT',
        workshop: 'WORKSHOP',
        download: 'Ladda ner',
        print: 'Skriv ut'
      },
      agenda: {
        title: 'Workshop-agenda',
        noAgenda: 'Ingen agenda tillgänglig än',
        loading: 'Laddar agenda...'
      },
      info: {
        title: 'Workshop-information',
        yourWorkshop: 'Din workshop',
        attendance: 'Närvaro',
        hours: 'timmar'
      }
    },
    en: {
      title: 'Participant Portal',
      welcome: 'Welcome',
      logout: 'Log out',
      tabs: {
        badge: 'Name Badge',
        agenda: 'Agenda',
        info: 'Information'
      },
      badge: {
        title: 'Your Name Badge',
        subtitle: 'Download or print your name badge',
        participant: 'PARTICIPANT',
        workshop: 'WORKSHOP',
        download: 'Download',
        print: 'Print'
      },
      agenda: {
        title: 'Workshop Agenda',
        noAgenda: 'No agenda available yet',
        loading: 'Loading agenda...'
      },
      info: {
        title: 'Workshop Information',
        yourWorkshop: 'Your workshop',
        attendance: 'Attendance',
        hours: 'hours'
      }
    }
  };

  const t = txt[language] || txt.sv;

  useEffect(() => {
    const token = localStorage.getItem('participant_token');
    if (!token) {
      navigate('/deltagare/login');
      return;
    }
    fetchParticipantData(token);
  }, []);

  const fetchParticipantData = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setParticipant(data);
        
        // Fetch agenda if workshop_id exists
        if (data.workshop_id) {
          fetchAgenda(data.workshop_id);
        }
      } else if (response.status === 401) {
        localStorage.removeItem('participant_token');
        navigate('/deltagare/login');
      }
    } catch (err) {
      console.error('Error fetching participant data:', err);
      toast.error('Kunde inte ladda din profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgenda = async (workshopId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/agenda`);
      if (response.ok) {
        const data = await response.json();
        setAgenda(data);
      }
    } catch (err) {
      console.error('Error fetching agenda:', err);
    }
  };

  const handleDownloadBadge = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/${participant.id}/name-badge`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Namnskylt_${participant.full_name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Namnbrickan har laddats ner!');
      }
    } catch (err) {
      toast.error('Kunde inte ladda ner namnbrickan');
    }
  };

  const handlePrintBadge = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/${participant.id}/name-badge`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = () => iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.URL.revokeObjectURL(url);
        }, 1000);
      }
    } catch (err) {
      toast.error('Kunde inte skriva ut namnbrickan');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('participant_token');
    localStorage.removeItem('participant_info');
    navigate('/deltagare/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!participant) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {participant.profile_image ? (
              <img src={participant.profile_image} alt={participant.full_name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-[#0891B2] to-[#0e7490] rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-stone-800">{t.welcome}, {participant.full_name}!</h1>
              <p className="text-sm text-stone-500">{t.title}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="badge" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="badge" className="data-[state=active]:bg-[#0891B2] data-[state=active]:text-white">
              <IdCard className="h-4 w-4 mr-2" />
              {t.tabs.badge}
            </TabsTrigger>
            <TabsTrigger value="agenda" className="data-[state=active]:bg-[#0891B2] data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              {t.tabs.agenda}
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-[#0891B2] data-[state=active]:text-white">
              <Info className="h-4 w-4 mr-2" />
              {t.tabs.info}
            </TabsTrigger>
          </TabsList>

          {/* Badge Tab */}
          <TabsContent value="badge">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-[#0891B2]" />
                  {t.badge.title}
                </CardTitle>
                <p className="text-sm text-stone-500 mt-2">{t.badge.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="max-w-md mx-auto">
                  {/* Badge Preview - Vertical Format */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-stone-100 mb-6">
                    <div className="bg-gradient-to-br from-[#0891B2] to-[#0e7490] text-white py-8 px-6 text-center">
                      <div className="text-3xl font-bold tracking-[0.3em] mb-3">HAGGAI</div>
                      <div className="bg-[#22D3EE] text-white text-sm font-bold py-2 px-4 rounded-lg inline-block">
                        {t.badge.participant}
                      </div>
                    </div>

                    <div className="bg-white py-10 px-6 text-center">
                      <div className="text-2xl font-bold text-stone-800 mb-2">
                        {participant.full_name}
                      </div>
                      <div className="text-stone-500 mb-8">
                        {participant.church_name || ''}
                      </div>

                      <div className="border-t pt-6">
                        <div className="text-xs text-stone-400 tracking-widest mb-2">{t.badge.workshop}</div>
                        <div className="text-lg font-bold text-stone-800">
                          {participant.workshop_title}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadBadge}
                      className="flex-1 bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {t.badge.download}
                    </button>
                    <button
                      onClick={handlePrintBadge}
                      className="flex-1 border-2 border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      {t.badge.print}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agenda Tab */}
          <TabsContent value="agenda">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#0891B2]" />
                  {t.agenda.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agenda ? (
                  <iframe
                    src={`/program/${participant.workshop_id}`}
                    className="w-full h-[600px] border-0 rounded-lg"
                    title="Workshop Agenda"
                  />
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500">{t.agenda.noAgenda}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[#0891B2]" />
                  {t.info.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">{t.info.yourWorkshop}</h3>
                  <p className="text-lg text-haggai font-medium">{participant.workshop_title}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-stone-800 mb-2">{t.info.attendance}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0891B2] to-[#0e7490] h-full transition-all"
                        style={{width: `${Math.min((participant.attendance_hours / 21) * 100, 100)}%`}}
                      />
                    </div>
                    <span className="text-sm font-medium text-stone-700">
                      {participant.attendance_hours || 0}/21 {t.info.hours}
                    </span>
                  </div>
                </div>

                {participant.church_name && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-stone-800 mb-2">Kyrka</h3>
                    <p className="text-stone-600">{participant.church_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ParticipantPortal;
