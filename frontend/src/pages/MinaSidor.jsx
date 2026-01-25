import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, MessageSquare, GraduationCap, Users, Settings, LogOut, 
  Bell, Edit, Mail, Phone, MapPin, Award, Heart, Briefcase,
  MessageCircle, ArrowLeft, ClipboardCheck, IdCard
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MinaSidor = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);

  const translations = {
    sv: {
      title: 'Mina Sidor',
      welcome: 'Välkommen',
      profile: 'Min Profil',
      editProfile: 'Redigera profil',
      messages: 'Meddelanden',
      newMessages: 'nya',
      diplomas: 'Mina Diplom',
      nameBadge: 'Namnskylt',
      members: 'Medlemskatalog',
      forum: 'Diskussionsforum',
      settings: 'Inställningar',
      logout: 'Logga ut',
      expertise: 'Expertis',
      interests: 'Intressen',
      noExpertise: 'Ingen expertis vald',
      noInterests: 'Inga intressen valda',
      memberSince: 'Medlem sedan',
      viewAll: 'Visa alla',
      backToHome: 'Tillbaka till startsidan',
      pendingEvaluations: 'Väntande utvärderingar',
      evaluateNow: 'Utvärdera nu',
      noEvaluations: 'Inga väntande utvärderingar'
    },
    en: {
      title: 'My Pages',
      welcome: 'Welcome',
      profile: 'My Profile',
      editProfile: 'Edit profile',
      messages: 'Messages',
      newMessages: 'new',
      diplomas: 'My Diplomas',
      nameBadge: 'Name Badge',
      members: 'Member Directory',
      forum: 'Discussion Forum',
      settings: 'Settings',
      logout: 'Log out',
      expertise: 'Expertise',
      interests: 'Interests',
      noExpertise: 'No expertise selected',
      noInterests: 'No interests selected',
      memberSince: 'Member since',
      viewAll: 'View all',
      backToHome: 'Back to home',
      pendingEvaluations: 'Pending Evaluations',
      evaluateNow: 'Evaluate now',
      noEvaluations: 'No pending evaluations'
    },
    ar: {
      title: 'صفحاتي',
      welcome: 'أهلاً',
      profile: 'ملفي الشخصي',
      editProfile: 'تعديل الملف',
      messages: 'الرسائل',
      newMessages: 'جديد',
      diplomas: 'شهاداتي',
      nameBadge: 'شارة الاسم',
      members: 'دليل الأعضاء',
      forum: 'منتدى النقاش',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      expertise: 'الخبرة',
      interests: 'الاهتمامات',
      noExpertise: 'لم يتم اختيار خبرة',
      noInterests: 'لم يتم اختيار اهتمامات',
      memberSince: 'عضو منذ',
      viewAll: 'عرض الكل',
      backToHome: 'العودة للصفحة الرئيسية',
      pendingEvaluations: 'التقييمات المعلقة',
      evaluateNow: 'قيم الآن',
      noEvaluations: 'لا توجد تقييمات معلقة'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }

    try {
      const [memberRes, evalsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/members/me?token=${token}`),
        fetch(`${BACKEND_URL}/api/member/pending-evaluations?token=${token}`)
      ]);
      
      if (memberRes.ok) {
        const data = await memberRes.json();
        setMember(data);
      } else {
        localStorage.removeItem('memberToken');
        localStorage.removeItem('memberData');
        navigate('/medlem-login');
        return;
      }
      
      if (evalsRes.ok) {
        const evalsData = await evalsRes.json();
        setPendingEvaluations(evalsData);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      toast.error('Kunde inte hämta medlemsdata');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    toast.success('Du har loggat ut');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haggai"></div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  const menuItems = [
    { 
      icon: User, 
      label: txt.profile, 
      link: '/mina-sidor/profil',
      color: 'bg-blue-500'
    },
    { 
      icon: MessageSquare, 
      label: txt.messages, 
      link: '/mina-sidor/meddelanden',
      color: 'bg-green-500',
      badge: member.unread_messages > 0 ? member.unread_messages : null
    },
    { 
      icon: GraduationCap, 
      label: txt.diplomas, 
      link: '/mina-sidor/diplom',
      color: 'bg-purple-500'
    },
    { 
      icon: Users, 
      label: txt.members, 
      link: '/mina-sidor/medlemmar',
      color: 'bg-orange-500'
    },
    { 
      icon: MessageCircle, 
      label: txt.forum, 
      link: '/mina-sidor/forum',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-16 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-haggai text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {txt.backToHome}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {txt.logout}
            </Button>
          </div>
          
          <div className="mt-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {member.profile_image ? (
                <img src={member.profile_image} alt={member.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{txt.welcome}, {member.full_name}!</h1>
              <p className="text-white/80 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {member.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Summary */}
          <div className="md:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{txt.profile}</CardTitle>
                  <Link to="/mina-sidor/profil">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {member.phone && (
                  <div className="flex items-center gap-3 text-stone-600">
                    <Phone className="h-4 w-4 text-stone-400" />
                    {member.phone}
                  </div>
                )}
                {member.city && (
                  <div className="flex items-center gap-3 text-stone-600">
                    <MapPin className="h-4 w-4 text-stone-400" />
                    {member.city}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-haggai" />
                    <span className="font-medium text-stone-700">{txt.expertise}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise && member.expertise.length > 0 ? (
                      member.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-haggai/10 text-haggai">
                          {exp}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400">{txt.noExpertise}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="font-medium text-stone-700">{txt.interests}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.interests && member.interests.length > 0 ? (
                      member.interests.map((int, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-pink-50 text-pink-600">
                          {int}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400">{txt.noInterests}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t text-sm text-stone-500">
                  {txt.memberSince}: {new Date(member.created_at).toLocaleDateString('sv-SE')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Menu Grid */}
          <div className="md:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {menuItems.map((item, idx) => (
                <Link key={idx} to={item.link}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center`}>
                          <item.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-stone-800">{item.label}</h3>
                        </div>
                        {item.badge && (
                          <Badge className="bg-red-500 text-white">
                            {item.badge} {txt.newMessages}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pending Evaluations */}
            {pendingEvaluations.length > 0 && (
              <Card className="border-0 shadow-lg mt-6 border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-orange-500" />
                    {txt.pendingEvaluations}
                    <Badge className="bg-orange-500 text-white">{pendingEvaluations.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingEvaluations.slice(0, 3).map((evaluation, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-stone-800">{evaluation.session_title}</p>
                          <p className="text-sm text-stone-500">
                            {evaluation.workshop_title} • Ledare: {evaluation.leader_name}
                          </p>
                        </div>
                        <Link to={`/utvardering/${evaluation.workshop_id}/${evaluation.session_id}`}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            {txt.evaluateNow}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Diplomas Preview */}
            {member.diplomas && member.diplomas.length > 0 && (
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      {txt.diplomas}
                    </CardTitle>
                    <Link to="/mina-sidor/diplom">
                      <Button variant="ghost" size="sm">{txt.viewAll}</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {member.diplomas.slice(0, 3).map((diploma, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium text-stone-800">{diploma.event_title}</p>
                          <p className="text-sm text-stone-500">{diploma.event_date}</p>
                        </div>
                        <GraduationCap className="h-6 w-6 text-yellow-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinaSidor;
