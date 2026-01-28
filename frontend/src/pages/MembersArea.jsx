import React, { useState, useEffect } from 'react';
import { FileText, Users, Building2, Calendar, Lock, BookOpen, Eye, EyeOff, LogIn, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import BoardMeetings from '../components/BoardMeetings';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MembersArea = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated, loginMembers, logoutMembers } = useAuth();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [facilitators, setFacilitators] = useState([]);
  const [currentBoard, setCurrentBoard] = useState([]);
  
  // Login state
  const [membersPassword, setMembersPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const fetchData = async () => {
    try {
      const [workshopsRes, facilitatorsRes, boardRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/workshops?active_only=true`),
        fetch(`${BACKEND_URL}/api/leader-registrations?status=approved`),
        fetch(`${BACKEND_URL}/api/board-members?current_only=true`)
      ]);
      
      if (workshopsRes.ok) setWorkshops(await workshopsRes.json());
      if (facilitatorsRes.ok) setFacilitators(await facilitatorsRes.json());
      if (boardRes.ok) setCurrentBoard(await boardRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isMembersAuthenticated) {
      fetchData();
    }
  }, [isMembersAuthenticated]);

  const translations = {
    sv: {
      pageTitle: 'Kunskapsstöd',
      ourUnity: 'Vår Enhet',
      upcomingWorkshops: 'Utbildningar',
      facilitatorsTitle: 'Facilitatorer',
      coreSubjectsTitle: 'Kärnämnen',
      bylaws: 'Stadgar',
      boardMembers: 'Styrelse',
      meetings: 'Möten',
      loginTitle: 'Medlemsinloggning',
      loginSubtitle: 'Ange lösenord för tillgång',
      password: 'Lösenord',
      passwordPlaceholder: 'Ange lösenord...',
      loginButton: 'Logga in',
      loginError: 'Felaktigt lösenord',
      contactForAccess: 'Kontakta oss för tillgång',
      logout: 'Logga ut'
    },
    en: {
      pageTitle: 'Knowledge Support',
      ourUnity: 'Our Unity',
      upcomingWorkshops: 'Trainings',
      facilitatorsTitle: 'Facilitators',
      coreSubjectsTitle: 'Core Subjects',
      bylaws: 'Bylaws',
      boardMembers: 'Board',
      meetings: 'Meetings',
      loginTitle: 'Members Login',
      loginSubtitle: 'Enter password for access',
      password: 'Password',
      passwordPlaceholder: 'Enter password...',
      loginButton: 'Log in',
      loginError: 'Incorrect password',
      contactForAccess: 'Contact us for access',
      logout: 'Log out'
    },
    ar: {
      pageTitle: 'دعم المعرفة',
      ourUnity: 'وحدتنا',
      upcomingWorkshops: 'التدريبات',
      facilitatorsTitle: 'الميسرين',
      coreSubjectsTitle: 'المواضيع',
      bylaws: 'النظام',
      boardMembers: 'المجلس',
      meetings: 'الاجتماعات',
      loginTitle: 'تسجيل الدخول',
      loginSubtitle: 'أدخل كلمة المرور',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور...',
      loginButton: 'تسجيل الدخول',
      loginError: 'كلمة المرور غير صحيحة',
      contactForAccess: 'اتصل بنا للوصول',
      logout: 'تسجيل الخروج'
    }
  };

  const txt = translations[language] || translations.sv;

  const handleMembersLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginMembers(membersPassword)) {
      toast.success(txt.pageTitle);
      setMembersPassword('');
    } else {
      setLoginError(txt.loginError);
    }
  };

  // Login screen
  if (!isMembersAuthenticated) {
    return (
      <div className={`min-h-screen bg-cream-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 bg-haggai rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-lg text-stone-800">{txt.loginTitle}</CardTitle>
            <p className="text-stone-500 text-xs mt-1">{txt.loginSubtitle}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMembersLogin} className="space-y-3">
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={membersPassword}
                  onChange={(e) => setMembersPassword(e.target.value)}
                  placeholder={txt.passwordPlaceholder}
                  className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-4 text-sm`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 ${isRTL ? 'left-3' : 'right-3'}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
              <Button type="submit" className="w-full bg-haggai hover:bg-haggai-dark text-white py-4 text-sm">
                <LogIn className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {txt.loginButton}
              </Button>
              <div className="text-center pt-2 border-t border-stone-200">
                <p className="text-xs text-stone-500">{txt.contactForAccess}</p>
                <a href="tel:+46707825082" className="text-haggai hover:underline text-xs">+46 70 782 50 82</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="pt-16 pb-3 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Badge className="bg-haggai text-cream-50 text-xs px-2 py-1">
                <Lock className="h-3 w-3 mr-1" />
                {language === 'sv' ? 'Medlem' : language === 'ar' ? 'عضو' : 'Member'}
              </Badge>
              <h1 className="text-xl font-bold text-stone-800">{txt.pageTitle}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={logoutMembers} className="text-stone-600 hover:text-stone-800 text-sm">
              {txt.logout}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Grid - All as links to separate pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            
            {/* Vår Enhet */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/enhet')}
              data-testid="unity-card"
            >
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-4 text-center">
                <Heart className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{txt.ourUnity}</p>
              </div>
            </Card>

            {/* Utbildningar */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/utbildningar')}
              data-testid="workshops-card"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-center">
                <Calendar className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{txt.upcomingWorkshops}</p>
                <Badge className="bg-white/20 text-white text-xs mt-1">{workshops.length}</Badge>
              </div>
            </Card>

            {/* Facilitatorer */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/facilitatorer')}
              data-testid="facilitators-card"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-center">
                <Users className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{txt.facilitatorsTitle}</p>
                <Badge className="bg-white/20 text-white text-xs mt-1">{facilitators.length}</Badge>
              </div>
            </Card>

            {/* Kärnämnen */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/karnamnen')}
              data-testid="knowledge-card"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-center">
                <BookOpen className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{txt.coreSubjectsTitle}</p>
                <Badge className="bg-white/20 text-white text-xs mt-1">21h</Badge>
              </div>
            </Card>

            {/* Stadgar */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/stadgar')}
              data-testid="bylaws-card"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-center">
                <FileText className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{txt.bylaws}</p>
              </div>
            </Card>

            {/* Styrelse */}
            <Card 
              className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => navigate('/medlemmar/styrelse')}
              data-testid="board-card"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-center">
                <Building2 className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{txt.boardMembers}</p>
                <Badge className="bg-white/20 text-white text-xs mt-1">{currentBoard.length || 5}</Badge>
              </div>
            </Card>
          </div>

          {/* Meetings Section - Always visible */}
          <Card className="border-0 shadow-md" data-testid="meetings-section">
            <CardHeader className="bg-gradient-to-r from-stone-600 to-stone-700 text-white py-3 px-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {txt.meetings}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <BoardMeetings />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MembersArea;
