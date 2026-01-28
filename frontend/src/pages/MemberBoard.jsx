import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Building2, User, ChevronDown, ChevronUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberBoard = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentBoard, setCurrentBoard] = useState([]);
  const [previousBoard, setPreviousBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
      return;
    }
    fetchBoardMembers();
  }, [isMembersAuthenticated, navigate]);

  const fetchBoardMembers = async () => {
    try {
      const [currentRes, archivedRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/board-members?current_only=true`),
        fetch(`${BACKEND_URL}/api/board-members/archive`)
      ]);
      
      if (currentRes.ok) {
        const data = await currentRes.json();
        setCurrentBoard(data);
      }
      if (archivedRes.ok) {
        const data = await archivedRes.json();
        setPreviousBoard(data);
      }
    } catch (error) {
      console.error('Error fetching board members:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    sv: {
      title: 'Styrelse',
      subtitle: 'Nuvarande styrelsemedlemmar',
      back: 'Tillbaka',
      noMembers: 'Inga styrelsemedlemmar registrerade.',
      showPrevious: 'Visa tidigare',
      hidePrevious: 'Dölj tidigare',
      previousBoards: 'Tidigare styrelser',
      term: 'Mandatperiod'
    },
    en: {
      title: 'Board',
      subtitle: 'Current board members',
      back: 'Back',
      noMembers: 'No board members registered.',
      showPrevious: 'Show previous',
      hidePrevious: 'Hide previous',
      previousBoards: 'Previous boards',
      term: 'Term'
    },
    ar: {
      title: 'المجلس',
      subtitle: 'أعضاء المجلس الحاليين',
      back: 'رجوع',
      noMembers: 'لم يتم تسجيل أعضاء المجلس.',
      showPrevious: 'عرض السابق',
      hidePrevious: 'إخفاء السابق',
      previousBoards: 'المجالس السابقة',
      term: 'الفترة'
    }
  };

  const txt = translations[language] || translations.sv;

  const defaultBoard = [
    { name: 'Bashar', role: language === 'sv' ? 'Ordförande' : language === 'ar' ? 'الرئيس' : 'Chairman' },
    { name: 'Ravi', role: language === 'sv' ? 'Kassör' : language === 'ar' ? 'أمين الصندوق' : 'Treasurer' },
    { name: 'Mazin', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' },
    { name: 'Peter', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' },
    { name: 'Alen', role: language === 'sv' ? 'Ledamot' : language === 'ar' ? 'عضو' : 'Member' }
  ];

  const displayBoard = currentBoard.length > 0 ? currentBoard : defaultBoard;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-indigo-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          {previousBoard.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPrevious(!showPrevious)}
              className="text-xs h-8"
            >
              {showPrevious ? txt.hidePrevious : txt.showPrevious}
              {showPrevious ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          )}
        </div>

        {/* Compact Title */}
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
            <p className="text-xs text-stone-500">{txt.subtitle}</p>
          </div>
        </div>

        {/* Current Board Grid */}
        {displayBoard.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-stone-500 text-sm">{txt.noMembers}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {displayBoard.map((member, idx) => (
              <Card 
                key={member.id || idx} 
                className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white"
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-center">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.name}
                        className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-white/30 shadow"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full mx-auto bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <User className="h-7 w-7 text-white/90" />
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-white mt-2">{member.name}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-3 text-center">
                    <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                      {member.role}
                    </Badge>
                    {member.email && (
                      <p className="text-xs text-stone-500 mt-2 truncate">{member.email}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Previous Boards */}
        {showPrevious && previousBoard.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-bold text-stone-700 mb-3">{txt.previousBoards}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {previousBoard.map((member, idx) => (
                <Card key={member.id || idx} className="border-0 shadow-sm bg-stone-50">
                  <CardContent className="p-2 text-center">
                    <div className="w-10 h-10 rounded-full mx-auto bg-stone-200 flex items-center justify-center mb-1">
                      <User className="h-5 w-5 text-stone-400" />
                    </div>
                    <p className="text-xs font-medium text-stone-700">{member.name}</p>
                    <p className="text-[10px] text-stone-500">{member.role}</p>
                    {member.term && (
                      <Badge variant="outline" className="text-[10px] mt-1">{member.term}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberBoard;
