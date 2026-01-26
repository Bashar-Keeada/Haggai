import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { Download, Printer, ArrowLeft, LogOut, User, IdCard } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberNameBadge = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const translations = {
    sv: {
      title: 'Din Namnskylt',
      subtitle: 'Ladda ner eller skriv ut din namnskylt för workshopen',
      backToPortal: 'Tillbaka till Mina Sidor',
      logout: 'Logga ut',
      download: 'Ladda ner',
      print: 'Skriv ut',
      participant: 'PARTICIPANT',
      workshop: 'WORKSHOP',
      notAvailable: 'Namnbricka ej tillgänglig',
      notApproved: 'Du behöver vara godkänd för en workshop för att se din namnbricka.',
      loading: 'Laddar...',
      registered: 'Registrerad'
    },
    en: {
      title: 'Your Name Badge',
      subtitle: 'Download or print your name badge for the workshop',
      backToPortal: 'Back to My Pages',
      logout: 'Log out',
      download: 'Download',
      print: 'Print',
      participant: 'PARTICIPANT',
      workshop: 'WORKSHOP',
      notAvailable: 'Name badge not available',
      notApproved: 'You need to be approved for a workshop to see your name badge.',
      loading: 'Loading...',
      registered: 'Registered'
    },
    ar: {
      title: 'شارة الاسم الخاصة بك',
      subtitle: 'قم بتنزيل أو طباعة شارة الاسم الخاصة بك للورشة',
      backToPortal: 'العودة إلى صفحاتي',
      logout: 'تسجيل الخروج',
      download: 'تحميل',
      print: 'طباعة',
      participant: 'مشارك',
      workshop: 'ورشة العمل',
      notAvailable: 'شارة الاسم غير متاحة',
      notApproved: 'يجب أن تكون معتمدًا لورشة عمل لرؤية شارة الاسم الخاصة بك.',
      loading: 'جاري التحميل...',
      registered: 'مسجل'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    const token = localStorage.getItem('member_token');
    if (!token) {
      navigate('/medlem/login');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/members/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data);

        // Check if member has an approved nomination (participant)
        if (data.nomination_id) {
          fetchParticipantData(data.nomination_id);
        }
      } else if (response.status === 401) {
        localStorage.removeItem('member_token');
        navigate('/medlem/login');
      }
    } catch (err) {
      console.error('Error fetching member data:', err);
      toast.error('Kunde inte ladda din profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantData = async (nominationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${nominationId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'approved') {
          setParticipant(data);
        }
      }
    } catch (err) {
      console.error('Error fetching participant data:', err);
    }
  };

  const handleDownload = async () => {
    if (!participant) return;

    setDownloading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/${participant.id}/name-badge`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Namnskylt_${participant.registration_data?.full_name || participant.nominee_name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Namnbrickan har laddats ner!');
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      console.error('Error downloading badge:', err);
      toast.error('Kunde inte ladda ner namnbrickan');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!participant) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/participants/${participant.id}/name-badge`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
          iframe.contentWindow.print();
        };
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        throw new Error('Print failed');
      }
    } catch (err) {
      console.error('Error printing badge:', err);
      toast.error('Kunde inte skriva ut namnbrickan');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('member_token');
    navigate('/medlem/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-stone-600">{txt.loading}</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/mina-sidor')}
            className="text-stone-600 hover:text-haggai"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {txt.backToPortal}
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <IdCard className="h-3 w-3 mr-1" />
              {txt.registered}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {txt.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <IdCard className="h-8 w-8 text-haggai" />
            <h1 className="text-3xl font-bold text-stone-800">{txt.title}</h1>
          </div>
          <p className="text-stone-600">{txt.subtitle}</p>
        </div>

        {participant ? (
          <Card className="border-0 shadow-xl max-w-md mx-auto">
            <CardContent className="p-8">
              {/* Name Badge Preview - Vertical Format */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-stone-100 mb-6">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#0891B2] to-[#0e7490] text-white py-8 px-6 text-center">
                  <img src="/haggai-logo-white.png" alt="HAGGAI" className="h-12 mx-auto mb-3" />
                  <div className="bg-[#22D3EE] text-white text-sm font-bold py-2 px-4 rounded-lg inline-block">
                    {txt.participant}
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white py-10 px-6 text-center">
                  <div className="text-3xl font-bold text-stone-800 mb-2">
                    {participant.registration_data?.full_name || participant.nominee_name}
                  </div>
                  <div className="text-stone-500 mb-8">
                    {participant.registration_data?.church_name || participant.nominee_church || ''}
                  </div>

                  <div className="border-t pt-6">
                    <div className="text-xs text-stone-400 tracking-widest mb-2">{txt.workshop}</div>
                    <div className="text-lg font-bold text-stone-800">
                      {participant.event_title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="bg-stone-800 hover:bg-stone-900 text-white flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {txt.download}
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="border-stone-300 hover:bg-stone-50 flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {txt.print}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <IdCard className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">{txt.notAvailable}</h3>
              <p className="text-stone-500">{txt.notApproved}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MemberNameBadge;
