import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, X, Calendar, MapPin, 
  Users, Globe, Home, Monitor, GraduationCap, CalendarDays, QrCode, Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminWorkshops = () => {
  const { language, isRTL } = useLanguage();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrWorkshop, setQrWorkshop] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    title_ar: '',
    description: '',
    description_en: '',
    description_ar: '',
    workshop_type: 'national',
    target_gender: 'all',
    language: '',
    date: '',
    end_date: '',
    location: '',
    location_en: '',
    location_ar: '',
    spots: '',
    age_min: '',
    age_max: '',
    price: 500,
    currency: 'SEK',
    is_online: false,
    is_tot: false,
    is_active: true
  });

  const txt = {
    sv: {
      title: 'Hantera Workshops',
      subtitle: 'Lägg till, redigera och ta bort workshops',
      back: 'Tillbaka till Admin',
      addNew: 'Lägg till Workshop',
      noWorkshops: 'Inga workshops hittades',
      editWorkshop: 'Redigera Workshop',
      createWorkshop: 'Skapa ny Workshop',
      workshopTitle: 'Titel (Svenska)',
      workshopTitleEn: 'Titel (Engelska)',
      workshopTitleAr: 'Titel (Arabiska)',
      description: 'Beskrivning (Svenska)',
      descriptionEn: 'Beskrivning (Engelska)',
      descriptionAr: 'Beskrivning (Arabiska)',
      type: 'Typ',
      typeInternational: 'Internationell',
      typeNational: 'Nationell',
      typeOnline: 'Online',
      typeTot: 'ToT (Training of Trainers)',
      targetGender: 'Målgrupp',
      genderAll: 'Alla',
      genderWomen: 'Kvinnor',
      genderMen: 'Män',
      workshopLanguage: 'Språk',
      date: 'Startdatum',
      endDate: 'Slutdatum',
      location: 'Plats (Svenska)',
      locationEn: 'Plats (Engelska)',
      locationAr: 'Plats (Arabiska)',
      spots: 'Antal platser',
      ageMin: 'Minsta ålder',
      ageMax: 'Högsta ålder',
      price: 'Pris',
      currency: 'Valuta',
      isOnline: 'Online workshop',
      isTot: 'Training of Trainers (FDS)',
      isActive: 'Aktiv',
      save: 'Spara',
      cancel: 'Avbryt',
      delete: 'Radera',
      confirmDelete: 'Är du säker på att du vill radera denna workshop?',
      international: 'Internationell',
      national: 'Nationell',
      online: 'Online',
      tot: 'ToT',
      shareLink: 'Dela nomineringslänk',
      showQR: 'Visa QR-kod',
      nominationLink: 'Nomineringslänk',
      qrCodeTitle: 'QR-kod för nominering',
      qrCodeDescription: 'Skanna för att nominera en deltagare till denna workshop',
      copyLink: 'Kopiera länk',
      linkCopied: 'Länk kopierad!',
      downloadQR: 'Ladda ner QR-kod',
      close: 'Stäng'
    },
    en: {
      title: 'Manage Workshops',
      subtitle: 'Add, edit and delete workshops',
      back: 'Back to Admin',
      addNew: 'Add Workshop',
      noWorkshops: 'No workshops found',
      editWorkshop: 'Edit Workshop',
      createWorkshop: 'Create new Workshop',
      workshopTitle: 'Title (Swedish)',
      workshopTitleEn: 'Title (English)',
      workshopTitleAr: 'Title (Arabic)',
      description: 'Description (Swedish)',
      descriptionEn: 'Description (English)',
      descriptionAr: 'Description (Arabic)',
      type: 'Type',
      typeInternational: 'International',
      typeNational: 'National',
      typeOnline: 'Online',
      typeTot: 'ToT (Training of Trainers)',
      targetGender: 'Target Group',
      genderAll: 'All',
      genderWomen: 'Women',
      genderMen: 'Men',
      workshopLanguage: 'Language',
      date: 'Start Date',
      endDate: 'End Date',
      location: 'Location (Swedish)',
      locationEn: 'Location (English)',
      locationAr: 'Location (Arabic)',
      spots: 'Number of spots',
      ageMin: 'Minimum age',
      ageMax: 'Maximum age',
      price: 'Price',
      currency: 'Currency',
      isOnline: 'Online workshop',
      isTot: 'Training of Trainers (FDS)',
      isActive: 'Active',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this workshop?',
      international: 'International',
      national: 'National',
      online: 'Online',
      tot: 'ToT',
      shareLink: 'Share nomination link',
      showQR: 'Show QR code',
      nominationLink: 'Nomination link',
      qrCodeTitle: 'QR code for nomination',
      qrCodeDescription: 'Scan to nominate a participant for this workshop',
      copyLink: 'Copy link',
      linkCopied: 'Link copied!',
      downloadQR: 'Download QR code',
      close: 'Close'
    },
    ar: {
      title: 'إدارة ورش العمل',
      subtitle: 'إضافة وتعديل وحذف ورش العمل',
      back: 'العودة إلى الإدارة',
      addNew: 'إضافة ورشة عمل',
      noWorkshops: 'لم يتم العثور على ورش عمل',
      editWorkshop: 'تعديل ورشة العمل',
      createWorkshop: 'إنشاء ورشة عمل جديدة',
      workshopTitle: 'العنوان (السويدية)',
      workshopTitleEn: 'العنوان (الإنجليزية)',
      workshopTitleAr: 'العنوان (العربية)',
      description: 'الوصف (السويدية)',
      descriptionEn: 'الوصف (الإنجليزية)',
      descriptionAr: 'الوصف (العربية)',
      type: 'النوع',
      typeInternational: 'دولي',
      typeNational: 'وطني',
      typeOnline: 'عبر الإنترنت',
      typeTot: 'تدريب المدربين',
      targetGender: 'الفئة المستهدفة',
      genderAll: 'الجميع',
      genderWomen: 'نساء',
      genderMen: 'رجال',
      workshopLanguage: 'اللغة',
      date: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      location: 'الموقع (السويدية)',
      locationEn: 'الموقع (الإنجليزية)',
      locationAr: 'الموقع (العربية)',
      spots: 'عدد الأماكن',
      ageMin: 'الحد الأدنى للعمر',
      ageMax: 'الحد الأقصى للعمر',
      price: 'السعر',
      currency: 'العملة',
      isOnline: 'ورشة عمل عبر الإنترنت',
      isTot: 'تدريب المدربين (FDS)',
      isActive: 'نشط',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      confirmDelete: 'هل أنت متأكد من حذف هذه الورشة؟',
      international: 'دولي',
      national: 'وطني',
      online: 'عبر الإنترنت',
      tot: 'تدريب المدربين',
      shareLink: 'مشاركة رابط الترشيح',
      showQR: 'عرض رمز QR',
      nominationLink: 'رابط الترشيح',
      qrCodeTitle: 'رمز QR للترشيح',
      qrCodeDescription: 'امسح لترشيح مشارك لهذه الورشة',
      copyLink: 'نسخ الرابط',
      linkCopied: 'تم نسخ الرابط!',
      downloadQR: 'تحميل رمز QR',
      close: 'إغلاق'
    }
  }[language] || {};

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops?active_only=false`);
      if (response.ok) {
        const data = await response.json();
        setWorkshops(data);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get localized text from object or string
  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.sv || field.en || '';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_en: '',
      title_ar: '',
      description: '',
      description_en: '',
      description_ar: '',
      workshop_type: 'national',
      target_gender: 'all',
      language: '',
      date: '',
      end_date: '',
      location: '',
      location_en: '',
      location_ar: '',
      spots: '',
      age_min: '',
      age_max: '',
      price: 500,
      currency: 'SEK',
      is_online: false,
      is_tot: false,
      is_active: true
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setEditingWorkshop(null);
    setShowDialog(true);
  };

  const openEditDialog = (workshop) => {
    // Handle title that might be string or object
    const getTitle = (titleField) => {
      if (!titleField) return '';
      if (typeof titleField === 'string') return titleField;
      if (typeof titleField === 'object') return titleField.sv || titleField.en || '';
      return String(titleField);
    };
    
    setFormData({
      title: getTitle(workshop.title),
      title_en: workshop.title_en || (typeof workshop.title === 'object' ? workshop.title.en : '') || '',
      title_ar: workshop.title_ar || (typeof workshop.title === 'object' ? workshop.title.ar : '') || '',
      description: typeof workshop.description === 'object' ? workshop.description.sv || '' : workshop.description || '',
      description_en: workshop.description_en || (typeof workshop.description === 'object' ? workshop.description.en : '') || '',
      description_ar: workshop.description_ar || (typeof workshop.description === 'object' ? workshop.description.ar : '') || '',
      workshop_type: workshop.workshop_type || 'national',
      target_gender: workshop.target_gender || 'all',
      language: workshop.language || '',
      date: workshop.date || '',
      end_date: workshop.end_date || '',
      location: typeof workshop.location === 'object' ? workshop.location.sv || '' : workshop.location || '',
      location_en: workshop.location_en || (typeof workshop.location === 'object' ? workshop.location.en : '') || '',
      location_ar: workshop.location_ar || (typeof workshop.location === 'object' ? workshop.location.ar : '') || '',
      spots: workshop.spots || '',
      age_min: workshop.age_min || '',
      age_max: workshop.age_max || '',
      price: workshop.price || 500,
      currency: workshop.currency || 'SEK',
      is_online: workshop.is_online || false,
      is_tot: workshop.is_tot || false,
      is_active: workshop.is_active !== false
    });
    setEditingWorkshop(workshop);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error(language === 'sv' ? 'Titel krävs' : 'Title required');
      return;
    }

    const payload = {
      ...formData,
      spots: formData.spots ? parseInt(formData.spots) : null,
      age_min: formData.age_min ? parseInt(formData.age_min) : null,
      age_max: formData.age_max ? parseInt(formData.age_max) : null,
      price: formData.price ? parseFloat(formData.price) : null
    };

    try {
      const url = editingWorkshop 
        ? `${BACKEND_URL}/api/workshops/${editingWorkshop.id}`
        : `${BACKEND_URL}/api/workshops`;
      
      const response = await fetch(url, {
        method: editingWorkshop ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingWorkshop 
          ? (language === 'sv' ? 'Workshop uppdaterad' : 'Workshop updated')
          : (language === 'sv' ? 'Workshop skapad' : 'Workshop created')
        );
        setShowDialog(false);
        fetchWorkshops();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Något gick fel' : 'Something went wrong');
    }
  };

  const handleDelete = async (workshopId) => {
    if (!window.confirm(txt.confirmDelete)) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success(language === 'sv' ? 'Workshop raderad' : 'Workshop deleted');
        fetchWorkshops();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte radera' : 'Could not delete');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'international': return <Globe className="h-4 w-4" />;
      case 'national': return <Home className="h-4 w-4" />;
      case 'online': return <Monitor className="h-4 w-4" />;
      case 'tot': return <GraduationCap className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      international: 'bg-blue-100 text-blue-800',
      national: 'bg-violet-100 text-violet-800',
      online: 'bg-emerald-100 text-emerald-800',
      tot: 'bg-amber-100 text-amber-800'
    };
    const labels = {
      international: txt.international,
      national: txt.national,
      online: txt.online,
      tot: txt.tot
    };
    return (
      <Badge className={styles[type] || 'bg-stone-100'}>
        {getTypeIcon(type)}
        <span className="ml-1">{labels[type] || type}</span>
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(
      language === 'sv' ? 'sv-SE' : language === 'ar' ? 'ar-SA' : 'en-US'
    );
  };

  const formatPrice = (price, currency) => {
    if (!price) return '-';
    return `${price} ${currency}`;
  };

  // Get nomination link for a workshop
  const getNominationLink = (workshopId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/nominera/${workshopId}`;
  };

  // Copy nomination link to clipboard
  const copyNominationLink = (workshop) => {
    const link = getNominationLink(workshop.id);
    navigator.clipboard.writeText(link).then(() => {
      toast.success(txt.linkCopied);
    }).catch(() => {
      toast.error('Kunde inte kopiera länken');
    });
    // Also open QR modal to show the link visually
    openQRModal(workshop);
  };

  // Open QR code modal
  const openQRModal = (workshop) => {
    setQrWorkshop(workshop);
    setShowQRDialog(true);
  };

  // Download QR code as image
  const downloadQRCode = () => {
    const svg = document.getElementById('nomination-qr-code');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 300, 300);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `nominering-qr-${qrWorkshop?.id || 'workshop'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/admin" 
            className={`inline-flex items-center text-haggai hover:text-haggai-dark mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {txt.back}
          </Link>
          
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h1 className="text-3xl font-bold text-stone-800">{txt.title}</h1>
                <p className="text-stone-600">{txt.subtitle}</p>
              </div>
            </div>
            <Button onClick={openCreateDialog} className="bg-haggai hover:bg-haggai-dark">
              <Plus className="h-4 w-4 mr-2" />
              {txt.addNew}
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
          </div>
        ) : workshops.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noWorkshops}</p>
              <Button onClick={openCreateDialog} className="mt-4 bg-haggai hover:bg-haggai-dark">
                <Plus className="h-4 w-4 mr-2" />
                {txt.addNew}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {workshops.map(workshop => (
              <Card key={workshop.id} className={`border-0 shadow-lg ${!workshop.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {getTypeBadge(workshop.workshop_type)}
                        {workshop.target_gender !== 'all' && (
                          <Badge variant="outline">
                            {workshop.target_gender === 'women' ? txt.genderWomen : txt.genderMen}
                          </Badge>
                        )}
                        {!workshop.is_active && (
                          <Badge className="bg-red-100 text-red-800">Inaktiv</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-stone-800 mb-2">{getLocalizedText(workshop.title)}</h3>
                      
                      {workshop.description && (
                        <p className="text-stone-600 mb-4">{getLocalizedText(workshop.description)}</p>
                      )}
                      
                      <div className={`flex flex-wrap gap-4 text-sm text-stone-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {workshop.date && (
                          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            {formatDate(workshop.date)}
                            {workshop.end_date && ` - ${formatDate(workshop.end_date)}`}
                          </span>
                        )}
                        {workshop.location && (
                          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <MapPin className="h-4 w-4" />
                            {getLocalizedText(workshop.location)}
                          </span>
                        )}
                        {workshop.spots && (
                          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Users className="h-4 w-4" />
                            {workshop.spots} {language === 'sv' ? 'platser' : 'spots'}
                          </span>
                        )}
                        {(workshop.age_min || workshop.age_max) && (
                          <span>
                            {language === 'sv' ? 'Ålder: ' : 'Age: '}
                            {workshop.age_min || '?'}-{workshop.age_max || '?'} {language === 'sv' ? 'år' : 'years'}
                          </span>
                        )}
                        {workshop.price && (
                          <span className="text-stone-400">
                            {formatPrice(workshop.price, workshop.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex flex-col items-end gap-3 ${isRTL ? 'items-start' : ''}`}>
                      {/* Share buttons row */}
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyNominationLink(workshop)}
                          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          data-testid={`share-link-btn-${workshop.id}`}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          {txt.shareLink}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openQRModal(workshop)}
                          className="border-violet-500 text-violet-600 hover:bg-violet-50"
                          data-testid={`show-qr-btn-${workshop.id}`}
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          {txt.showQR}
                        </Button>
                      </div>
                      {/* Action buttons row */}
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Link to={`/admin/workshops/${workshop.id}/agenda`}>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-haggai text-haggai hover:bg-haggai hover:text-white"
                          >
                            <CalendarDays className="h-4 w-4 mr-1" />
                            {language === 'sv' ? 'Agenda' : 'Agenda'}
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          onClick={() => openEditDialog(workshop)}
                          className="bg-haggai hover:bg-haggai-dark"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          {language === 'sv' ? 'Redigera' : 'Edit'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(workshop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle>
              {editingWorkshop ? txt.editWorkshop : txt.createWorkshop}
            </DialogTitle>
          </DialogHeader>

          <div className={`space-y-6 mt-4 ${isRTL ? 'text-right' : ''}`}>
            {/* Titles */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{txt.workshopTitle} *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{txt.workshopTitleEn}</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{txt.workshopTitleAr}</Label>
                  <Input
                    value={formData.title_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Type & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{txt.type}</Label>
                <select
                  value={formData.workshop_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, workshop_type: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="international">{txt.typeInternational}</option>
                  <option value="national">{txt.typeNational}</option>
                  <option value="online">{txt.typeOnline}</option>
                  <option value="tot">{txt.typeTot}</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>{txt.targetGender}</Label>
                <select
                  value={formData.target_gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_gender: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">{txt.genderAll}</option>
                  <option value="women">{txt.genderWomen}</option>
                  <option value="men">{txt.genderMen}</option>
                </select>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <Label>{txt.description}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            {/* Dates & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{txt.date}</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.endDate}</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{txt.location}</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            {/* Spots & Age */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{txt.spots}</Label>
                <Input
                  type="number"
                  value={formData.spots}
                  onChange={(e) => setFormData(prev => ({ ...prev, spots: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.ageMin}</Label>
                <Input
                  type="number"
                  value={formData.age_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, age_min: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.ageMax}</Label>
                <Input
                  type="number"
                  value={formData.age_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, age_max: e.target.value }))}
                />
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{txt.price} *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.currency}</Label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="SEK">SEK (kr)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_online}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_online: e.target.checked }))}
                  className="rounded"
                />
                {txt.isOnline}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_tot}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_tot: e.target.checked }))}
                  className="rounded"
                />
                {txt.isTot}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                {txt.isActive}
              </label>
            </div>

            {/* Actions */}
            <div className={`flex gap-3 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                {txt.cancel}
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-haggai hover:bg-haggai-dark">
                <Save className="h-4 w-4 mr-2" />
                {txt.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog for Nomination */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-haggai" />
              {txt.qrCodeTitle}
            </DialogTitle>
          </DialogHeader>

          {qrWorkshop && (
            <div className="space-y-6 py-4">
              {/* Workshop info */}
              <div className={`text-center ${isRTL ? 'text-right' : ''}`}>
                <h3 className="font-semibold text-stone-800 text-lg mb-1">
                  {getLocalizedText(qrWorkshop.title)}
                </h3>
                {qrWorkshop.date && (
                  <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(qrWorkshop.date)}
                    {qrWorkshop.end_date && ` - ${formatDate(qrWorkshop.end_date)}`}
                  </p>
                )}
              </div>

              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white rounded-xl border-2 border-dashed border-stone-200">
                <QRCodeSVG 
                  id="nomination-qr-code"
                  value={getNominationLink(qrWorkshop.id)}
                  size={200}
                  level="H"
                  includeMargin={true}
                  data-testid="nomination-qr-code"
                />
              </div>

              {/* Description */}
              <p className="text-center text-sm text-stone-500">
                {txt.qrCodeDescription}
              </p>

              {/* Link display */}
              <div className="bg-stone-50 rounded-lg p-3 break-all text-sm text-stone-600 font-mono">
                {getNominationLink(qrWorkshop.id)}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => copyNominationLink(qrWorkshop)}
                  className="flex-1"
                  data-testid="copy-nomination-link-btn"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {txt.copyLink}
                </Button>
                <Button 
                  onClick={downloadQRCode}
                  className="flex-1 bg-haggai hover:bg-haggai-dark"
                  data-testid="download-qr-btn"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {txt.downloadQR}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkshops;
