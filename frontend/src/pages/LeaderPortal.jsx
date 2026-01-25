import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Calendar, FileText, Upload, LogOut, Edit2, Save, X,
  Plane, CreditCard, CheckCircle, Clock, MapPin, Users, 
  ChevronRight, AlertCircle, Trash2, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LeaderPortal = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  
  const [leader, setLeader] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadType, setUploadType] = useState('');
  
  const [formData, setFormData] = useState({});

  const txt = {
    sv: {
      title: 'Ledarportalen',
      welcome: 'Välkommen',
      logout: 'Logga ut',
      tabs: {
        profile: 'Min Profil',
        sessions: 'Mina Sessioner',
        documents: 'Dokument',
        badge: 'Namnskylt'
      },
      profile: {
        title: 'Profilinformation',
        edit: 'Redigera',
        save: 'Spara',
        cancel: 'Avbryt',
        name: 'Namn',
        email: 'E-post',
        phone: 'Telefon',
        role: 'Roll/Titel',
        bio: 'Om mig',
        topics: 'Expertområden',
        travel: 'Resa & Logi',
        costPreference: 'Kostnadsval',
        costSelf: 'Jag står själv för kostnaden',
        costHaggai: 'Haggai bidrar till kostnaden',
        arrival: 'Ankomst',
        departure: 'Avresa',
        dietary: 'Specialkost',
        otherNeeds: 'Övriga behov',
        bank: 'Bankuppgifter',
        bankName: 'Bank',
        bankAccount: 'Kontonummer',
        bankClearing: 'Clearing',
        status: 'Status',
        statusApproved: 'Godkänd',
        statusPending: 'Väntar på godkännande'
      },
      sessions: {
        title: 'Tilldelade sessioner',
        noSessions: 'Du har inga tilldelade sessioner än.',
        workshop: 'Workshop',
        date: 'Datum',
        time: 'Tid',
        topic: 'Ämne'
      },
      documents: {
        title: 'Mina dokument',
        upload: 'Ladda upp dokument',
        types: {
          profile_image: 'Profilbild',
          topic_material: 'Ämnes-material',
          receipt: 'Kvitto',
          travel_ticket: 'Resebiljett',
          other: 'Övrigt'
        },
        noDocuments: 'Du har inga uppladdade dokument.',
        delete: 'Radera',
        uploadedAt: 'Uppladdat'
      }
    },
    en: {
      title: 'Leader Portal',
      welcome: 'Welcome',
      logout: 'Log out',
      tabs: {
        profile: 'My Profile',
        sessions: 'My Sessions',
        documents: 'Documents',
        badge: 'Name Badge'
      },
      profile: {
        title: 'Profile Information',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        role: 'Role/Title',
        bio: 'About me',
        topics: 'Areas of expertise',
        travel: 'Travel & Accommodation',
        costPreference: 'Cost preference',
        costSelf: 'I cover my own costs',
        costHaggai: 'Haggai contributes to costs',
        arrival: 'Arrival',
        departure: 'Departure',
        dietary: 'Special dietary',
        otherNeeds: 'Other needs',
        bank: 'Bank details',
        bankName: 'Bank',
        bankAccount: 'Account number',
        bankClearing: 'Clearing',
        status: 'Status',
        statusApproved: 'Approved',
        statusPending: 'Awaiting approval'
      },
      sessions: {
        title: 'Assigned sessions',
        noSessions: 'You have no assigned sessions yet.',
        workshop: 'Workshop',
        date: 'Date',
        time: 'Time',
        topic: 'Topic'
      },
      documents: {
        title: 'My documents',
        upload: 'Upload document',
        types: {
          profile_image: 'Profile picture',
          topic_material: 'Topic material',
          receipt: 'Receipt',
          travel_ticket: 'Travel ticket',
          other: 'Other'
        },
        noDocuments: 'You have no uploaded documents.',
        delete: 'Delete',
        uploadedAt: 'Uploaded'
      }
    }
  }[language] || {};

  useEffect(() => {
    const token = localStorage.getItem('leader_token');
    if (!token) {
      navigate('/ledare/login');
      return;
    }
    
    fetchLeaderData(token);
    fetchSessions(token);
  }, []);

  const fetchLeaderData = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeader(data);
        setFormData(data);
      } else if (response.status === 401) {
        localStorage.removeItem('leader_token');
        localStorage.removeItem('leader_info');
        navigate('/ledare/login');
      }
    } catch (err) {
      console.error('Error fetching leader data:', err);
      toast.error('Kunde inte ladda din profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders/me/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('leader_token');
    localStorage.removeItem('leader_info');
    navigate('/ledare/login');
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('leader_token');
    
    try {
      const updateData = {
        phone: formData.phone,
        bio_sv: formData.bio_sv,
        bio_en: formData.bio_en,
        role_sv: formData.role_sv,
        role_en: formData.role_en,
        topics_sv: formData.topics_sv,
        topics_en: formData.topics_en,
        cost_preference: formData.cost_preference,
        arrival_date: formData.arrival_date,
        departure_date: formData.departure_date,
        special_dietary: formData.special_dietary,
        other_needs: formData.other_needs,
        bank_name: formData.bank_name,
        bank_account: formData.bank_account,
        bank_clearing: formData.bank_clearing,
        bank_iban: formData.bank_iban,
        bank_swift: formData.bank_swift
      };
      
      const response = await fetch(`${BACKEND_URL}/api/leaders/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setLeader(updated);
        setFormData(updated);
        setEditing(false);
        toast.success(language === 'sv' ? 'Profilen har uppdaterats' : 'Profile updated');
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(language === 'sv' ? 'Kunde inte spara ändringar' : 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingDoc(true);
    const token = localStorage.getItem('leader_token');
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        
        const response = await fetch(`${BACKEND_URL}/api/leaders/me/documents?document_type=${uploadType}&filename=${file.name}&file_data=${encodeURIComponent(base64)}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          toast.success(language === 'sv' ? 'Dokument uppladdat' : 'Document uploaded');
          fetchLeaderData(token); // Refresh to get updated documents
          setShowUploadDialog(false);
        } else {
          throw new Error('Upload failed');
        }
        setUploadingDoc(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error(language === 'sv' ? 'Kunde inte ladda upp dokument' : 'Could not upload document');
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm(language === 'sv' ? 'Vill du radera detta dokument?' : 'Delete this document?')) return;
    
    const token = localStorage.getItem('leader_token');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaders/me/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success(language === 'sv' ? 'Dokument raderat' : 'Document deleted');
        fetchLeaderData(token);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error(language === 'sv' ? 'Kunde inte radera dokument' : 'Could not delete document');
    }
  };

  const getLocalizedText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value[language] || value.sv || value.en || '';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-stone-600">Kunde inte ladda din profil</p>
          <Button onClick={() => navigate('/ledare/login')} className="mt-4">
            Försök igen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {leader.image_url ? (
              <img src={leader.image_url} alt={leader.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-haggai rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-stone-800">{txt.welcome}, {leader.name}!</h1>
              <p className="text-sm text-stone-500">{txt.title}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            {txt.logout}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-haggai data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              {txt.tabs.profile}
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-haggai data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              {txt.tabs.sessions}
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-haggai data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              {txt.tabs.documents}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-haggai" />
                  {txt.profile.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={leader.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                    {leader.status === 'approved' ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> {txt.profile.statusApproved}</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1" /> {txt.profile.statusPending}</>
                    )}
                  </Badge>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      {txt.profile.edit}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(false); setFormData(leader); }}>
                        <X className="h-4 w-4 mr-1" />
                        {txt.profile.cancel}
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving} className="bg-haggai hover:bg-haggai-dark">
                        <Save className="h-4 w-4 mr-1" />
                        {txt.profile.save}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-500">{txt.profile.name}</Label>
                    <p className="font-medium">{leader.name}</p>
                  </div>
                  <div>
                    <Label className="text-stone-500">{txt.profile.email}</Label>
                    <p className="font-medium">{leader.email}</p>
                  </div>
                  <div>
                    <Label className="text-stone-500">{txt.profile.phone}</Label>
                    {editing ? (
                      <Input 
                        value={formData.phone || ''} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium">{leader.phone || '-'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-stone-500">{txt.profile.role}</Label>
                    {editing ? (
                      <Input 
                        value={formData.role_sv || ''} 
                        onChange={(e) => setFormData({...formData, role_sv: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium">{leader.role_sv || '-'}</p>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                <div>
                  <Label className="text-stone-500">{txt.profile.bio}</Label>
                  {editing ? (
                    <Textarea 
                      value={formData.bio_sv || ''} 
                      onChange={(e) => setFormData({...formData, bio_sv: e.target.value})}
                      rows={3}
                    />
                  ) : (
                    <p className="font-medium">{leader.bio_sv || '-'}</p>
                  )}
                </div>
                
                {/* Travel */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <Plane className="h-4 w-4 text-haggai" />
                    {txt.profile.travel}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-stone-500">{txt.profile.costPreference}</Label>
                      {editing ? (
                        <select 
                          value={formData.cost_preference || 'self'}
                          onChange={(e) => setFormData({...formData, cost_preference: e.target.value})}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="self">{txt.profile.costSelf}</option>
                          <option value="haggai_support">{txt.profile.costHaggai}</option>
                        </select>
                      ) : (
                        <p className="font-medium">
                          {leader.cost_preference === 'haggai_support' ? txt.profile.costHaggai : txt.profile.costSelf}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-stone-500">{txt.profile.dietary}</Label>
                      {editing ? (
                        <Input 
                          value={formData.special_dietary || ''} 
                          onChange={(e) => setFormData({...formData, special_dietary: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{leader.special_dietary || '-'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-stone-500">{txt.profile.arrival}</Label>
                      {editing ? (
                        <Input 
                          type="date"
                          value={formData.arrival_date || ''} 
                          onChange={(e) => setFormData({...formData, arrival_date: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{leader.arrival_date || '-'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-stone-500">{txt.profile.departure}</Label>
                      {editing ? (
                        <Input 
                          type="date"
                          value={formData.departure_date || ''} 
                          onChange={(e) => setFormData({...formData, departure_date: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{leader.departure_date || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bank */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-haggai" />
                    {txt.profile.bank}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-stone-500">{txt.profile.bankName}</Label>
                      {editing ? (
                        <Input 
                          value={formData.bank_name || ''} 
                          onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{leader.bank_name || '-'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-stone-500">{txt.profile.bankClearing}</Label>
                      {editing ? (
                        <Input 
                          value={formData.bank_clearing || ''} 
                          onChange={(e) => setFormData({...formData, bank_clearing: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{leader.bank_clearing || '-'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-stone-500">{txt.profile.bankAccount}</Label>
                      {editing ? (
                        <Input 
                          value={formData.bank_account || ''} 
                          onChange={(e) => setFormData({...formData, bank_account: e.target.value})}
                        />
                      ) : (
                        <p className="font-medium">{leader.bank_account || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-haggai" />
                  {txt.sessions.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500">{txt.sessions.noSessions}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((item, idx) => (
                      <div key={idx} className="p-4 border rounded-lg hover:bg-stone-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-stone-800">{item.session.title || item.session.title_sv}</h4>
                            <p className="text-sm text-stone-500 mt-1">
                              {getLocalizedText(item.workshop_title)}
                            </p>
                          </div>
                          <Badge className="bg-haggai/10 text-haggai">
                            {item.session.type || 'Session'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-stone-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {item.day_date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {item.session.start_time} - {item.session.end_time}
                          </span>
                          {item.workshop_location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {getLocalizedText(item.workshop_location)}
                            </span>
                          )}
                        </div>
                        {item.session.description && (
                          <p className="mt-2 text-sm text-stone-600">{item.session.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-haggai" />
                  {txt.documents.title}
                </CardTitle>
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="bg-haggai hover:bg-haggai-dark"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {txt.documents.upload}
                </Button>
              </CardHeader>
              <CardContent>
                {(!leader.documents || leader.documents.length === 0) ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500">{txt.documents.noDocuments}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leader.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-stone-50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-haggai" />
                          <div>
                            <p className="font-medium text-stone-800">{doc.filename}</p>
                            <p className="text-xs text-stone-500">
                              {txt.documents.types[doc.type] || doc.type} • {txt.documents.uploadedAt}: {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{txt.documents.upload}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Typ av dokument</Label>
              <select 
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Välj typ...</option>
                <option value="profile_image">{txt.documents.types.profile_image}</option>
                <option value="topic_material">{txt.documents.types.topic_material}</option>
                <option value="receipt">{txt.documents.types.receipt}</option>
                <option value="travel_ticket">{txt.documents.types.travel_ticket}</option>
                <option value="other">{txt.documents.types.other}</option>
              </select>
            </div>
            
            {uploadType && (
              <div className="space-y-2">
                <Label>Fil</Label>
                <Input 
                  type="file" 
                  onChange={handleFileUpload}
                  disabled={uploadingDoc}
                  accept={uploadType === 'profile_image' ? 'image/*' : '*'}
                />
              </div>
            )}
            
            {uploadingDoc && (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-haggai border-t-transparent rounded-full animate-spin" />
                <span className="ml-2">Laddar upp...</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaderPortal;
