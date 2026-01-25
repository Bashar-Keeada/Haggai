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
  const [invitations, setInvitations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [workshopTopics, setWorkshopTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', workshop_id: '', workshop_title: '', language: 'sv' });
  const [activeTab, setActiveTab] = useState('leaders');
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
      sendInvite: 'Skicka inbjudan',
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
      inactive: 'Inaktiv',
      tabs: {
        leaders: 'Ledare',
        invitations: 'Inbjudningar',
        registrations: 'Registreringar'
      },
      invite: {
        title: 'Skicka ledarinbjudan',
        subtitle: 'Skicka en inbjudan via e-post så att ledaren kan registrera sig',
        namePlaceholder: 'Ledarens namn',
        emailPlaceholder: 'ledare@email.se',
        workshopOptional: 'Workshop (valfritt)',
        send: 'Skicka inbjudan',
        sending: 'Skickar...'
      },
      invitations: {
        noInvitations: 'Inga inbjudningar har skickats ännu.',
        status: 'Status',
        pending: 'Väntande',
        registered: 'Registrerad',
        expired: 'Utgången',
        sentAt: 'Skickad',
        resend: 'Skicka igen'
      },
      registrations: {
        noRegistrations: 'Inga registreringar väntar på godkännande.',
        approve: 'Godkänn',
        reject: 'Avslå',
        pending: 'Väntande',
        approved: 'Godkänd',
        rejected: 'Avslagen',
        costSelf: 'Egen kostnad',
        costHaggai: 'Haggai bidrar',
        arrival: 'Ankomst',
        departure: 'Avresa'
      }
    },
    en: {
      title: 'Manage Leaders & Facilitators',
      subtitle: 'Add, edit or remove leaders and facilitators',
      addNew: 'Add new leader',
      sendInvite: 'Send invitation',
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
      inactive: 'Inactive',
      tabs: {
        leaders: 'Leaders',
        invitations: 'Invitations',
        registrations: 'Registrations'
      },
      invite: {
        title: 'Send leader invitation',
        subtitle: 'Send an email invitation so the leader can register',
        namePlaceholder: 'Leader name',
        emailPlaceholder: 'leader@email.com',
        workshopOptional: 'Workshop (optional)',
        send: 'Send invitation',
        sending: 'Sending...'
      },
      invitations: {
        noInvitations: 'No invitations have been sent yet.',
        status: 'Status',
        pending: 'Pending',
        registered: 'Registered',
        expired: 'Expired',
        sentAt: 'Sent',
        resend: 'Resend'
      },
      registrations: {
        noRegistrations: 'No registrations waiting for approval.',
        approve: 'Approve',
        reject: 'Reject',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        costSelf: 'Self-funded',
        costHaggai: 'Haggai contributes',
        arrival: 'Arrival',
        departure: 'Departure'
      }
    },
    ar: {
      title: 'إدارة القادة والميسرين',
      subtitle: 'إضافة أو تعديل أو حذف القادة والميسرين',
      addNew: 'إضافة قائد جديد',
      sendInvite: 'إرسال دعوة',
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
      inactive: 'غير نشط',
      tabs: {
        leaders: 'القادة',
        invitations: 'الدعوات',
        registrations: 'التسجيلات'
      },
      invite: {
        title: 'إرسال دعوة للقائد',
        subtitle: 'إرسال دعوة بالبريد الإلكتروني للتسجيل',
        namePlaceholder: 'اسم القائد',
        emailPlaceholder: 'leader@email.com',
        workshopOptional: 'ورشة العمل (اختياري)',
        send: 'إرسال الدعوة',
        sending: 'جاري الإرسال...'
      },
      invitations: {
        noInvitations: 'لم يتم إرسال أي دعوات بعد.',
        status: 'الحالة',
        pending: 'قيد الانتظار',
        registered: 'مسجل',
        expired: 'منتهي الصلاحية',
        sentAt: 'أرسلت',
        resend: 'إعادة إرسال'
      },
      registrations: {
        noRegistrations: 'لا توجد تسجيلات في انتظار الموافقة.',
        approve: 'موافقة',
        reject: 'رفض',
        pending: 'قيد الانتظار',
        approved: 'معتمد',
        rejected: 'مرفوض',
        costSelf: 'تمويل ذاتي',
        costHaggai: 'تساهم حجي',
        arrival: 'الوصول',
        departure: 'المغادرة'
      }
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchLeaders();
    fetchInvitations();
    fetchRegistrations();
    fetchWorkshopTopics();
  }, []);

  const fetchWorkshopTopics = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshop-topics`);
      if (response.ok) {
        const data = await response.json();
        setWorkshopTopics(data);
      }
    } catch (error) {
      console.error('Error fetching workshop topics:', error);
    }
  };

  const getTopicName = (topicId) => {
    const topic = workshopTopics.find(t => t.id === topicId);
    if (!topic) return topicId;
    return language === 'en' ? topic.name_en : topic.name_sv;
  };

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

  const fetchInvitations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-invitations`);
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-registrations`);
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteData.name || !inviteData.email) {
      toast.error('Namn och e-post krävs');
      return;
    }
    
    setSendingInvite(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData)
      });
      
      if (response.ok) {
        toast.success(language === 'sv' ? 'Inbjudan skickad!' : 'Invitation sent!');
        setShowInviteDialog(false);
        setInviteData({ name: '', email: '', workshop_id: '', workshop_title: '' });
        fetchInvitations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send invitation');
      }
    } catch (error) {
      toast.error(error.message || 'Kunde inte skicka inbjudan');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleResendInvite = async (invitationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-invitations/${invitationId}/resend`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success(language === 'sv' ? 'Påminnelse skickad!' : 'Reminder sent!');
      }
    } catch (error) {
      toast.error('Kunde inte skicka påminnelse');
    }
  };

  const handleApproveRegistration = async (registrationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-registrations/${registrationId}/approve`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success(language === 'sv' ? 'Ledare godkänd!' : 'Leader approved!');
        fetchRegistrations();
        fetchLeaders();
      }
    } catch (error) {
      toast.error('Kunde inte godkänna');
    }
  };

  const handleRejectRegistration = async (registrationId) => {
    const reason = window.prompt(language === 'sv' ? 'Ange anledning (valfritt):' : 'Enter reason (optional):');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/leader-registrations/${registrationId}/reject?reason=${encodeURIComponent(reason || '')}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success(language === 'sv' ? 'Registrering avslagen' : 'Registration rejected');
        fetchRegistrations();
      }
    } catch (error) {
      toast.error('Kunde inte avslå');
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
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold text-stone-800 mb-4">{txt.title}</h1>
          <p className="text-lg text-stone-600 mb-6">{txt.subtitle}</p>
          
          <div className={`flex gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button 
              onClick={() => openModal()}
              className="bg-haggai hover:bg-haggai-dark text-cream-50"
            >
              <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.addNew}
            </Button>
            <Button 
              onClick={() => setShowInviteDialog(true)}
              variant="outline"
              className="border-haggai text-haggai hover:bg-haggai hover:text-white"
            >
              <Send className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {txt.sendInvite}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="leaders" className="data-[state=active]:bg-haggai data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              {txt.tabs.leaders}
              <Badge className="ml-2 bg-stone-200 text-stone-700">{leaders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="data-[state=active]:bg-haggai data-[state=active]:text-white">
              <Send className="h-4 w-4 mr-2" />
              {txt.tabs.invitations}
              <Badge className="ml-2 bg-stone-200 text-stone-700">{invitations.filter(i => i.status === 'pending').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="data-[state=active]:bg-haggai data-[state=active]:text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              {txt.tabs.registrations}
              <Badge className="ml-2 bg-amber-200 text-amber-800">{registrations.filter(r => r.status === 'pending').length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Leaders Tab */}
          <TabsContent value="leaders">
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
                            {leader.is_registered_leader && (
                              <Badge className="bg-violet-100 text-violet-800 text-xs">Registrerad</Badge>
                            )}
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
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations">
            {invitations.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Send className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                  <p className="text-lg text-stone-500">{txt.invitations.noInvitations}</p>
                  <Button onClick={() => setShowInviteDialog(true)} className="mt-4 bg-haggai hover:bg-haggai-dark">
                    <Send className="h-4 w-4 mr-2" />
                    {txt.sendInvite}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {invitations.map((inv) => (
                  <Card key={inv.id} className="border-0 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-haggai-100 rounded-full flex items-center justify-center">
                            <Mail className="h-6 w-6 text-haggai" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-stone-800">{inv.name}</h4>
                            <p className="text-sm text-stone-500">{inv.email}</p>
                            {inv.workshop_title && (
                              <p className="text-xs text-haggai">Workshop: {inv.workshop_title}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={
                            inv.status === 'registered' ? 'bg-green-100 text-green-800' :
                            inv.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {inv.status === 'registered' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {txt.invitations[inv.status] || inv.status}
                          </Badge>
                          {inv.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResendInvite(inv.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              {txt.invitations.resend}
                            </Button>
                          )}
                        </div>
                      </div>
                      {inv.sent_at && (
                        <p className="text-xs text-stone-400 mt-2">
                          {txt.invitations.sentAt}: {new Date(inv.sent_at).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            {registrations.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <UserPlus className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                  <p className="text-lg text-stone-500">{txt.registrations.noRegistrations}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <Card key={reg.id} className={`border-0 shadow-lg ${reg.status !== 'pending' ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {reg.image_url ? (
                            <img src={reg.image_url} alt={reg.name} className="w-16 h-16 rounded-full object-cover" />
                          ) : (
                            <div className="w-16 h-16 bg-haggai-100 rounded-full flex items-center justify-center">
                              <User className="h-8 w-8 text-haggai" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-stone-800 text-lg">{reg.name}</h4>
                            <p className="text-sm text-stone-500">{reg.email}</p>
                            <p className="text-sm text-stone-500">{reg.phone}</p>
                            {reg.role_sv && <p className="text-sm text-haggai font-medium">{reg.role_sv}</p>}
                          </div>
                        </div>
                        <Badge className={
                          reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                          reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }>
                          {txt.registrations[reg.status] || reg.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <span className="text-xs text-stone-500">Kostnadsval:</span>
                          <p className="font-medium text-sm">
                            {reg.cost_preference === 'haggai_support' ? txt.registrations.costHaggai : txt.registrations.costSelf}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-stone-500">{txt.registrations.arrival}:</span>
                          <p className="font-medium text-sm">{reg.arrival_date || '-'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-stone-500">{txt.registrations.departure}:</span>
                          <p className="font-medium text-sm">{reg.departure_date || '-'}</p>
                        </div>
                      </div>
                      
                      {/* Topic Selection */}
                      {(reg.primary_topic || (reg.backup_topics && reg.backup_topics.length > 0)) && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid md:grid-cols-2 gap-4">
                            {reg.primary_topic && (
                              <div>
                                <span className="text-xs text-stone-500">Huvudämne:</span>
                                <p className="font-medium text-sm text-haggai">
                                  📚 {getTopicName(reg.primary_topic)}
                                </p>
                              </div>
                            )}
                            {reg.backup_topics && reg.backup_topics.length > 0 && (
                              <div>
                                <span className="text-xs text-stone-500">Backup-ämnen:</span>
                                <p className="font-medium text-sm text-emerald-600">
                                  {reg.backup_topics.map(t => getTopicName(t)).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {reg.bio_sv && (
                        <p className="text-sm text-stone-600 mt-3 line-clamp-2">{reg.bio_sv}</p>
                      )}
                      
                      {reg.status === 'pending' && (
                        <div className="flex gap-3 mt-4 pt-4 border-t">
                          <Button 
                            onClick={() => handleApproveRegistration(reg.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {txt.registrations.approve}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleRejectRegistration(reg.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            {txt.registrations.reject}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

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

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-haggai" />
                {txt.invite.title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-stone-500">{txt.invite.subtitle}</p>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{txt.name} *</Label>
                <Input
                  value={inviteData.name}
                  onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                  placeholder={txt.invite.namePlaceholder}
                  data-testid="invite-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.email} *</Label>
                <Input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  placeholder={txt.invite.emailPlaceholder}
                  data-testid="invite-email-input"
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.invite.workshopOptional}</Label>
                <Input
                  value={inviteData.workshop_title}
                  onChange={(e) => setInviteData({...inviteData, workshop_title: e.target.value})}
                  placeholder="T.ex. Workshop mars 2026"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'sv' ? 'Språk för inbjudan' : 'Invitation language'}</Label>
                <select
                  value={inviteData.language}
                  onChange={(e) => setInviteData({...inviteData, language: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="sv">🇸🇪 Svenska</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="ar">🇸🇦 العربية</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowInviteDialog(false)}
                className="flex-1"
              >
                {txt.cancel}
              </Button>
              <Button 
                onClick={handleSendInvite}
                disabled={sendingInvite}
                className="flex-1 bg-haggai hover:bg-haggai-dark"
                data-testid="send-invite-btn"
              >
                {sendingInvite ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {txt.invite.sending}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {txt.invite.send}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminLeaders;
