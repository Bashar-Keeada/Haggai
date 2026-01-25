import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Star, Send, CheckCircle2, AlertCircle, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SessionEvaluationForm = () => {
  const { workshopId, sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const { language, isRTL } = useLanguage();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState('');
  const [participantEmail, setParticipantEmail] = useState(searchParams.get('email') || '');

  const txt = {
    sv: {
      title: 'Utvärdering',
      subtitle: 'Betygsätt sessionen och ledaren',
      session: 'Session',
      leader: 'Ledare',
      ratingInstructions: 'Ge ett betyg från 1 (lågt) till 10 (högt) för varje fråga',
      comment: 'Övriga kommentarer (valfritt)',
      commentPlaceholder: 'Dela gärna ytterligare tankar eller förslag...',
      email: 'Din e-postadress (valfritt)',
      emailPlaceholder: 'För att kunna följa upp',
      submit: 'Skicka utvärdering',
      submitting: 'Skickar...',
      thankYou: 'Tack för din utvärdering!',
      thankYouMessage: 'Din feedback hjälper oss att förbättra våra utbildningar.',
      error: 'Kunde inte ladda utvärderingsformuläret',
      allQuestionsRequired: 'Vänligen besvara alla frågor',
      low: 'Lågt',
      high: 'Högt'
    },
    en: {
      title: 'Evaluation',
      subtitle: 'Rate the session and leader',
      session: 'Session',
      leader: 'Leader',
      ratingInstructions: 'Give a rating from 1 (low) to 10 (high) for each question',
      comment: 'Additional comments (optional)',
      commentPlaceholder: 'Feel free to share additional thoughts or suggestions...',
      email: 'Your email address (optional)',
      emailPlaceholder: 'For follow-up purposes',
      submit: 'Submit evaluation',
      submitting: 'Submitting...',
      thankYou: 'Thank you for your evaluation!',
      thankYouMessage: 'Your feedback helps us improve our training programs.',
      error: 'Could not load evaluation form',
      allQuestionsRequired: 'Please answer all questions',
      low: 'Low',
      high: 'High'
    },
    ar: {
      title: 'التقييم',
      subtitle: 'قيم الجلسة والقائد',
      session: 'الجلسة',
      leader: 'القائد',
      ratingInstructions: 'أعط تقييمًا من 1 (منخفض) إلى 10 (عالي) لكل سؤال',
      comment: 'تعليقات إضافية (اختياري)',
      commentPlaceholder: 'لا تتردد في مشاركة أفكار أو اقتراحات إضافية...',
      email: 'بريدك الإلكتروني (اختياري)',
      emailPlaceholder: 'لأغراض المتابعة',
      submit: 'إرسال التقييم',
      submitting: 'جاري الإرسال...',
      thankYou: 'شكراً لتقييمك!',
      thankYouMessage: 'ملاحظاتك تساعدنا على تحسين برامجنا التدريبية.',
      error: 'تعذر تحميل نموذج التقييم',
      allQuestionsRequired: 'يرجى الإجابة على جميع الأسئلة',
      low: 'منخفض',
      high: 'عالي'
    }
  }[language] || {};

  useEffect(() => {
    fetchFormData();
  }, [workshopId, sessionId]);

  const fetchFormData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/evaluation/form/${workshopId}/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        
        // Initialize answers
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
      } else {
        setError('not_found');
      }
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const getQuestionText = (question) => {
    if (language === 'en' && question.text_en) return question.text_en;
    if (language === 'ar' && question.text_ar) return question.text_ar;
    return question.text_sv;
  };

  const getDescriptionText = (question) => {
    if (language === 'en' && question.description_en) return question.description_en;
    if (language === 'ar' && question.description_ar) return question.description_ar;
    return question.description_sv;
  };

  const handleRatingChange = (questionId, rating) => {
    setAnswers(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const unanswered = formData.questions.filter(q => answers[q.id] === null);
    if (unanswered.length > 0) {
      toast.error(txt.allQuestionsRequired);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshop_id: workshopId,
          session_id: sessionId,
          leader_id: formData.leader_id,
          answers: Object.entries(answers).map(([question_id, rating]) => ({
            question_id,
            rating
          })),
          comment: comment || null,
          participant_email: participantEmail || null
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error('Kunde inte skicka utvärderingen');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{txt.error}</h1>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-4">{txt.thankYou}</h1>
          <p className="text-stone-600">{txt.thankYouMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-8" style={{background: 'linear-gradient(135deg, #014D73 0%, #012d44 100%)'}}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Badge className="bg-white/20 text-white mb-4 border-white/30">
            {txt.title}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{formData.workshop_title}</h1>
          <p className="text-white/80">{txt.subtitle}</p>
        </div>
      </section>

      {/* Session Info */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
                  <Calendar className="h-4 w-4" />
                  {txt.session}
                </div>
                <p className="font-semibold text-stone-800">{formData.session_title}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
                  <User className="h-4 w-4" />
                  {txt.leader}
                </div>
                <p className="font-semibold text-stone-800">{formData.leader_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-stone-600 mb-6">{txt.ratingInstructions}</p>

        <div className="space-y-6">
          {formData.questions.map((question, index) => (
            <Card key={question.id} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-haggai text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-stone-800">{getQuestionText(question)}</p>
                    {getDescriptionText(question) && (
                      <p className="text-sm text-stone-500 mt-1">{getDescriptionText(question)}</p>
                    )}
                  </div>
                </div>

                {/* Rating Scale 1-10 */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-stone-400 mb-2 px-1">
                    <span>{txt.low}</span>
                    <span>{txt.high}</span>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(question.id, rating)}
                        className={`flex-1 h-12 sm:h-14 rounded-lg font-bold text-sm sm:text-lg transition-all ${
                          answers[question.id] === rating
                            ? rating <= 3 
                              ? 'bg-red-500 text-white scale-105 shadow-lg'
                              : rating <= 6 
                                ? 'bg-yellow-500 text-white scale-105 shadow-lg'
                                : 'bg-green-500 text-white scale-105 shadow-lg'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Comment */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Label className="text-stone-800 font-medium">{txt.comment}</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={txt.commentPlaceholder}
                rows={3}
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Email (optional) */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <Label className="text-stone-800 font-medium">{txt.email}</Label>
              <Input
                type="email"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
                placeholder={txt.emailPlaceholder}
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-14 bg-haggai hover:bg-haggai-dark text-white text-lg"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {txt.submitting}
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                {txt.submit}
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-stone-400 text-sm">
          <p>Haggai Sweden | <a href="https://haggai.se" className="text-haggai hover:underline">haggai.se</a> <span className="text-stone-300">(By Keeada)</span></p>
        </div>
      </div>
    </div>
  );
};

export default SessionEvaluationForm;
