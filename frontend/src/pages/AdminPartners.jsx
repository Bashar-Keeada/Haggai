import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Plus, Edit, Trash2, Globe, Star, X, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPartners = () => {
  const { language, isRTL } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website: '',
    partnership_type: 'standard'
  });

  const txt = {
    sv: {
      title: 'Hantera Partners',
      subtitle: 'Organisationer och företag vi samarbetar med',
      addNew: 'Lägg till ny partner',
      name: 'Namn',
      description: 'Beskrivning',
      logoUrl: 'Logotyp URL',
      website: 'Webbplats',
      partnershipType: 'Partnerskapstyp',
      standard: 'Standard',
      premium: 'Premium',
      strategic: 'Strategisk',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Ta bort',
      confirmDelete: 'Är du säker på att du vill ta bort denna partner?',
      noPartners: 'Inga partners registrerade ännu'
    },
    en: {
      title: 'Manage Partners',
      subtitle: 'Organizations and companies we collaborate with',
      addNew: 'Add new partner',
      name: 'Name',
      description: 'Description',
      logoUrl: 'Logo URL',
      website: 'Website',
      partnershipType: 'Partnership Type',
      standard: 'Standard',
      premium: 'Premium',
      strategic: 'Strategic',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this partner?',
      noPartners: 'No partners registered yet'
    },
    ar: {
      title: 'إدارة الشركاء',
      subtitle: 'المنظمات والشركات التي نتعاون معها',
      addNew: 'إضافة شريك جديد',
      name: 'الاسم',
      description: 'الوصف',
      logoUrl: 'رابط الشعار',
      website: 'الموقع',
      partnershipType: 'نوع الشراكة',
      standard: 'قياسي',
      premium: 'مميز',
      strategic: 'استراتيجي',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      confirmDelete: 'هل أنت متأكد من حذف هذا الشريك؟',
      noPartners: 'لا يوجد شركاء مسجلين بعد'
    }
  }[language] || {
    sv: {}
  }.sv;

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/partners?active_only=false`);
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Kunde inte hämta partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPartner
        ? `${BACKEND_URL}/api/partners/${editingPartner.id}`
        : `${BACKEND_URL}/api/partners`;
      
      const response = await fetch(url, {
        method: editingPartner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingPartner ? 'Partner uppdaterad!' : 'Partner tillagd!');
        fetchPartners();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error('Kunde inte spara partner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(txt.confirmDelete)) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/partners/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Partner borttagen!');
        fetchPartners();
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Kunde inte ta bort partner');
    }
  };

  const openModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name || '',
        description: partner.description || '',
        logo_url: partner.logo_url || '',
        website: partner.website || '',
        partnership_type: partner.partnership_type || 'standard'
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        description: '',
        logo_url: '',
        website: '',
        partnership_type: 'standard'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const getPartnershipBadge = (type) => {
    const badges = {
      standard: { label: txt.standard, className: 'bg-stone-100 text-stone-600' },
      premium: { label: txt.premium, className: 'bg-amber-100 text-amber-700' },
      strategic: { label: txt.strategic, className: 'bg-haggai-100 text-haggai' }
    };
    const badge = badges[type] || badges.standard;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 py-24 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/admin" 
          className={`inline-flex items-center text-stone-600 hover:text-haggai mb-6 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {language === 'sv' ? 'Tillbaka till Admin' : language === 'ar' ? 'العودة إلى الإدارة' : 'Back to Admin'}
        </Link>

        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-4xl font-bold text-stone-800 mb-2">{txt.title}</h1>
            <p className="text-lg text-stone-600">{txt.subtitle}</p>
          </div>
          <Button onClick={() => openModal()} className="bg-haggai hover:bg-haggai-dark text-white">
            <Plus className="h-5 w-5 mr-2" />
            {txt.addNew}
          </Button>
        </div>

        {/* Partners Grid */}
        {partners.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map(partner => (
              <Card key={partner.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="w-20 h-20 rounded-xl object-contain bg-white border border-stone-100 p-2" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-haggai-100 to-haggai-50 flex items-center justify-center flex-shrink-0">
                        <Handshake className="h-10 w-10 text-haggai" />
                      </div>
                    )}
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <h3 className="font-bold text-lg text-stone-800">{partner.name}</h3>
                      <div className="mt-2">
                        {getPartnershipBadge(partner.partnership_type)}
                      </div>
                    </div>
                  </div>
                  {partner.description && (
                    <p className="text-sm text-stone-600 mt-4">{partner.description}</p>
                  )}
                  <div className={`flex gap-2 mt-4 pt-4 border-t border-stone-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button size="sm" variant="outline" onClick={() => openModal(partner)}>
                      <Edit className="h-4 w-4 mr-1" /> {txt.edit}
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(partner.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {partner.website && (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <Button size="sm" variant="outline">
                          <Globe className="h-4 w-4 mr-1" /> Besök
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Handshake className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 text-lg">{txt.noPartners}</p>
              <Button onClick={() => openModal()} className="mt-4 bg-haggai hover:bg-haggai-dark text-white">
                <Plus className="h-5 w-5 mr-2" />
                {txt.addNew}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPartner ? txt.edit : txt.addNew}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{txt.name} *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{txt.description}</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{txt.logoUrl}</label>
                <Input
                  value={formData.logo_url}
                  onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{txt.website}</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{txt.partnershipType}</label>
                <select
                  value={formData.partnership_type}
                  onChange={(e) => setFormData({...formData, partnership_type: e.target.value})}
                  className="w-full rounded-md border border-stone-300 p-2"
                >
                  <option value="standard">{txt.standard}</option>
                  <option value="premium">{txt.premium}</option>
                  <option value="strategic">{txt.strategic}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  {txt.cancel}
                </Button>
                <Button type="submit" className="flex-1 bg-haggai hover:bg-haggai-dark text-white">
                  {txt.save}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPartners;
