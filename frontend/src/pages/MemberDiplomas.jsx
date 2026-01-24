import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, GraduationCap, Award, Calendar, ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberDiplomas = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    sv: {
      title: 'Mina Diplom',
      back: 'Tillbaka',
      noDiplomas: 'Inga diplom ännu',
      noDisplomasDesc: 'Dina diplom visas här när du har slutfört utbildningar',
      completedOn: 'Slutförd',
      viewDiploma: 'Visa diplom'
    },
    en: {
      title: 'My Diplomas',
      back: 'Back',
      noDiplomas: 'No diplomas yet',
      noDisplomasDesc: 'Your diplomas will appear here when you complete trainings',
      completedOn: 'Completed on',
      viewDiploma: 'View diploma'
    },
    ar: {
      title: 'شهاداتي',
      back: 'رجوع',
      noDiplomas: 'لا توجد شهادات بعد',
      noDisplomasDesc: 'ستظهر شهاداتك هنا عند إكمال التدريب',
      completedOn: 'أُكمل في',
      viewDiploma: 'عرض الشهادة'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchMember();
  }, []);

  const fetchMember = async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/members/me?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setMember(data);
      } else {
        navigate('/medlem-login');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haggai"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-16 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-haggai text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/mina-sidor')}
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {txt.back}
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Award className="h-8 w-8" />
            {txt.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {!member?.diplomas || member.diplomas.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 text-lg">{txt.noDiplomas}</p>
              <p className="text-stone-400 mt-1">{txt.noDisplomasDesc}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {member.diplomas.map((diploma, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-stone-800 mb-2">
                        {diploma.event_title}
                      </h3>
                      <div className="flex items-center gap-2 text-stone-500">
                        <Calendar className="h-4 w-4" />
                        <span>{txt.completedOn}: </span>
                        <span className="font-medium">
                          {diploma.event_date || new Date(diploma.completed_at).toLocaleDateString('sv-SE')}
                        </span>
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

export default MemberDiplomas;
