import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, BarChart3, Star, Users, MessageSquare, Send,
  TrendingUp, TrendingDown, Award, AlertTriangle, Filter,
  ChevronDown, ChevronUp, Mail
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

const AdminEvaluationResults = () => {
  const { language, isRTL } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [stats, setStats] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState(searchParams.get('workshop') || '');
  const [selectedLeader, setSelectedLeader] = useState(searchParams.get('leader') || '');
  const [leaderDetails, setLeaderDetails] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackLeader, setFeedbackLeader] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    questions: true,
    leaders: true,
    sessions: true
  });

  const [feedbackForm, setFeedbackForm] = useState({
    feedback_type: 'general',
    subject: '',
    message: '',
    include_statistics: true
  });

  const txt = {
    sv: {
      title: 'Utvärderingsresultat',
      subtitle: 'Analysera och jämför utvärderingar av ämnesledare',
      back: 'Tillbaka till Admin',
      filterByWorkshop: 'Filtrera efter workshop',
      filterByLeader: 'Filtrera efter ledare',
      allWorkshops: 'Alla workshops',
      allLeaders: 'Alla ledare',
      totalEvaluations: 'Totalt antal utvärderingar',
      overallAverage: 'Genomsnittligt betyg',
      questionsBreakdown: 'Resultat per fråga',
      leadersComparison: 'Jämförelse av ledare',
      sessionsBreakdown: 'Resultat per session',
      noData: 'Inga utvärderingar att visa',
      evaluations: 'utvärderingar',
      average: 'Snitt',
      sendFeedback: 'Skicka återkoppling',
      feedbackType: 'Typ av återkoppling',
      praise: 'Beröm',
      improvement: 'Utvecklingsområden',
      general: 'Allmän återkoppling',
      subject: 'Ämne',
      message: 'Meddelande',
      includeStats: 'Inkludera statistik i mejlet',
      send: 'Skicka',
      cancel: 'Avbryt',
      feedbackSent: 'Återkoppling skickad!',
      strengths: 'Styrkor',
      improvementAreas: 'Utvecklingsområden',
      viewDetails: 'Visa detaljer',
      leaderDetails: 'Detaljer för ledare'
    },
    en: {
      title: 'Evaluation Results',
      subtitle: 'Analyze and compare session leader evaluations',
      back: 'Back to Admin',
      filterByWorkshop: 'Filter by workshop',
      filterByLeader: 'Filter by leader',
      allWorkshops: 'All workshops',
      allLeaders: 'All leaders',
      totalEvaluations: 'Total evaluations',
      overallAverage: 'Overall average',
      questionsBreakdown: 'Results by question',
      leadersComparison: 'Leaders comparison',
      sessionsBreakdown: 'Results by session',
      noData: 'No evaluations to display',
      evaluations: 'evaluations',
      average: 'Avg',
      sendFeedback: 'Send feedback',
      feedbackType: 'Feedback type',
      praise: 'Praise',
      improvement: 'Improvement areas',
      general: 'General feedback',
      subject: 'Subject',
      message: 'Message',
      includeStats: 'Include statistics in email',
      send: 'Send',
      cancel: 'Cancel',
      feedbackSent: 'Feedback sent!',
      strengths: 'Strengths',
      improvementAreas: 'Improvement areas',
      viewDetails: 'View details',
      leaderDetails: 'Leader details'
    }
  }[language] || {};

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [selectedWorkshop, selectedLeader]);

  const fetchInitialData = async () => {
    try {
      const [workshopsRes, leadersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/workshops?active_only=false`),
        fetch(`${BACKEND_URL}/api/leaders`)
      ]);

      if (workshopsRes.ok) {
        const data = await workshopsRes.json();
        setWorkshops(data);
      }
      if (leadersRes.ok) {
        const data = await leadersRes.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedWorkshop) params.append('workshop_id', selectedWorkshop);
      if (selectedLeader) params.append('leader_id', selectedLeader);

      const response = await fetch(`${BACKEND_URL}/api/evaluations/stats?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderDetails = async (leaderId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/evaluations/leader/${leaderId}/detailed`);
      if (response.ok) {
        const data = await response.json();
        setLeaderDetails(data);
      }
    } catch (error) {
      console.error('Error fetching leader details:', error);
    }
  };

  const openFeedbackDialog = (leader) => {
    setFeedbackLeader(leader);
    setFeedbackForm({
      feedback_type: 'general',
      subject: '',
      message: '',
      include_statistics: true
    });
    fetchLeaderDetails(leader.leader_id);
    setShowFeedbackDialog(true);
  };

  const sendFeedback = async () => {
    if (!feedbackForm.subject || !feedbackForm.message) {
      toast.error('Fyll i ämne och meddelande');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/evaluations/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leader_id: feedbackLeader.leader_id,
          workshop_id: selectedWorkshop || null,
          feedback_type: feedbackForm.feedback_type,
          subject: feedbackForm.subject,
          message: feedbackForm.message,
          include_statistics: feedbackForm.include_statistics
        })
      });

      if (response.ok) {
        toast.success(txt.feedbackSent);
        setShowFeedbackDialog(false);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte skicka feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Kunde inte skicka feedback');
    }
  };

  const getWorkshopTitle = (workshop) => {
    if (!workshop) return '';
    const title = workshop.title;
    if (typeof title === 'object') {
      return title.sv || title.en || Object.values(title)[0] || '';
    }
    return title || '';
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBg = (rating) => {
    if (rating >= 8) return 'bg-green-100';
    if (rating >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading && !stats) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <BarChart3 className="h-8 w-8 text-haggai" />
                <h1 className="text-2xl font-bold text-stone-800">{txt.title}</h1>
              </div>
              <p className="text-stone-600">{txt.subtitle}</p>
            </div>
            
            <Link to="/admin/utvardering/fragor">
              <Button variant="outline">
                Hantera frågor
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm text-stone-600 mb-1 block">{txt.filterByWorkshop}</Label>
              <select
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
                className="w-full rounded-lg border border-stone-300 p-2"
              >
                <option value="">{txt.allWorkshops}</option>
                {workshops.map(w => (
                  <option key={w.id} value={w.id}>{getWorkshopTitle(w)}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm text-stone-600 mb-1 block">{txt.filterByLeader}</Label>
              <select
                value={selectedLeader}
                onChange={(e) => setSelectedLeader(e.target.value)}
                className="w-full rounded-lg border border-stone-300 p-2"
              >
                <option value="">{txt.allLeaders}</option>
                {leaders.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!stats || stats.total_evaluations === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noData}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-haggai to-haggai-dark text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{txt.totalEvaluations}</p>
                      <p className="text-4xl font-bold mt-1">{stats.total_evaluations}</p>
                    </div>
                    <Users className="h-12 w-12 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-500 text-sm">{txt.overallAverage}</p>
                      <p className={`text-4xl font-bold mt-1 ${getRatingColor(stats.overall_average)}`}>
                        {stats.overall_average}/10
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${getRatingBg(stats.overall_average)}`}>
                      <Star className={`h-8 w-8 ${getRatingColor(stats.overall_average)}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions Breakdown */}
            {stats.questions_stats?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader 
                  className="cursor-pointer hover:bg-stone-50"
                  onClick={() => toggleSection('questions')}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-haggai" />
                      {txt.questionsBreakdown}
                    </CardTitle>
                    {expandedSections.questions ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
                {expandedSections.questions && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {stats.questions_stats.map((q, idx) => (
                        <div key={q.question_id} className="flex items-center gap-4">
                          <span className="text-stone-400 w-6">{idx + 1}.</span>
                          <div className="flex-1">
                            <p className="text-sm text-stone-700">{q.question_text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${q.average_rating >= 8 ? 'bg-green-500' : q.average_rating >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${q.average_rating * 10}%` }}
                                />
                              </div>
                              <span className={`font-bold min-w-[60px] text-right ${getRatingColor(q.average_rating)}`}>
                                {q.average_rating}/10
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-stone-400">
                            {q.response_count} svar
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Leaders Comparison */}
            {stats.leaders_comparison?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader 
                  className="cursor-pointer hover:bg-stone-50"
                  onClick={() => toggleSection('leaders')}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-haggai" />
                      {txt.leadersComparison}
                    </CardTitle>
                    {expandedSections.leaders ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
                {expandedSections.leaders && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {stats.leaders_comparison.map((leader, idx) => (
                        <div key={leader.leader_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-50">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            idx === 0 ? 'bg-yellow-100 text-yellow-600' : 
                            idx === 1 ? 'bg-stone-200 text-stone-600' :
                            idx === 2 ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {idx < 3 ? '🏆' : idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-stone-800">{leader.leader_name}</p>
                            <p className="text-xs text-stone-500">
                              {leader.evaluation_count} {txt.evaluations}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full ${getRatingBg(leader.average_rating)}`}>
                              <span className={`font-bold ${getRatingColor(leader.average_rating)}`}>
                                {leader.average_rating}/10
                              </span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openFeedbackDialog(leader)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              {txt.sendFeedback}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Sessions Breakdown */}
            {stats.sessions_stats?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader 
                  className="cursor-pointer hover:bg-stone-50"
                  onClick={() => toggleSection('sessions')}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-haggai" />
                      {txt.sessionsBreakdown}
                    </CardTitle>
                    {expandedSections.sessions ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
                {expandedSections.sessions && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {stats.sessions_stats.map((session) => (
                        <div key={session.session_id} className="flex items-center gap-4 p-2 rounded hover:bg-stone-50">
                          <div className="flex-1">
                            <p className="font-medium text-stone-800">{session.session_title}</p>
                            <p className="text-xs text-stone-500">
                              Ledare: {session.leader_name} • {session.evaluation_count} {txt.evaluations}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full ${getRatingBg(session.average_rating)}`}>
                            <span className={`font-bold ${getRatingColor(session.average_rating)}`}>
                              {session.average_rating}/10
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-haggai" />
              {txt.sendFeedback} - {feedbackLeader?.leader_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Leader Stats Summary */}
            {leaderDetails && (
              <div className="bg-stone-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">Genomsnitt:</span>
                  <span className={`font-bold ${getRatingColor(leaderDetails.overall_average)}`}>
                    {leaderDetails.overall_average}/10
                  </span>
                </div>
                
                {leaderDetails.strengths?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-700 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> {txt.strengths}:
                    </p>
                    <ul className="text-sm text-stone-600 ml-5 mt-1">
                      {leaderDetails.strengths.map(s => (
                        <li key={s.question_id}>• {s.question_text}: {s.average_rating}/10</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {leaderDetails.improvement_areas?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-amber-700 flex items-center gap-1">
                      <TrendingDown className="h-4 w-4" /> {txt.improvementAreas}:
                    </p>
                    <ul className="text-sm text-stone-600 ml-5 mt-1">
                      {leaderDetails.improvement_areas.map(s => (
                        <li key={s.question_id}>• {s.question_text}: {s.average_rating}/10</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Type */}
            <div className="space-y-2">
              <Label>{txt.feedbackType}</Label>
              <select
                value={feedbackForm.feedback_type}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback_type: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 p-2"
              >
                <option value="praise">{txt.praise}</option>
                <option value="improvement">{txt.improvement}</option>
                <option value="general">{txt.general}</option>
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>{txt.subject} *</Label>
              <Input
                value={feedbackForm.subject}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="T.ex. Utmärkt arbete med Ledarskap-sessionen!"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>{txt.message} *</Label>
              <Textarea
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Skriv ditt meddelande till ledaren..."
                rows={4}
              />
            </div>

            {/* Include Statistics */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="include_stats"
                checked={feedbackForm.include_statistics}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, include_statistics: e.target.checked }))}
                className="w-4 h-4 rounded border-stone-300"
              />
              <Label htmlFor="include_stats">{txt.includeStats}</Label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)} className="flex-1">
              {txt.cancel}
            </Button>
            <Button onClick={sendFeedback} className="flex-1 bg-haggai hover:bg-haggai-dark text-white">
              <Send className="h-4 w-4 mr-2" />
              {txt.send}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvaluationResults;
