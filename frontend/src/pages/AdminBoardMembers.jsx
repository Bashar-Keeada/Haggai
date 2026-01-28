import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Archive, X, Save, User, Mail, Phone, Calendar,
  Users, ChevronDown, ChevronUp, RotateCcw, ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminBoardMembers = () => {
  const { language, isRTL } = useLanguage();
  const [currentMembers, setCurrentMembers] = useState([]);
  const [archivedMembers, setArchivedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [archivingMember, setArchivingMember] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archiveYear, setArchiveYear] = useState(new Date().getFullYear().toString());
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image_url: '',
    email: '',
    phone: '',
    bio: '',
    term_start: new Date().getFullYear().toString()
  });

  const translations = {
    sv: {
      title: 'Hantera Styrelse',
      subtitle: 'Lägg till, redigera eller arkivera styrelsemedlemmar',
      currentBoard: 'Nuvarande Styrelse',
      previousBoards: 'Föregående Styrelser',
      addNew: 'Lägg till ny medlem',
      name: 'Namn',
      role: 'Roll',
      email: 'E-post',
      phone: 'Telefon',
      bio: 'Beskrivning',
      imageUrl: 'Bild URL',
      termStart: 'Mandatperiod start',
      termEnd: 'Mandatperiod slut',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      archive: 'Arkivera',
      restore: 'Återställ',
      delete: 'Ta bort',
      noMembers: 'Inga styrelsemedlemmar har lagts till ännu.',
      noArchivedMembers: 'Inga arkiverade styrelsemedlemmar.',
      confirmArchive: 'Ange slutår för mandatperioden:',
      archiveTitle: 'Arkivera styrelsemedlem',
      showArchived: 'Visa föregående styrelser',
      hideArchived: 'Dölj föregående styrelser',
      roles: {
        chairman: 'Ordförande',
        treasurer: 'Kassör',
        secretary: 'Sekreterare',
        member: 'Ledamot',
        deputy: 'Suppleant'
      },
      term: 'Mandatperiod'
    },
    en: {
      title: 'Manage Board',
      subtitle: 'Add, edit or archive board members',
      currentBoard: 'Current Board',
      previousBoards: 'Previous Boards',
      addNew: 'Add new member',
      name: 'Name',
      role: 'Role',
      email: 'Email',
      phone: 'Phone',
      bio: 'Description',
      imageUrl: 'Image URL',
      termStart: 'Term start',
      termEnd: 'Term end',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      archive: 'Archive',
      restore: 'Restore',
      delete: 'Delete',
      noMembers: 'No board members added yet.',
      noArchivedMembers: 'No archived board members.',
      confirmArchive: 'Enter end year for the term:',
      archiveTitle: 'Archive board member',
      showArchived: 'Show previous boards',
      hideArchived: 'Hide previous boards',
      roles: {
        chairman: 'Chairman',
        treasurer: 'Treasurer',
        secretary: 'Secretary',
        member: 'Member',
        deputy: 'Deputy'
      },
      term: 'Term'
    },
    ar: {
      title: 'إدارة المجلس',
      subtitle: 'إضافة أو تعديل أو أرشفة أعضاء المجلس',
      currentBoard: 'المجلس الحالي',
      previousBoards: 'المجالس السابقة',
      addNew: 'إضافة عضو جديد',
      name: 'الاسم',
      role: 'الدور',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      bio: 'الوصف',
      imageUrl: 'رابط الصورة',
      termStart: 'بداية الفترة',
      termEnd: 'نهاية الفترة',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      archive: 'أرشفة',
      restore: 'استعادة',
      delete: 'حذف',
      noMembers: 'لم تتم إضافة أعضاء مجلس بعد.',
      noArchivedMembers: 'لا يوجد أعضاء مجلس مؤرشفين.',
      confirmArchive: 'أدخل سنة انتهاء الفترة:',
      archiveTitle: 'أرشفة عضو المجلس',
      showArchived: 'عرض المجالس السابقة',
      hideArchived: 'إخفاء المجالس السابقة',
      roles: {
        chairman: 'الرئيس',
        treasurer: 'أمين الصندوق',
        secretary: 'السكرتير',
        member: 'عضو',
        deputy: 'نائب'
      },
      term: 'الفترة'
    }
  };

  const txt = translations[language] || translations.sv;

  const roleOptions = [
    { value: 'Ordförande', label: txt.roles.chairman },
    { value: 'Kassör', label: txt.roles.treasurer },
    { value: 'Sekreterare', label: txt.roles.secretary },
    { value: 'Ledamot', label: txt.roles.member },
    { value: 'Suppleant', label: txt.roles.deputy }
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const [currentRes, archivedRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/board-members?current_only=true`),
        fetch(`${BACKEND_URL}/api/board-members/archive`)
      ]);
      
      if (currentRes.ok) {
        const data = await currentRes.json();
        setCurrentMembers(data);
      }
      if (archivedRes.ok) {
        const data = await archivedRes.json();
        setArchivedMembers(data);
      }
    } catch (error) {
      console.error('Error fetching board members:', error);
      toast.error('Kunde inte hämta styrelsemedlemmar');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        image_url: member.image_url || '',
        email: member.email || '',
        phone: member.phone || '',
        bio: member.bio || '',
        term_start: member.term_start
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        image_url: '',
        email: '',
        phone: '',
        bio: '',
        term_start: new Date().getFullYear().toString()
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const memberData = {
      name: formData.name,
      role: formData.role,
      image_url: formData.image_url || null,
      email: formData.email || null,
      phone: formData.phone || null,
      bio: formData.bio || null,
      term_start: formData.term_start,
      is_current: true
    };

    try {
      let response;
      if (editingMember) {
        response = await fetch(`${BACKEND_URL}/api/board-members/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        });
      } else {
        response = await fetch(`${BACKEND_URL}/api/board-members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        });
      }

      if (response.ok) {
        toast.success(editingMember ? 'Medlem uppdaterad!' : 'Medlem tillagd!');
        fetchMembers();
        closeModal();
      } else {
        throw new Error('Failed to save member');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Kunde inte spara medlem');
    }
  };

  const openArchiveModal = (member) => {
    setArchivingMember(member);
    setArchiveYear(new Date().getFullYear().toString());
    setIsArchiveModalOpen(true);
  };

  const handleArchive = async () => {
    if (!archivingMember) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/board-members/${archivingMember.id}/archive?term_end=${archiveYear}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        toast.success('Medlem arkiverad!');
        fetchMembers();
        setIsArchiveModalOpen(false);
        setArchivingMember(null);
      } else {
        throw new Error('Failed to archive member');
      }
    } catch (error) {
      console.error('Error archiving member:', error);
      toast.error('Kunde inte arkivera medlem');
    }
  };

  const handleRestore = async (member) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/board-members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_current: true, term_end: null })
      });

      if (response.ok) {
        toast.success('Medlem återställd!');
        fetchMembers();
      } else {
        throw new Error('Failed to restore member');
      }
    } catch (error) {
      console.error('Error restoring member:', error);
      toast.error('Kunde inte återställa medlem');
    }
  };

  const MemberCard = ({ member, isArchived = false }) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {member.image_url ? (
            <img 
              src={member.image_url} 
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-haggai-100 flex items-center justify-center flex-shrink-0">
              <User className="h-10 w-10 text-haggai" />
            </div>
          )}
          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <h3 className="text-lg font-semibold text-stone-800">{member.name}</h3>
              {isArchived && (
                <Badge variant="secondary" className="text-xs">
                  {language === 'sv' ? 'Arkiverad' : language === 'ar' ? 'مؤرشف' : 'Archived'}
                </Badge>
              )}
            </div>
            <p className="text-haggai font-medium text-sm mb-2">{member.role}</p>
            <p className="text-stone-500 text-xs mb-2">
              {txt.term}: {member.term_start}{member.term_end ? ` - ${member.term_end}` : ' →'}
            </p>
            {member.bio && (
              <p className="text-stone-600 text-sm line-clamp-2 mb-3">{member.bio}</p>
            )}
            {(member.email || member.phone) && (
              <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                {member.email && (
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Mail className="h-3 w-3" /> {member.email}
                  </span>
                )}
                {member.phone && (
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="h-3 w-3" /> {member.phone}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex gap-2 mt-4 pt-4 border-t border-stone-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {!isArchived ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openModal(member)}
                className="flex-1"
              >
                <Edit className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {txt.edit}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openArchiveModal(member)}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                <Archive className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRestore(member)}
              className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <RotateCcw className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {txt.restore}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
            className="bg-haggai hover:bg-haggai-dark text-white"
          >
            <Plus className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {txt.addNew}
          </Button>
        </div>

        {/* Current Board */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold text-stone-800 mb-6 ${isRTL ? 'text-right' : ''}`}>
            {txt.currentBoard}
          </h2>
          
          {currentMembers.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                <p className="text-lg text-stone-500">{txt.noMembers}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>

        {/* Previous Boards Toggle */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
            className={`${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {showArchived ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            {showArchived ? txt.hideArchived : txt.showArchived}
            {archivedMembers.length > 0 && (
              <Badge className="ml-2 bg-stone-200 text-stone-700">{archivedMembers.length}</Badge>
            )}
          </Button>
        </div>

        {/* Archived Members */}
        {showArchived && (
          <div>
            <h2 className={`text-2xl font-bold text-stone-800 mb-6 ${isRTL ? 'text-right' : ''}`}>
              {txt.previousBoards}
            </h2>
            
            {archivedMembers.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Archive className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                  <p className="text-lg text-stone-500">{txt.noArchivedMembers}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archivedMembers.map((member) => (
                  <MemberCard key={member.id} member={member} isArchived />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className={`sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-2xl font-bold text-stone-800">
                  {editingMember ? txt.edit : txt.addNew}
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-stone-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {txt.name} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {txt.role} *
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={txt.role} />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {txt.termStart} *
                  </label>
                  <Input
                    value={formData.term_start}
                    onChange={(e) => setFormData({ ...formData, term_start: e.target.value })}
                    placeholder="2025"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {txt.imageUrl}
                  </label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {txt.email}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {txt.phone}
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium text-stone-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {txt.bio}
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className={`flex gap-4 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button 
                    type="submit"
                    className="bg-haggai hover:bg-haggai-dark text-white flex-1"
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

        {/* Archive Modal */}
        {isArchiveModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-stone-800 mb-4">{txt.archiveTitle}</h2>
              <p className="text-stone-600 mb-4">{txt.confirmArchive}</p>
              
              <Input
                value={archiveYear}
                onChange={(e) => setArchiveYear(e.target.value)}
                placeholder="2025"
                className="mb-6"
              />
              
              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  onClick={handleArchive}
                  className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
                >
                  <Archive className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {txt.archive}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsArchiveModalOpen(false)}
                >
                  {txt.cancel}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBoardMembers;
