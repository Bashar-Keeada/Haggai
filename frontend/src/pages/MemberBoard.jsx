import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Building2, User, ChevronDown, ChevronUp, Plus, Archive, Edit2, Trash2, Lock, Eye, EyeOff, LogIn, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberBoard = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentBoard, setCurrentBoard] = useState([]);
  const [previousBoard, setPreviousBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrevious, setShowPrevious] = useState(false);
  
  // Edit mode
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Add/Edit member
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
      return;
    }
    // Check existing login
    const token = localStorage.getItem('boardEditToken');
    if (token === 'board_edit_authenticated') {
      setIsLoggedIn(true);
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword === 'board2030!') {
      localStorage.setItem('boardEditToken', 'board_edit_authenticated');
      setIsLoggedIn(true);
      setShowLoginDialog(false);
      setLoginPassword('');
      toast.success(language === 'sv' ? 'Inloggad!' : 'Logged in!');
    } else {
      toast.error(language === 'sv' ? 'Felaktigt lösenord' : 'Incorrect password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('boardEditToken');
    setIsLoggedIn(false);
    toast.info(language === 'sv' ? 'Utloggad' : 'Logged out');
  };

  const handleAddMember = async () => {
    if (!formData.name || !formData.role) {
      toast.error(language === 'sv' ? 'Namn och roll krävs' : 'Name and role required');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/board-members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          term_start: new Date().getFullYear().toString(),
          is_current: true
        })
      });

      if (response.ok) {
        toast.success(language === 'sv' ? 'Styrelsemedlem tillagd!' : 'Board member added!');
        setShowAddDialog(false);
        resetForm();
        fetchBoardMembers();
      } else {
        toast.error(language === 'sv' ? 'Kunde inte lägga till' : 'Could not add');
      }
    } catch (error) {
      toast.error('Error');
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/board-members/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(language === 'sv' ? 'Uppdaterad!' : 'Updated!');
        setShowAddDialog(false);
        setEditingMember(null);
        resetForm();
        fetchBoardMembers();
      }
    } catch (error) {
      toast.error('Error');
    }
  };

  const handleArchiveMember = async (member) => {
    if (!window.confirm(language === 'sv' 
      ? `Arkivera ${member.name}?` 
      : `Archive ${member.name}?`)) return;

    try {
      const currentYear = new Date().getFullYear().toString();
      const response = await fetch(`${BACKEND_URL}/api/board-members/${member.id}/archive?term_end=${currentYear}`, {
        method: 'PUT'
      });

      if (response.ok) {
        toast.success(language === 'sv' ? 'Arkiverad!' : 'Archived!');
        fetchBoardMembers();
      }
    } catch (error) {
      toast.error('Error');
    }
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(language === 'sv' 
      ? `Ta bort ${member.name} permanent?` 
      : `Delete ${member.name} permanently?`)) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/board-members/${member.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(language === 'sv' ? 'Borttagen!' : 'Deleted!');
        fetchBoardMembers();
      }
    } catch (error) {
      toast.error('Error');
    }
  };

  const openEditDialog = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      email: member.email || '',
      phone: member.phone || ''
    });
    setShowAddDialog(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', email: '', phone: '' });
    setEditingMember(null);
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
      term: 'Mandatperiod',
      addMember: 'Lägg till medlem',
      editMember: 'Redigera medlem',
      name: 'Namn',
      role: 'Roll',
      email: 'E-post',
      phone: 'Telefon',
      save: 'Spara',
      cancel: 'Avbryt',
      archive: 'Arkivera',
      delete: 'Ta bort',
      edit: 'Redigera',
      loginToEdit: 'Logga in för att redigera',
      loginTitle: 'Styrelseinloggning',
      loginDesc: 'Ange lösenord för att redigera styrelsen',
      roles: {
        chairman: 'Ordförande',
        treasurer: 'Kassör',
        secretary: 'Sekreterare',
        member: 'Ledamot',
        deputy: 'Suppleant',
        ended: 'Slutat'
      }
    },
    en: {
      title: 'Board',
      subtitle: 'Current board members',
      back: 'Back',
      noMembers: 'No board members registered.',
      showPrevious: 'Show previous',
      hidePrevious: 'Hide previous',
      previousBoards: 'Previous boards',
      term: 'Term',
      addMember: 'Add member',
      editMember: 'Edit member',
      name: 'Name',
      role: 'Role',
      email: 'Email',
      phone: 'Phone',
      save: 'Save',
      cancel: 'Cancel',
      archive: 'Archive',
      delete: 'Delete',
      edit: 'Edit',
      loginToEdit: 'Login to edit',
      loginTitle: 'Board Login',
      loginDesc: 'Enter password to edit the board',
      roles: {
        chairman: 'Chairman',
        treasurer: 'Treasurer',
        secretary: 'Secretary',
        member: 'Member',
        deputy: 'Deputy',
        ended: 'Ended'
      }
    },
    ar: {
      title: 'المجلس',
      subtitle: 'أعضاء المجلس الحاليين',
      back: 'رجوع',
      noMembers: 'لم يتم تسجيل أعضاء المجلس.',
      showPrevious: 'عرض السابق',
      hidePrevious: 'إخفاء السابق',
      previousBoards: 'المجالس السابقة',
      term: 'الفترة',
      addMember: 'إضافة عضو',
      editMember: 'تعديل العضو',
      name: 'الاسم',
      role: 'الدور',
      email: 'البريد',
      phone: 'الهاتف',
      save: 'حفظ',
      cancel: 'إلغاء',
      archive: 'أرشفة',
      delete: 'حذف',
      edit: 'تعديل',
      loginToEdit: 'تسجيل الدخول للتعديل',
      loginTitle: 'تسجيل دخول المجلس',
      loginDesc: 'أدخل كلمة المرور للتعديل',
      roles: {
        chairman: 'الرئيس',
        treasurer: 'أمين الصندوق',
        secretary: 'السكرتير',
        member: 'عضو',
        deputy: 'نائب',
        ended: 'انتهى'
      }
    }
  };

  const txt = translations[language] || translations.sv;

  const defaultBoard = [
    { id: 'default-1', name: 'Bashar', role: txt.roles.chairman },
    { id: 'default-2', name: 'Ravi', role: txt.roles.treasurer },
    { id: 'default-3', name: 'Mazin', role: txt.roles.member },
    { id: 'default-4', name: 'Peter', role: txt.roles.member },
    { id: 'default-5', name: 'Alen', role: txt.roles.member }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-indigo-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {isLoggedIn ? (
              <>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {language === 'sv' ? 'Redigeringsläge' : 'Edit mode'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => { resetForm(); setShowAddDialog(true); }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {txt.addMember}
                </Button>
              </>
            ) : (
              <Button 
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="h-4 w-4 mr-1" />
                {txt.loginToEdit}
              </Button>
            )}
          </div>
        </div>

        {/* Title */}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          {displayBoard.map((member, idx) => (
            <Card 
              key={member.id || idx} 
              className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-white group"
            >
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-center relative">
                  {isLoggedIn && (
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditDialog(member)}
                        className="p-1 bg-white/20 rounded hover:bg-white/40"
                      >
                        <Edit2 className="h-3 w-3 text-white" />
                      </button>
                      <button 
                        onClick={() => handleArchiveMember(member)}
                        className="p-1 bg-white/20 rounded hover:bg-white/40"
                      >
                        <Archive className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  )}
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

        {/* Previous Boards */}
        {previousBoard.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrevious(!showPrevious)}
              className="mb-3"
            >
              {showPrevious ? txt.hidePrevious : txt.showPrevious}
              {showPrevious ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>

            {showPrevious && (
              <div className="mt-3">
                <h2 className="text-sm font-bold text-stone-700 mb-3">{txt.previousBoards}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
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
          </>
        )}

        {/* Login Dialog */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" />
                {txt.loginTitle}
              </DialogTitle>
              <DialogDescription>{txt.loginDesc}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                <LogIn className="h-4 w-4 mr-2" />
                {language === 'sv' ? 'Logga in' : 'Log in'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Member Dialog */}
        <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) resetForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                {editingMember ? txt.editMember : txt.addMember}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{txt.name} *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Förnamn Efternamn"
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.role} *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'sv' ? 'Välj roll' : 'Select role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={txt.roles.chairman}>{txt.roles.chairman}</SelectItem>
                    <SelectItem value={txt.roles.treasurer}>{txt.roles.treasurer}</SelectItem>
                    <SelectItem value={txt.roles.secretary}>{txt.roles.secretary}</SelectItem>
                    <SelectItem value={txt.roles.member}>{txt.roles.member}</SelectItem>
                    <SelectItem value={txt.roles.deputy}>{txt.roles.deputy}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{txt.email}</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.phone}</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+46 70 123 45 67"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
                  {txt.cancel}
                </Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={editingMember ? handleUpdateMember : handleAddMember}
                >
                  {txt.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MemberBoard;
