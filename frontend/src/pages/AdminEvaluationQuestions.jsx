import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical,
  HelpCircle, Check, AlertCircle
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminEvaluationQuestions = () => {
  const { language, isRTL } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const [formData, setFormData] = useState({
    text_sv: '',
    text_en: '',
    text_ar: '',
    description_sv: '',
    description_en: '',
    description_ar: '',
    is_active: true,
    order: 0
  });

  const txt = {
    sv: {
      title: 'Utvärderingsfrågor',
      subtitle: 'Hantera frågor som används vid sessionsutvärderingar',
      back: 'Tillbaka till Admin',
      addQuestion: 'Lägg till fråga',
      editQuestion: 'Redigera fråga',
      questionText: 'Frågetext (Svenska)',
      questionTextEn: 'Frågetext (Engelska)',
      questionTextAr: 'Frågetext (Arabiska)',
      description: 'Hjälptext (valfritt)',
      descriptionEn: 'Hjälptext engelska',
      descriptionAr: 'Hjälptext arabiska',
      order: 'Ordning',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      showInactive: 'Visa inaktiva',
      hideInactive: 'Dölj inaktiva',
      save: 'Spara',
      cancel: 'Avbryt',
      delete: 'Inaktivera',
      noQuestions: 'Inga frågor skapade ännu',
      questionSaved: 'Fråga sparad!',
      questionDeleted: 'Fråga inaktiverad',
      ratingScale: 'Betyg 1-10'
    },
    en: {
      title: 'Evaluation Questions',
      subtitle: 'Manage questions used in session evaluations',
      back: 'Back to Admin',
      addQuestion: 'Add Question',
      editQuestion: 'Edit Question',
      questionText: 'Question Text (Swedish)',
      questionTextEn: 'Question Text (English)',
      questionTextAr: 'Question Text (Arabic)',
      description: 'Help Text (optional)',
      descriptionEn: 'Help text English',
      descriptionAr: 'Help text Arabic',
      order: 'Order',
      active: 'Active',
      inactive: 'Inactive',
      showInactive: 'Show inactive',
      hideInactive: 'Hide inactive',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Deactivate',
      noQuestions: 'No questions created yet',
      questionSaved: 'Question saved!',
      questionDeleted: 'Question deactivated',
      ratingScale: 'Rating 1-10'
    }
  }[language] || {};

  useEffect(() => {
    fetchQuestions();
  }, [showInactive]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/evaluation-questions?active_only=${!showInactive}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingQuestion(null);
    setFormData({
      text_sv: '',
      text_en: '',
      text_ar: '',
      description_sv: '',
      description_en: '',
      description_ar: '',
      is_active: true,
      order: questions.length
    });
    setShowDialog(true);
  };

  const openEditDialog = (question) => {
    setEditingQuestion(question);
    setFormData({
      text_sv: question.text_sv || '',
      text_en: question.text_en || '',
      text_ar: question.text_ar || '',
      description_sv: question.description_sv || '',
      description_en: question.description_en || '',
      description_ar: question.description_ar || '',
      is_active: question.is_active !== false,
      order: question.order || 0
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.text_sv.trim()) {
      toast.error('Frågetext (svenska) krävs');
      return;
    }

    try {
      const url = editingQuestion 
        ? `${BACKEND_URL}/api/evaluation-questions/${editingQuestion.id}`
        : `${BACKEND_URL}/api/evaluation-questions`;
      
      const response = await fetch(url, {
        method: editingQuestion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(txt.questionSaved);
        setShowDialog(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Kunde inte spara frågan');
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Är du säker på att du vill inaktivera denna fråga?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/evaluation-questions/${questionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(txt.questionDeleted);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/admin" 
            className="inline-flex items-center text-haggai hover:text-haggai-dark mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {txt.back}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="h-8 w-8 text-haggai" />
                <h1 className="text-2xl font-bold text-stone-800">{txt.title}</h1>
              </div>
              <p className="text-stone-600">{txt.subtitle}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInactive(!showInactive)}
              >
                {showInactive ? txt.hideInactive : txt.showInactive}
              </Button>
              <Button 
                onClick={openAddDialog}
                className="bg-haggai hover:bg-haggai-dark text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {txt.addQuestion}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Questions List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {questions.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noQuestions}</p>
              <Button 
                onClick={openAddDialog}
                className="mt-4 bg-haggai hover:bg-haggai-dark text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {txt.addQuestion}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <Card 
                key={question.id} 
                className={`border-0 shadow-md hover:shadow-lg transition-shadow ${
                  !question.is_active ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 text-stone-400">
                      <GripVertical className="h-5 w-5" />
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-stone-800">{question.text_sv}</p>
                          {question.text_en && (
                            <p className="text-sm text-stone-500 mt-1">{question.text_en}</p>
                          )}
                          {question.description_sv && (
                            <p className="text-xs text-stone-400 mt-2 italic">{question.description_sv}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={question.is_active ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}>
                            {question.is_active ? txt.active : txt.inactive}
                          </Badge>
                          <Badge className="bg-haggai-100 text-haggai-dark">
                            {txt.ratingScale}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => openEditDialog(question)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {question.is_active && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? txt.editQuestion : txt.addQuestion}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Swedish Text (Required) */}
            <div className="space-y-2">
              <Label>{txt.questionText} *</Label>
              <Textarea
                value={formData.text_sv}
                onChange={(e) => setFormData(prev => ({ ...prev, text_sv: e.target.value }))}
                placeholder="T.ex. Hur väl förberedde ledaren sessionen?"
                rows={2}
              />
            </div>

            {/* English Text */}
            <div className="space-y-2">
              <Label>{txt.questionTextEn}</Label>
              <Textarea
                value={formData.text_en}
                onChange={(e) => setFormData(prev => ({ ...prev, text_en: e.target.value }))}
                placeholder="How well did the leader prepare the session?"
                rows={2}
              />
            </div>

            {/* Arabic Text */}
            <div className="space-y-2">
              <Label>{txt.questionTextAr}</Label>
              <Textarea
                value={formData.text_ar}
                onChange={(e) => setFormData(prev => ({ ...prev, text_ar: e.target.value }))}
                dir="rtl"
                rows={2}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>{txt.description}</Label>
              <Input
                value={formData.description_sv}
                onChange={(e) => setFormData(prev => ({ ...prev, description_sv: e.target.value }))}
                placeholder="Hjälptext som visas under frågan"
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label>{txt.order}</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-stone-300"
              />
              <Label htmlFor="is_active">{txt.active}</Label>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Alla frågor besvaras med betyg 1-10 av deltagarna
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
              {txt.cancel}
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-haggai hover:bg-haggai-dark text-white">
              <Save className="h-4 w-4 mr-2" />
              {txt.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvaluationQuestions;
