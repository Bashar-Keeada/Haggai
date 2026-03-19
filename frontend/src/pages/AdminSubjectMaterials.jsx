import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft, Plus, Trash2, Edit2, Link2, ExternalLink, BookOpen, Save, X, Globe
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminSubjectMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    subject_id: 1,
    title: '',
    url: '',
    description: '',
    language: 'sv'
  });

  // Subject definitions matching MemberKnowledge.jsx
  const subjects = [
    { id: 1, title: 'Vision', color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'Uppdrag', color: 'from-emerald-500 to-emerald-600' },
    { id: 3, title: 'Motivation', color: 'from-amber-500 to-amber-600' },
    { id: 4, title: 'Ledarskap', color: 'from-purple-500 to-purple-600' },
    { id: 5, title: 'Övervinnare', color: 'from-red-500 to-red-600' },
    { id: 6, title: 'Multiplikation', color: 'from-teal-500 to-teal-600' },
    { id: 7, title: 'Resurs- & Medelanskaffning', color: 'from-indigo-500 to-indigo-600' }
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/subjects/materials`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Kunde inte hämta material');
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = (subjectId = 1) => {
    setEditingMaterial(null);
    setFormData({
      subject_id: subjectId,
      title: '',
      url: '',
      description: '',
      language: 'sv'
    });
    setShowDialog(true);
  };

  const openEditDialog = (material) => {
    setEditingMaterial(material);
    setFormData({
      subject_id: material.subject_id,
      title: material.title,
      url: material.url,
      description: material.description || '',
      language: material.language || 'sv'
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      toast.error('Fyll i titel och länk');
      return;
    }

    // Validate URL
    try {
      new URL(formData.url);
    } catch {
      toast.error('Ogiltig URL');
      return;
    }

    setSaving(true);
    try {
      const url = editingMaterial 
        ? `${BACKEND_URL}/api/subjects/materials/${editingMaterial.id}`
        : `${BACKEND_URL}/api/subjects/${formData.subject_id}/materials`;
      
      const method = editingMaterial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingMaterial ? 'Material uppdaterat' : 'Material tillagt');
        fetchMaterials();
        setShowDialog(false);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Kunde inte spara material');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!confirm('Vill du ta bort detta material?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/subjects/materials/${materialId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Material borttaget');
        fetchMaterials();
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Kunde inte ta bort material');
    }
  };

  const getSubjectMaterials = (subjectId) => {
    return materials.filter(m => m.subject_id === subjectId);
  };

  const getLanguageLabel = (lang) => {
    const labels = { sv: 'Svenska', en: 'English', ar: 'العربية', all: 'Alla' };
    return labels[lang] || lang;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-haggai hover:text-haggai-dark">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-stone-800">Ämnesmaterial</h1>
                <p className="text-sm text-stone-500">Hantera studiematerial för kärnämnena</p>
              </div>
            </div>
            <Button onClick={() => openAddDialog()} className="bg-haggai hover:bg-haggai-dark">
              <Plus className="h-4 w-4 mr-2" />
              Lägg till material
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {subjects.map((subject) => {
            const subjectMaterials = getSubjectMaterials(subject.id);
            
            return (
              <Card key={subject.id} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${subject.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {subject.id}. {subject.title}
                    </CardTitle>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => openAddDialog(subject.id)}
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Lägg till
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {subjectMaterials.length === 0 ? (
                    <div className="p-8 text-center text-stone-400">
                      <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Inga material tillagda ännu</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {subjectMaterials.map((material) => (
                        <div 
                          key={material.id} 
                          className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                              <Link2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-800">{material.title}</p>
                              <div className="flex items-center gap-2 text-xs text-stone-500">
                                <Globe className="h-3 w-3" />
                                <span>{getLanguageLabel(material.language)}</span>
                                {material.description && (
                                  <span className="truncate max-w-xs">• {material.description}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-haggai hover:text-haggai-dark"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(material)}
                              className="text-stone-500 hover:text-haggai"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(material.id)}
                              className="text-stone-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-haggai" />
              {editingMaterial ? 'Redigera material' : 'Lägg till material'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Ämne</Label>
              <select
                value={formData.subject_id}
                onChange={(e) => setFormData(prev => ({ ...prev, subject_id: parseInt(e.target.value) }))}
                className="w-full mt-1 p-2 border rounded-lg"
                disabled={!!editingMaterial}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.id}. {s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Titel *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="T.ex. Presentationsmaterial"
              />
            </div>

            <div>
              <Label>Länk (URL) *</Label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-stone-500 mt-1">
                Länk till Google Drive, Dropbox, eller annan fildelning
              </p>
            </div>

            <div>
              <Label>Beskrivning (valfritt)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kort beskrivning av materialet"
                rows={2}
              />
            </div>

            <div>
              <Label>Språk</Label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="sv">Svenska</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="all">Alla språk</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Avbryt
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !formData.title || !formData.url}
                className="flex-1 bg-haggai hover:bg-haggai-dark"
              >
                {saving ? 'Sparar...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Spara
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubjectMaterials;
