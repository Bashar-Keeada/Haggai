import React, { useState, useEffect } from 'react';
import { Building2, Building, Plus, Edit, Trash2, Globe, Mail, Phone, User, MapPin, Calendar, X, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminOrganizationMembers = () => {
  const { language, isRTL } = useLanguage();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'church',
    description: '',
    logo_url: '',
    website: '',
    city: '',
    country: 'Sverige',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    member_since: new Date().getFullYear().toString()
  });

  const txt = {
    sv: {
      title: 'Hantera Medlemmar',
      subtitle: 'Kyrkor och organisationer som är medlemmar',
      addNew: 'Lägg till ny medlem',
      churches: 'Kyrkor',
      organizations: 'Organisationer',
      name: 'Namn',
      type: 'Typ',
      church: 'Kyrka',
      organization: 'Organisation',
      description: 'Beskrivning',
      logoUrl: 'Logotyp URL',
      website: 'Webbplats',
      city: 'Stad',
      country: 'Land',
      contactPerson: 'Kontaktperson',
      contactEmail: 'E-post',
      contactPhone: 'Telefon',
      memberSince: 'Medlem sedan',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Ta bort',
      confirmDelete: 'Är du säker på att du vill ta bort denna medlem?',
      noMembers: 'Inga medlemmar registrerade ännu'
    },
    en: {
      title: 'Manage Members',
      subtitle: 'Churches and organizations that are members',
      addNew: 'Add new member',
      churches: 'Churches',
      organizations: 'Organizations',
      name: 'Name',
      type: 'Type',
      church: 'Church',
      organization: 'Organization',
      description: 'Description',
      logoUrl: 'Logo URL',
      website: 'Website',
      city: 'City',
      country: 'Country',
      contactPerson: 'Contact Person',
      contactEmail: 'Email',
      contactPhone: 'Phone',
      memberSince: 'Member since',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this member?',
      noMembers: 'No members registered yet'
    },
    ar: {
      title: 'إدارة الأعضاء',
      subtitle: 'الكنائس والمنظمات الأعضاء',
      addNew: 'إضافة عضو جديد',
      churches: 'الكنائس',
      organizations: 'المنظمات',
      name: 'الاسم',
      type: 'النوع',
      church: 'كنيسة',
      organization: 'منظمة',
      description: 'الوصف',
      logoUrl: 'رابط الشعار',
      website: 'الموقع',
      city: 'المدينة',
      country: 'البلد',
      contactPerson: 'جهة الاتصال',
      contactEmail: 'البريد الإلكتروني',
      contactPhone: 'الهاتف',
      memberSince: 'عضو منذ',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      confirmDelete: 'هل أنت متأكد من حذف هذا العضو؟',
      noMembers: 'لا يوجد أعضاء مسجلين بعد'
    }
  }[language] || {
    sv: {}
  }.sv;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/organization-members?active_only=false`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Kunde inte hämta medlemmar');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMember
        ? `${BACKEND_URL}/api/organization-members/${editingMember.id}`
        : `${BACKEND_URL}/api/organization-members`;
      
      const response = await fetch(url, {
        method: editingMember ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingMember ? 'Medlem uppdaterad!' : 'Medlem tillagd!');
        fetchMembers();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Kunde inte spara medlem');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(txt.confirmDelete)) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/organization-members/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Medlem borttagen!');
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Kunde inte ta bort medlem');
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        type: member.type || 'church',
        description: member.description || '',
        logo_url: member.logo_url || '',
        website: member.website || '',
        city: member.city || '',
        country: member.country || 'Sverige',
        contact_person: member.contact_person || '',
        contact_email: member.contact_email || '',
        contact_phone: member.contact_phone || '',
        member_since: member.member_since || new Date().getFullYear().toString()
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        type: 'church',
        description: '',
        logo_url: '',
        website: '',
        city: '',
        country: 'Sverige',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        member_since: new Date().getFullYear().toString()
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const churches = members.filter(m => m.type === 'church');
  const organizations = members.filter(m => m.type === 'organization');

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

        {/* Churches Section */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Building className="h-6 w-6 text-haggai" />
            {txt.churches} ({churches.length})
          </h2>
          {churches.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {churches.map(member => (
                <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {member.logo_url ? (
                        <img src={member.logo_url} alt={member.name} className="w-16 h-16 rounded-xl object-contain bg-stone-100" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-haggai-100 flex items-center justify-center flex-shrink-0">
                          <Building className="h-8 w-8 text-haggai" />
                        </div>
                      )}
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                        <h3 className="font-bold text-stone-800">{member.name}</h3>
                        {member.city && (
                          <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {member.city}, {member.country}
                          </p>
                        )}
                        {member.member_since && (
                          <Badge className="mt-2 bg-haggai-100 text-haggai">
                            <Calendar className="h-3 w-3 mr-1" /> {txt.memberSince} {member.member_since}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {member.description && (
                      <p className="text-sm text-stone-600 mt-4">{member.description}</p>
                    )}
                    <div className={`flex gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button size="sm" variant="outline" onClick={() => openModal(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {member.website && (
                        <a href={member.website} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-stone-500">{txt.noMembers}</p>
          )}
        </div>

        {/* Organizations Section */}
        <div>
          <h2 className={`text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Building2 className="h-6 w-6 text-haggai" />
            {txt.organizations} ({organizations.length})
          </h2>
          {organizations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map(member => (
                <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {member.logo_url ? (
                        <img src={member.logo_url} alt={member.name} className="w-16 h-16 rounded-xl object-contain bg-stone-100" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-8 w-8 text-violet-600" />
                        </div>
                      )}
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                        <h3 className="font-bold text-stone-800">{member.name}</h3>
                        {member.city && (
                          <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {member.city}, {member.country}
                          </p>
                        )}
                        {member.member_since && (
                          <Badge className="mt-2 bg-violet-100 text-violet-600">
                            <Calendar className="h-3 w-3 mr-1" /> {txt.memberSince} {member.member_since}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {member.description && (
                      <p className="text-sm text-stone-600 mt-4">{member.description}</p>
                    )}
                    <div className={`flex gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button size="sm" variant="outline" onClick={() => openModal(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {member.website && (
                        <a href={member.website} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-stone-500">{txt.noMembers}</p>
          )}
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? txt.edit : txt.addNew}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.name} *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.type} *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full rounded-md border border-stone-300 p-2"
                  >
                    <option value="church">{txt.church}</option>
                    <option value="organization">{txt.organization}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.memberSince}</label>
                  <Input
                    value={formData.member_since}
                    onChange={(e) => setFormData({...formData, member_since: e.target.value})}
                    placeholder="2024"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.description}</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.city}</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.country}</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.logoUrl}</label>
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.website}</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.contactPerson}</label>
                  <Input
                    value={formData.contact_person}
                    onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.contactEmail}</label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.contactPhone}</label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                  />
                </div>
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

export default AdminOrganizationMembers;
