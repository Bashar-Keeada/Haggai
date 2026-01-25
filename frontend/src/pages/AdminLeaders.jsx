import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, ImageIcon, Mail, Phone, User, Send, RefreshCw, UserPlus, Clock, CheckCircle, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLeaders = () => {
  const { language, isRTL } = useLanguage();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: { sv: '', en: '', ar: '' },
    bio: { sv: '', en: '', ar: '' },
    topics: { sv: [], en: [], ar: [] },
    topicsInput: { sv: '', en: '', ar: '' },
    image_url: '',
    email: '',
    phone: ''
  });

  const translations = {
    sv: {
      title: 'Hantera Ledare & Facilitatorer',
      subtitle: 'Lägg till, redigera eller ta bort ledare och facilitatorer',
      addNew: 'Lägg till ny ledare',
      name: 'Namn',
      role: 'Roll/Titel',
      bio: 'Biografi',
      topics: 'Ämnen (separera med komma)',
      imageUrl: 'Bild URL',
      email: 'E-post',
      phone: 'Telefon',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Ta bort',
      noLeaders: 'Inga ledare har lagts till ännu.',
      confirmDelete: 'Är du säker på att du vill ta bort denna ledare?',
      swedish: 'Svenska',
      english: 'Engelska',
      arabic: 'Arabiska',
      active: 'Aktiv',
      inactive: 'Inaktiv'
    },
    en: {
      title: 'Manage Leaders & Facilitators',
      subtitle: 'Add, edit or remove leaders and facilitators',
      addNew: 'Add new leader',
      name: 'Name',
      role: 'Role/Title',
      bio: 'Biography',
      topics: 'Topics (separate with comma)',
      imageUrl: 'Image URL',
      email: 'Email',
      phone: 'Phone',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      noLeaders: 'No leaders have been added yet.',
      confirmDelete: 'Are you sure you want to delete this leader?',
      swedish: 'Swedish',
      english: 'English',
      arabic: 'Arabic',
      active: 'Active',
      inactive: 'Inactive'
    },
    ar: {
      title: 'إدارة القادة والميسرين',
      subtitle: 'إضافة أو تعديل أو حذف القادة والميسرين',
      addNew: 'إضافة قائد جديد',
      name: 'الاسم',
      role: 'الدور/المسمى',
      bio: 'السيرة الذاتية',
      topics: 'المواضيع (افصل بفاصلة)',
      imageUrl: 'رابط الصورة',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      noLeaders: 'لم تتم إضافة قادة بعد.',
      confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا القائد؟',
      swedish: 'السويدية',
      english: 'الإنجليزية',
      arabic: 'العربية',
      active: 'نشط',
      inactive: 'غير نشط'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders?active_only=false`);
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast.error('Kunde inte hämta ledare');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (leader = null) => {
    if (leader) {
      setEditingLeader(leader);
      setFormData({
        name: leader.name,
        role: leader.role || { sv: '', en: '', ar: '' },
        bio: leader.bio || { sv: '', en: '', ar: '' },
        topics: leader.topics || { sv: [], en: [], ar: [] },
        topicsInput: {
          sv: (leader.topics?.sv || []).join(', '),
          en: (leader.topics?.en || []).join(', '),
          ar: (leader.topics?.ar || []).join(', ')
        },
        image_url: leader.image_url || '',
        email: leader.email || '',
        phone: leader.phone || ''
      });
    } else {
      setEditingLeader(null);
      setFormData({
        name: '',
        role: { sv: '', en: '', ar: '' },
        bio: { sv: '', en: '', ar: '' },
        topics: { sv: [], en: [], ar: [] },
        topicsInput: { sv: '', en: '', ar: '' },
        image_url: '',
        email: '',
        phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLeader(null);
  };

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert topics input to arrays
    const processedTopics = {
      sv: formData.topicsInput.sv.split(',').map(t => t.trim()).filter(t => t),
      en: formData.topicsInput.en.split(',').map(t => t.trim()).filter(t => t),
      ar: formData.topicsInput.ar.split(',').map(t => t.trim()).filter(t => t)
    };

    const leaderData = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio,
      topics: processedTopics,
      image_url: formData.image_url || null,
      email: formData.email || null,
      phone: formData.phone || null
    };

    try {
      let response;
      if (editingLeader) {
        response = await fetch(`${BACKEND_URL}/api/leaders/${editingLeader.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leaderData)
        });
      } else {
        response = await fetch(`${BACKEND_URL}/api/leaders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leaderData)
        });
      }

      if (response.ok) {
        toast.success(editingLeader ? 'Ledare uppdaterad!' : 'Ledare tillagd!');
        fetchLeaders();
        closeModal();
      } else {
        throw new Error('Failed to save leader');
      }
    } catch (error) {
      console.error('Error saving leader:', error);
      toast.error('Kunde inte spara ledare');
    }
  };

  const handleDelete = async (leaderId) => {
    if (!window.confirm(txt.confirmDelete)) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders/${leaderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Ledare borttagen!');
        fetchLeaders();
      } else {
        throw new Error('Failed to delete leader');
      }
    } catch (error) {
      console.error('Error deleting leader:', error);
      toast.error('Kunde inte ta bort ledare');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 py-24 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold text-stone-800 mb-4">{txt.title}</h1>
          <p className="text-lg text-stone-600 mb-8">{txt.subtitle}</p>
          
          <Button 
            onClick={() => openModal()}
            className="bg-haggai hover:bg-haggai-dark text-cream-50"
          >
            <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {txt.addNew}
          </Button>
        </div>

        {/* Leaders Grid */}
        {leaders.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-lg text-stone-500">{txt.noLeaders}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader) => (
              <Card key={leader.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {leader.image_url ? (
                      <img 
                        src={leader.image_url} 
                        alt={leader.name}
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-haggai-100 flex items-center justify-center flex-shrink-0">
                        <User className="h-10 w-10 text-haggai" />
                      </div>
                    )}
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h3 className="text-lg font-semibold text-stone-800">{leader.name}</h3>
                        <Badge variant={leader.is_active ? 'default' : 'secondary'} className="text-xs">
                          {leader.is_active ? txt.active : txt.inactive}
                        </Badge>
                      </div>
                      <p className="text-haggai font-medium text-sm mb-2">
                        {leader.role?.[language] || leader.role?.sv}
                      </p>
                      <p className="text-stone-600 text-sm line-clamp-2 mb-3">
                        {leader.bio?.[language] || leader.bio?.sv}
                      </p>
                      {leader.topics?.[language]?.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mb-3 ${isRTL ? 'justify-end' : ''}`}>
                          {(leader.topics[language] || leader.topics.sv || []).slice(0, 3).map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex gap-2 mt-4 pt-4 border-t border-stone-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openModal(leader)}
                      className="flex-1"
                    >
                      <Edit className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {txt.edit}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(leader.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className={`sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-2xl font-bold text-stone-800">
                  {editingLeader ? txt.edit : txt.addNew}
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-stone-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {txt.name} *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {txt.imageUrl}
                    </label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {txt.email}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {txt.phone}
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Multi-language Fields */}
                {['sv', 'en', 'ar'].map((lang) => (
                  <div key={lang} className="border border-stone-200 rounded-xl p-4">
                    <h3 className={`font-semibold text-stone-800 mb-4 ${isRTL ? 'text-right' : ''}`}>
                      {lang === 'sv' ? txt.swedish : lang === 'en' ? txt.english : txt.arabic}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL || lang === 'ar' ? 'text-right' : ''}`}>
                          {txt.role}
                        </label>
                        <Input
                          value={formData.role[lang]}
                          onChange={(e) => handleInputChange('role', e.target.value, lang)}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL || lang === 'ar' ? 'text-right' : ''}`}>
                          {txt.bio}
                        </label>
                        <textarea
                          value={formData.bio[lang]}
                          onChange={(e) => handleInputChange('bio', e.target.value, lang)}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                          rows={3}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-haggai focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL || lang === 'ar' ? 'text-right' : ''}`}>
                          {txt.topics}
                        </label>
                        <Input
                          value={formData.topicsInput[lang]}
                          onChange={(e) => handleInputChange('topicsInput', e.target.value, lang)}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                          placeholder={lang === 'ar' ? 'موضوع 1, موضوع 2' : 'Topic 1, Topic 2'}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Submit Buttons */}
                <div className={`flex gap-4 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button 
                    type="submit"
                    className="bg-haggai hover:bg-haggai-dark text-cream-50 flex-1"
                  >
                    <Save className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {txt.save}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                  >
                    {txt.cancel}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaders;
