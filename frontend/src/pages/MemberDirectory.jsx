import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, User, Mail, MapPin, Briefcase, Heart, MessageSquare } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberDirectory = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const translations = {
    sv: {
      title: 'Medlemskatalog',
      back: 'Tillbaka',
      expertise: 'Expertis',
      interests: 'Intressen',
      sendMessage: 'Skicka meddelande',
      noMembers: 'Inga medlemmar hittades',
      memberCount: 'medlemmar'
    },
    en: {
      title: 'Member Directory',
      back: 'Back',
      expertise: 'Expertise',
      interests: 'Interests',
      sendMessage: 'Send message',
      noMembers: 'No members found',
      memberCount: 'members'
    },
    ar: {
      title: 'دليل الأعضاء',
      back: 'رجوع',
      expertise: 'الخبرة',
      interests: 'الاهتمامات',
      sendMessage: 'إرسال رسالة',
      noMembers: 'لم يتم العثور على أعضاء',
      memberCount: 'أعضاء'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }

    try {
      // Get current member ID
      const meRes = await fetch(`${BACKEND_URL}/api/members/me?token=${token}`);
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentMemberId(meData.id);
      }

      const response = await fetch(`${BACKEND_URL}/api/members?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        navigate('/medlem-login');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Kunde inte hämta medlemmar');
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
          <h1 className="text-2xl font-bold">{txt.title}</h1>
          <p className="text-white/80 mt-1">{members.length} {txt.memberCount}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {members.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noMembers}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {member.profile_image ? (
                        <img src={member.profile_image} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-8 w-8 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-stone-800 truncate">{member.full_name}</h3>
                      {member.city && (
                        <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {member.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-sm text-stone-600 mt-4 line-clamp-2">{member.bio}</p>
                  )}

                  {member.expertise && member.expertise.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {txt.expertise}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 3).map((exp, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-haggai/10 text-haggai text-xs">
                            {exp}
                          </Badge>
                        ))}
                        {member.expertise.length > 3 && (
                          <Badge variant="secondary" className="bg-stone-100 text-stone-500 text-xs">
                            +{member.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {member.interests && member.interests.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {txt.interests}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.interests.slice(0, 3).map((int, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-pink-50 text-pink-600 text-xs">
                            {int}
                          </Badge>
                        ))}
                        {member.interests.length > 3 && (
                          <Badge variant="secondary" className="bg-stone-100 text-stone-500 text-xs">
                            +{member.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {member.id !== currentMemberId && (
                    <Link to={`/mina-sidor/meddelanden/${member.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {txt.sendMessage}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDirectory;
