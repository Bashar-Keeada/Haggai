import React, { useState, useEffect } from 'react';
import { Quote, Plus, Edit, Trash2, User, Building, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminTestimonials = () => {
  const { language, isRTL } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    church: '',
    quote_sv: '',
    quote_en: '',
    quote_ar: '',
    image_url: '',
    order: 0
  });

  const txt = {
    sv: {
      title: 'Hantera Vittnesmål',
      subtitle: 'Lägg till och redigera vittnesmål från deltagare',
      addNew: 'Lägg till nytt vittnesmål',
      name: 'Namn',
      role: 'Roll/Titel',
      rolePlaceholder: 'T.ex. Pastor, Ledare',
      church: 'Kyrka/Organisation',
      quoteSv: 'Citat (Svenska)',
      quoteEn: 'Citat (Engelska)',
      quoteAr: 'Citat (Arabiska)',
      imageUrl: 'Bild URL',
      order: 'Ordning',
      save: 'Spara',
      cancel: 'Avbryt',
      edit: 'Redigera',
      delete: 'Ta bort',
      confirmDelete: 'Är du säker på att du vill ta bort detta vittnesmål?',
      noTestimonials: 'Inga vittnesmål tillagda ännu',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      toggleVisibility: 'Växla synlighet'
    },
    en: {
      title: 'Manage Testimonials',
      subtitle: 'Add and edit testimonials from participants',
      addNew: 'Add new testimonial',
      name: 'Name',
      role: 'Role/Title',
      rolePlaceholder: 'E.g. Pastor, Leader',
      church: 'Church/Organization',
      quoteSv: 'Quote (Swedish)',
      quoteEn: 'Quote (English)',
      quoteAr: 'Quote (Arabic)',
      imageUrl: 'Image URL',
      order: 'Order',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this testimonial?',
      noTestimonials: 'No testimonials added yet',
      active: 'Active',
      inactive: 'Inactive',
      toggleVisibility: 'Toggle visibility'
    },
    ar: {
      title: 'إدارة الشهادات',
      subtitle: 'إضافة وتعديل شهادات المشاركين',
      addNew: 'إضافة شهادة جديدة',
      name: 'الاسم',
      role: 'الدور/اللقب',
      rolePlaceholder: 'مثال: راعي، قائد',
      church: 'الكنيسة/المنظمة',
      quoteSv: 'الاقتباس (السويدية)',
      quoteEn: 'الاقتباس (الإنجليزية)',
      quoteAr: 'الاقتباس (العربية)',
      imageUrl: 'رابط الصورة',
      order: 'الترتيب',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      confirmDelete: 'هل أنت متأكد من حذف هذه الشهادة؟',
      noTestimonials: 'لم تتم إضافة شهادات بعد',
      active: 'نشط',
      inactive: 'غير نشط',
      toggleVisibility: 'تبديل الرؤية'
    }
  }[language] || {
    sv: {}
  }.sv;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/testimonials?active_only=false`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Kunde inte hämta vittnesmål');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTestimonial
        ? `${BACKEND_URL}/api/testimonials/${editingTestimonial.id}`
        : `${BACKEND_URL}/api/testimonials`;
      
      const response = await fetch(url, {
        method: editingTestimonial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingTestimonial ? 'Vittnesmål uppdaterat!' : 'Vittnesmål tillagt!');
        fetchTestimonials();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Kunde inte spara vittnesmål');
    }
  };

  const handleDelete = async (id) => {
    // Skip confirmation for now - just delete directly
    try {
      const response = await fetch(`${BACKEND_URL}/api/testimonials/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Vittnesmål borttaget!');
        fetchTestimonials();
      } else {
        toast.error('Kunde inte ta bort vittnesmål');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Kunde inte ta bort vittnesmål');
    }
  };

  const toggleVisibility = async (testimonial) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !testimonial.is_active })
      });
      if (response.ok) {
        toast.success(testimonial.is_active ? 'Vittnesmål dolt' : 'Vittnesmål synligt');
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name || '',
        role: testimonial.role || '',
        church: testimonial.church || '',
        quote_sv: testimonial.quote_sv || '',
        quote_en: testimonial.quote_en || '',
        quote_ar: testimonial.quote_ar || '',
        image_url: testimonial.image_url || '',
        order: testimonial.order || 0
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        role: '',
        church: '',
        quote_sv: '',
        quote_en: '',
        quote_ar: '',
        image_url: '',
        order: testimonials.length
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
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

        {/* Testimonials List */}
        {testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className={`border-0 shadow-lg ${!testimonial.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    {testimonial.image_url ? (
                      <img 
                        src={testimonial.image_url} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-haggai-100 flex items-center justify-center flex-shrink-0">
                        <User className="h-8 w-8 text-haggai" />
                      </div>
                    )}

                    {/* Content */}
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h3 className="font-bold text-lg text-stone-800">{testimonial.name}</h3>
                        <Badge className={testimonial.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}>
                          {testimonial.is_active ? txt.active : txt.inactive}
                        </Badge>
                      </div>
                      
                      {(testimonial.role || testimonial.church) && (
                        <p className="text-sm text-haggai mb-3">
                          {testimonial.role}{testimonial.role && testimonial.church && ' – '}{testimonial.church}
                        </p>
                      )}

                      {/* Quote */}
                      <div className={`bg-stone-50 rounded-xl p-4 mb-4 ${isRTL ? 'border-r-4' : 'border-l-4'} border-haggai`}>
                        <Quote className="h-5 w-5 text-haggai mb-2" />
                        <p className="text-stone-700 italic">{testimonial.quote_sv}</p>
                      </div>

                      {/* Other languages preview */}
                      <div className={`flex gap-2 text-xs ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        {testimonial.quote_en && (
                          <Badge variant="outline" className="text-stone-500">EN ✓</Badge>
                        )}
                        {testimonial.quote_ar && (
                          <Badge variant="outline" className="text-stone-500">AR ✓</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex flex-col gap-2 ${isRTL ? 'order-first' : ''}`}>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleVisibility(testimonial)}
                        title={txt.toggleVisibility}
                      >
                        {testimonial.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openModal(testimonial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Quote className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 text-lg">{txt.noTestimonials}</p>
              <Button onClick={() => openModal()} className="mt-4 bg-haggai hover:bg-haggai-dark text-white">
                <Plus className="h-5 w-5 mr-2" />
                {txt.addNew}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? txt.edit : txt.addNew}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.name} *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.role}</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder={txt.rolePlaceholder}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.church}</label>
                  <Input
                    value={formData.church}
                    onChange={(e) => setFormData({...formData, church: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.quoteSv} *</label>
                  <Textarea
                    value={formData.quote_sv}
                    onChange={(e) => setFormData({...formData, quote_sv: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.quoteEn}</label>
                  <Textarea
                    value={formData.quote_en}
                    onChange={(e) => setFormData({...formData, quote_en: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.quoteAr}</label>
                  <Textarea
                    value={formData.quote_ar}
                    onChange={(e) => setFormData({...formData, quote_ar: e.target.value})}
                    rows={3}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.imageUrl}</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{txt.order}</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
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

export default AdminTestimonials;
