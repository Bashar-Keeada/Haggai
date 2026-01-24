import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Save, User, Camera, Loader2, X, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberProfile = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    phone: '',
    city: '',
    bio: '',
    expertise: [],
    interests: [],
    profile_image: null
  });

  const translations = {
    sv: {
      title: 'Redigera Profil',
      back: 'Tillbaka',
      phone: 'Telefon',
      city: 'Stad',
      bio: 'Om mig',
      bioPlaceholder: 'Berätta lite om dig själv, din erfarenhet och vad du gör...',
      expertise: 'Expertis',
      expertiseDesc: 'Välj de områden där du har expertkunskap',
      interests: 'Intressen',
      interestsDesc: 'Välj de områden som intresserar dig',
      profileImage: 'Profilbild',
      uploadImage: 'Ladda upp bild',
      save: 'Spara ändringar',
      saving: 'Sparar...',
      saved: 'Profil uppdaterad!',
      changePassword: 'Byt lösenord',
      currentPassword: 'Nuvarande lösenord',
      newPassword: 'Nytt lösenord',
      confirmPassword: 'Bekräfta lösenord'
    },
    en: {
      title: 'Edit Profile',
      back: 'Back',
      phone: 'Phone',
      city: 'City',
      bio: 'About me',
      bioPlaceholder: 'Tell us about yourself, your experience and what you do...',
      expertise: 'Expertise',
      expertiseDesc: 'Select areas where you have expert knowledge',
      interests: 'Interests',
      interestsDesc: 'Select areas that interest you',
      profileImage: 'Profile image',
      uploadImage: 'Upload image',
      save: 'Save changes',
      saving: 'Saving...',
      saved: 'Profile updated!',
      changePassword: 'Change password',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password'
    },
    ar: {
      title: 'تعديل الملف الشخصي',
      back: 'رجوع',
      phone: 'الهاتف',
      city: 'المدينة',
      bio: 'عني',
      bioPlaceholder: 'أخبرنا عن نفسك وخبرتك وماذا تفعل...',
      expertise: 'الخبرة',
      expertiseDesc: 'اختر المجالات التي لديك فيها خبرة',
      interests: 'الاهتمامات',
      interestsDesc: 'اختر المجالات التي تهمك',
      profileImage: 'صورة الملف الشخصي',
      uploadImage: 'رفع صورة',
      save: 'حفظ التغييرات',
      saving: 'جاري الحفظ...',
      saved: 'تم تحديث الملف الشخصي!',
      changePassword: 'تغيير كلمة المرور',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }

    try {
      const [memberRes, categoriesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/members/me?token=${token}`),
        fetch(`${BACKEND_URL}/api/categories`)
      ]);

      if (memberRes.ok) {
        const memberData = await memberRes.json();
        setMember(memberData);
        setFormData({
          phone: memberData.phone || '',
          city: memberData.city || '',
          bio: memberData.bio || '',
          expertise: memberData.expertise || [],
          interests: memberData.interests || [],
          profile_image: memberData.profile_image
        });
      } else {
        navigate('/medlem-login');
        return;
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Bilden får max vara 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSelection = (type, value) => {
    setFormData(prev => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('memberToken');

    try {
      const response = await fetch(`${BACKEND_URL}/api/members/me?token=${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(txt.saved);
        const updatedMember = await response.json();
        setMember(updatedMember);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte spara');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Ett fel uppstod');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haggai"></div>
      </div>
    );
  }

  const expertiseCategories = categories.filter(c => c.type === 'expertise');
  const interestCategories = categories.filter(c => c.type === 'interest');

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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6 space-y-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                  {formData.profile_image ? (
                    <img src={formData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-stone-300" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-haggai rounded-full flex items-center justify-center cursor-pointer hover:bg-haggai-dark transition-colors">
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-stone-500 mt-2">{txt.uploadImage}</p>
            </div>

            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{txt.phone}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+46 70 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.city}</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Stockholm"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>{txt.bio}</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder={txt.bioPlaceholder}
                rows={4}
              />
            </div>

            {/* Expertise */}
            <div className="space-y-3">
              <div>
                <Label className="text-base">{txt.expertise}</Label>
                <p className="text-sm text-stone-500">{txt.expertiseDesc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertiseCategories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={formData.expertise.includes(cat.name) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      formData.expertise.includes(cat.name) 
                        ? 'bg-haggai hover:bg-haggai-dark' 
                        : 'hover:bg-haggai/10'
                    }`}
                    onClick={() => toggleSelection('expertise', cat.name)}
                  >
                    {formData.expertise.includes(cat.name) && <Check className="h-3 w-3 mr-1" />}
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <div>
                <Label className="text-base">{txt.interests}</Label>
                <p className="text-sm text-stone-500">{txt.interestsDesc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {interestCategories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={formData.interests.includes(cat.name) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      formData.interests.includes(cat.name) 
                        ? 'bg-pink-500 hover:bg-pink-600' 
                        : 'hover:bg-pink-50'
                    }`}
                    onClick={() => toggleSelection('interests', cat.name)}
                  >
                    {formData.interests.includes(cat.name) && <Check className="h-3 w-3 mr-1" />}
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-haggai hover:bg-haggai-dark text-white py-6"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {txt.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {txt.save}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberProfile;
