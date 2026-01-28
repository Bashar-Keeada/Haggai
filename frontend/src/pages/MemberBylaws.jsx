import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, FileText, Scale, Plus, Edit2, Trash2, Save, X, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberBylaws = () => {
  const { language, isRTL } = useLanguage();
  const { isMembersAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [bylaws, setBylaws] = useState([]);
  const [adoptedDate, setAdoptedDate] = useState('16 april 2025');
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [newItem, setNewItem] = useState({
    section: '',
    title_sv: '',
    content_sv: ''
  });

  useEffect(() => {
    if (!isMembersAuthenticated) {
      navigate('/medlemmar');
    } else {
      fetchBylaws();
      // Check if already logged in
      const token = localStorage.getItem('boardEditToken');
      if (token) setIsLoggedIn(true);
    }
  }, [isMembersAuthenticated, navigate]);

  const fetchBylaws = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bylaws`);
      if (response.ok) {
        const data = await response.json();
        setBylaws(data.items || []);
        setAdoptedDate(data.adopted_date || '16 april 2025');
      }
    } catch (error) {
      console.error('Error fetching bylaws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (loginPassword === 'board2030!') {
      setIsLoggedIn(true);
      localStorage.setItem('boardEditToken', 'board_edit_authenticated');
      setShowLoginDialog(false);
      setLoginPassword('');
      toast.success(language === 'sv' ? 'Inloggad!' : 'Logged in!');
    } else {
      toast.error(language === 'sv' ? 'Fel lösenord' : 'Wrong password');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.section || !newItem.title_sv || !newItem.content_sv) {
      toast.error(language === 'sv' ? 'Fyll i alla fält' : 'Fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/bylaws/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          order: bylaws.length + 1
        })
      });

      if (response.ok) {
        const item = await response.json();
        setBylaws([...bylaws, item]);
        setShowAddDialog(false);
        setNewItem({ section: '', title_sv: '', content_sv: '' });
        toast.success(language === 'sv' ? 'Punkt tillagd!' : 'Item added!');
      }
    } catch (error) {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    setSaving(true);
    try {
      // Update entire bylaws with modified item
      const updatedItems = bylaws.map(item => 
        item.id === editingItem.id ? editingItem : item
      );

      const response = await fetch(`${BACKEND_URL}/api/bylaws`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems,
          adopted_date: adoptedDate
        })
      });

      if (response.ok) {
        setBylaws(updatedItems);
        setEditingItem(null);
        toast.success(language === 'sv' ? 'Uppdaterad!' : 'Updated!');
      }
    } catch (error) {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm(language === 'sv' ? 'Ta bort denna punkt?' : 'Delete this item?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/bylaws/item/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBylaws(bylaws.filter(item => item.id !== itemId));
        toast.success(language === 'sv' ? 'Borttagen!' : 'Deleted!');
      }
    } catch (error) {
      toast.error('Error');
    }
  };

  const translations = {
    sv: {
      title: 'Stadgar',
      subtitle: 'Föreningens regler och riktlinjer',
      back: 'Tillbaka',
      adoptedDate: 'Antagna',
      loginToEdit: 'Logga in för att redigera',
      loginTitle: 'Redigera stadgar',
      loginDesc: 'Ange lösenord',
      password: 'Lösenord',
      login: 'Logga in',
      addNew: 'Lägg till ny punkt',
      addTitle: 'Lägg till stadgepunkt',
      section: 'Paragraf (t.ex. §10)',
      titleLabel: 'Titel',
      content: 'Innehåll',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Ta bort',
      editTitle: 'Redigera punkt',
      editMode: 'Redigeringsläge'
    },
    en: {
      title: 'Bylaws',
      subtitle: 'Association rules and guidelines',
      back: 'Back',
      adoptedDate: 'Adopted',
      loginToEdit: 'Login to edit',
      loginTitle: 'Edit bylaws',
      loginDesc: 'Enter password',
      password: 'Password',
      login: 'Login',
      addNew: 'Add new item',
      addTitle: 'Add bylaw item',
      section: 'Section (e.g. §10)',
      titleLabel: 'Title',
      content: 'Content',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      editTitle: 'Edit item',
      editMode: 'Edit mode'
    },
    ar: {
      title: 'النظام الأساسي',
      subtitle: 'قواعد وإرشادات الجمعية',
      back: 'رجوع',
      adoptedDate: 'اعتمدت',
      loginToEdit: 'تسجيل الدخول للتعديل',
      loginTitle: 'تعديل النظام الأساسي',
      loginDesc: 'أدخل كلمة المرور',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      addNew: 'إضافة بند جديد',
      addTitle: 'إضافة بند',
      section: 'الفقرة (مثل §10)',
      titleLabel: 'العنوان',
      content: 'المحتوى',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      editTitle: 'تعديل البند',
      editMode: 'وضع التحرير'
    }
  };

  const txt = translations[language] || translations.sv;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-cream-100 pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-cream-50 to-cream-100 pt-16 pb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/medlemmar" 
            className={`inline-flex items-center text-stone-600 hover:text-emerald-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {txt.back}
          </Link>
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                {txt.editMode}
              </Badge>
            )}
            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
              <Scale className="h-3 w-3 mr-1" />
              {txt.adoptedDate} {adoptedDate}
            </Badge>
          </div>
        </div>

        {/* Title and Actions */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-800">{txt.title}</h1>
              <p className="text-xs text-stone-500">{txt.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoggedIn ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLoginDialog(true)}
                className="text-xs"
              >
                <Lock className="h-3 w-3 mr-1" />
                {txt.loginToEdit}
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={() => setShowAddDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {txt.addNew}
              </Button>
            )}
          </div>
        </div>

        {/* Bylaws Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {bylaws.map((item, idx) => (
            <Card key={item.id || idx} className="border-0 shadow-md overflow-hidden bg-white group relative">
              {isLoggedIn && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="p-1 bg-white/90 rounded shadow hover:bg-emerald-50"
                  >
                    <Edit2 className="h-3 w-3 text-emerald-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 bg-white/90 rounded shadow hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              )}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-3 py-2">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Badge className="bg-white/20 text-white text-xs">{item.section}</Badge>
                  <span className="text-white font-medium text-xs">{item.title_sv}</span>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-stone-600 text-xs leading-relaxed">{item.content_sv}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Login Dialog */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{txt.loginTitle}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-stone-600">{txt.loginDesc}</p>
              <div>
                <Label>{txt.password}</Label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
                  {txt.cancel}
                </Button>
                <Button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-700">
                  {txt.login}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{txt.addTitle}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{txt.section}</Label>
                <Input
                  value={newItem.section}
                  onChange={(e) => setNewItem({...newItem, section: e.target.value})}
                  placeholder="§10"
                />
              </div>
              <div>
                <Label>{txt.titleLabel}</Label>
                <Input
                  value={newItem.title_sv}
                  onChange={(e) => setNewItem({...newItem, title_sv: e.target.value})}
                />
              </div>
              <div>
                <Label>{txt.content}</Label>
                <Textarea
                  value={newItem.content_sv}
                  onChange={(e) => setNewItem({...newItem, content_sv: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {txt.cancel}
                </Button>
                <Button 
                  onClick={handleAddItem} 
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {txt.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{txt.editTitle}</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label>{txt.section}</Label>
                  <Input
                    value={editingItem.section}
                    onChange={(e) => setEditingItem({...editingItem, section: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{txt.titleLabel}</Label>
                  <Input
                    value={editingItem.title_sv}
                    onChange={(e) => setEditingItem({...editingItem, title_sv: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{txt.content}</Label>
                  <Textarea
                    value={editingItem.content_sv}
                    onChange={(e) => setEditingItem({...editingItem, content_sv: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    {txt.cancel}
                  </Button>
                  <Button 
                    onClick={handleUpdateItem} 
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {txt.save}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MemberBylaws;
