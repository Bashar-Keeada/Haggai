import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Save, Trash2, Clock, User, Coffee, 
  Calendar, Send, Eye, GripVertical, ChevronDown, ChevronUp,
  Bell, CheckCircle2
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

const AdminWorkshopAgenda = () => {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  
  const [workshop, setWorkshop] = useState(null);
  const [agenda, setAgenda] = useState({ days: [], is_published: false });
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);

  const [sessionForm, setSessionForm] = useState({
    start_time: '09:00',
    end_time: '10:00',
    title: '',
    title_en: '',
    title_ar: '',
    description: '',
    leader_id: '',
    session_type: 'session'
  });

  const txt = {
    sv: {
      title: 'Agenda / Program',
      back: 'Tillbaka till Workshops',
      addDay: 'Lägg till dag',
      removeDay: 'Ta bort dag',
      addSession: 'Lägg till session',
      editSession: 'Redigera session',
      save: 'Spara agenda',
      saving: 'Sparar...',
      publish: 'Publicera & meddela deltagare',
      unpublish: 'Avpublicera',
      preview: 'Förhandsgranska',
      sendReminder: 'Skicka påminnelse',
      published: 'Publicerad',
      draft: 'Utkast',
      day: 'Dag',
      date: 'Datum',
      dayTitle: 'Dagstitel (valfritt)',
      sessionTitle: 'Sessionstitel',
      sessionTitleEn: 'Titel (engelska)',
      sessionTitleAr: 'Titel (arabiska)',
      description: 'Beskrivning',
      startTime: 'Starttid',
      endTime: 'Sluttid',
      leader: 'Ledare/Talare',
      selectLeader: 'Välj ledare...',
      noLeader: 'Ingen ledare tilldelad',
      sessionType: 'Typ',
      typeSession: 'Session',
      typeBreak: 'Paus',
      typeLunch: 'Lunch',
      typeRegistration: 'Registrering',
      typeOther: 'Övrigt',
      cancel: 'Avbryt',
      saveSession: 'Spara session',
      deleteSession: 'Ta bort',
      noSessions: 'Inga sessioner tillagda ännu',
      confirmDelete: 'Är du säker?',
      agendaSaved: 'Agenda sparad!',
      agendaPublished: 'Agenda publicerad! Deltagare har meddelats.',
      reminderSent: 'Påminnelse skickad!',
      workshopInfo: 'Workshop-information',
      noWorkshop: 'Workshop hittades inte'
    },
    en: {
      title: 'Agenda / Program',
      back: 'Back to Workshops',
      addDay: 'Add day',
      removeDay: 'Remove day',
      addSession: 'Add session',
      editSession: 'Edit session',
      save: 'Save agenda',
      saving: 'Saving...',
      publish: 'Publish & notify participants',
      unpublish: 'Unpublish',
      preview: 'Preview',
      sendReminder: 'Send reminder',
      published: 'Published',
      draft: 'Draft',
      day: 'Day',
      date: 'Date',
      dayTitle: 'Day title (optional)',
      sessionTitle: 'Session title',
      sessionTitleEn: 'Title (English)',
      sessionTitleAr: 'Title (Arabic)',
      description: 'Description',
      startTime: 'Start time',
      endTime: 'End time',
      leader: 'Leader/Speaker',
      selectLeader: 'Select leader...',
      noLeader: 'No leader assigned',
      sessionType: 'Type',
      typeSession: 'Session',
      typeBreak: 'Break',
      typeLunch: 'Lunch',
      typeRegistration: 'Registration',
      typeOther: 'Other',
      cancel: 'Cancel',
      saveSession: 'Save session',
      deleteSession: 'Delete',
      noSessions: 'No sessions added yet',
      confirmDelete: 'Are you sure?',
      agendaSaved: 'Agenda saved!',
      agendaPublished: 'Agenda published! Participants have been notified.',
      reminderSent: 'Reminder sent!',
      workshopInfo: 'Workshop information',
      noWorkshop: 'Workshop not found'
    }
  }[language] || {};

  useEffect(() => {
    fetchData();
  }, [workshopId]);

  // Helper function to get localized text from multilingual objects
  const getLocalizedText = (text) => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      return text[language] || text.sv || text.en || Object.values(text)[0] || '';
    }
    return String(text);
  };

  const fetchData = async () => {
    try {
      // Fetch workshop, agenda and leaders in parallel
      const [workshopRes, agendaRes, leadersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/workshops/${workshopId}`),
        fetch(`${BACKEND_URL}/api/workshops/${workshopId}/agenda`),
        fetch(`${BACKEND_URL}/api/leaders`)
      ]);

      if (workshopRes.ok) {
        const workshopData = await workshopRes.json();
        setWorkshop(workshopData);
      }

      if (agendaRes.ok) {
        const agendaData = await agendaRes.json();
        setAgenda(agendaData);
        // Expand all days by default
        const expanded = {};
        (agendaData.days || []).forEach((_, idx) => { expanded[idx] = true; });
        setExpandedDays(expanded);
      }

      if (leadersRes.ok) {
        const leadersData = await leadersRes.json();
        setLeaders(leadersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Kunde inte ladda data');
    } finally {
      setLoading(false);
    }
  };

  const addDay = () => {
    const newDayNumber = agenda.days.length + 1;
    // Calculate date based on workshop start date
    let newDate = '';
    if (workshop?.date) {
      const startDate = new Date(workshop.date);
      startDate.setDate(startDate.getDate() + agenda.days.length);
      newDate = startDate.toISOString().split('T')[0];
    }

    const newDay = {
      id: `temp-${Date.now()}`,
      date: newDate,
      day_number: newDayNumber,
      title: '',
      sessions: []
    };

    setAgenda(prev => ({
      ...prev,
      days: [...prev.days, newDay]
    }));
    setExpandedDays(prev => ({ ...prev, [agenda.days.length]: true }));
  };

  const removeDay = (dayIndex) => {
    if (!window.confirm(txt.confirmDelete)) return;
    
    setAgenda(prev => ({
      ...prev,
      days: prev.days.filter((_, idx) => idx !== dayIndex).map((day, idx) => ({
        ...day,
        day_number: idx + 1
      }))
    }));
  };

  const updateDay = (dayIndex, field, value) => {
    setAgenda(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => 
        idx === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const openAddSessionDialog = (dayIndex) => {
    setCurrentDayIndex(dayIndex);
    setEditingSession(null);
    setEditingSessionIndex(null);
    
    // Calculate default times based on last session
    const day = agenda.days[dayIndex];
    let startTime = '09:00';
    let endTime = '10:00';
    
    if (day.sessions.length > 0) {
      const lastSession = day.sessions[day.sessions.length - 1];
      startTime = lastSession.end_time;
      const [hours, mins] = startTime.split(':').map(Number);
      const endHours = hours + 1;
      endTime = `${String(endHours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    setSessionForm({
      start_time: startTime,
      end_time: endTime,
      title: '',
      title_en: '',
      title_ar: '',
      description: '',
      leader_id: '',
      session_type: 'session'
    });
    setShowSessionDialog(true);
  };

  const openEditSessionDialog = (dayIndex, sessionIndex, session) => {
    setCurrentDayIndex(dayIndex);
    setEditingSession(session);
    setEditingSessionIndex(sessionIndex);
    setSessionForm({
      start_time: session.start_time || '09:00',
      end_time: session.end_time || '10:00',
      title: session.title || '',
      title_en: session.title_en || '',
      title_ar: session.title_ar || '',
      description: session.description || '',
      leader_id: session.leader_id || '',
      session_type: session.session_type || 'session'
    });
    setShowSessionDialog(true);
  };

  const saveSession = () => {
    if (!sessionForm.title && sessionForm.session_type === 'session') {
      toast.error('Ange en titel för sessionen');
      return;
    }

    const leader = leaders.find(l => l.id === sessionForm.leader_id);
    const newSession = {
      ...sessionForm,
      id: editingSession?.id || `temp-${Date.now()}`,
      leader_name: leader?.name || null,
      order: editingSessionIndex ?? agenda.days[currentDayIndex].sessions.length
    };

    // Auto-fill title for breaks/lunch
    if (sessionForm.session_type === 'break' && !sessionForm.title) {
      newSession.title = 'Paus';
    } else if (sessionForm.session_type === 'lunch' && !sessionForm.title) {
      newSession.title = 'Lunch';
    }

    setAgenda(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => {
        if (idx !== currentDayIndex) return day;
        
        let newSessions;
        if (editingSessionIndex !== null) {
          newSessions = day.sessions.map((s, sIdx) => 
            sIdx === editingSessionIndex ? newSession : s
          );
        } else {
          newSessions = [...day.sessions, newSession];
        }
        
        // Sort by start time
        newSessions.sort((a, b) => a.start_time.localeCompare(b.start_time));
        
        return { ...day, sessions: newSessions };
      })
    }));

    setShowSessionDialog(false);
  };

  const deleteSession = (dayIndex, sessionIndex) => {
    setAgenda(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => 
        idx === dayIndex 
          ? { ...day, sessions: day.sessions.filter((_, sIdx) => sIdx !== sessionIndex) }
          : day
      )
    }));
  };

  const saveAgenda = async () => {
    setSaving(true);
    try {
      const payload = {
        workshop_id: workshopId,
        days: agenda.days.map(day => ({
          date: day.date,
          day_number: day.day_number,
          title: day.title,
          sessions: day.sessions.map(session => ({
            start_time: session.start_time,
            end_time: session.end_time,
            title: session.title,
            title_en: session.title_en,
            title_ar: session.title_ar,
            description: session.description,
            leader_id: session.leader_id || null,
            session_type: session.session_type,
            order: session.order || 0
          }))
        })),
        is_published: agenda.is_published,
        notify_participants: false
      };

      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/agenda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedAgenda = await response.json();
        setAgenda(savedAgenda);
        toast.success(txt.agendaSaved);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving agenda:', error);
      toast.error('Kunde inte spara agenda');
    } finally {
      setSaving(false);
    }
  };

  const publishAgenda = async () => {
    setSaving(true);
    try {
      // First save the agenda
      const payload = {
        workshop_id: workshopId,
        days: agenda.days.map(day => ({
          date: day.date,
          day_number: day.day_number,
          title: day.title,
          sessions: day.sessions.map(session => ({
            start_time: session.start_time,
            end_time: session.end_time,
            title: session.title,
            title_en: session.title_en,
            title_ar: session.title_ar,
            description: session.description,
            leader_id: session.leader_id || null,
            session_type: session.session_type,
            order: session.order || 0
          }))
        })),
        is_published: true,
        notify_participants: true
      };

      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/agenda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedAgenda = await response.json();
        setAgenda(savedAgenda);
        toast.success(txt.agendaPublished);
      } else {
        throw new Error('Failed to publish');
      }
    } catch (error) {
      console.error('Error publishing agenda:', error);
      toast.error('Kunde inte publicera agenda');
    } finally {
      setSaving(false);
    }
  };

  const sendReminder = async (dayNumber) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/workshops/${workshopId}/agenda/send-reminder?day_number=${dayNumber}`,
        { method: 'POST' }
      );

      if (response.ok) {
        toast.success(txt.reminderSent);
      } else {
        throw new Error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Kunde inte skicka påminnelse');
    }
  };

  const toggleDay = (dayIndex) => {
    setExpandedDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'break': return <Coffee className="h-4 w-4 text-amber-600" />;
      case 'lunch': return <Coffee className="h-4 w-4 text-orange-600" />;
      case 'registration': return <User className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-haggai" />;
    }
  };

  const getSessionTypeBadge = (type) => {
    const styles = {
      session: 'bg-haggai-100 text-haggai-dark',
      break: 'bg-amber-100 text-amber-800',
      lunch: 'bg-orange-100 text-orange-800',
      registration: 'bg-blue-100 text-blue-800',
      other: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      session: txt.typeSession,
      break: txt.typeBreak,
      lunch: txt.typeLunch,
      registration: txt.typeRegistration,
      other: txt.typeOther
    };
    return <Badge className={styles[type] || styles.other}>{labels[type] || type}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-cream-50 p-8">
        <p className="text-center text-stone-500">{txt.noWorkshop}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/admin/workshops" 
            className="inline-flex items-center text-haggai hover:text-haggai-dark mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {txt.back}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-8 w-8 text-haggai" />
                <h1 className="text-2xl font-bold text-stone-800">{txt.title}</h1>
                {agenda.is_published ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {txt.published}
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">{txt.draft}</Badge>
                )}
              </div>
              <p className="text-lg text-stone-600">{workshop.title}</p>
              {workshop.date && (
                <p className="text-sm text-stone-500">
                  {workshop.date} {workshop.end_date && `- ${workshop.end_date}`} | {workshop.location}
                </p>
              )}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => window.open(`/program/${workshopId}`, '_blank')}
                disabled={!agenda.is_published}
              >
                <Eye className="h-4 w-4 mr-2" />
                {txt.preview}
              </Button>
              <Button
                onClick={saveAgenda}
                disabled={saving}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? txt.saving : txt.save}
              </Button>
              <Button
                onClick={publishAgenda}
                disabled={saving || agenda.days.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {txt.publish}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Day Button */}
        <Button onClick={addDay} className="mb-6 bg-haggai hover:bg-haggai-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          {txt.addDay}
        </Button>

        {/* Days */}
        <div className="space-y-6">
          {agenda.days.map((day, dayIndex) => (
            <Card key={day.id || dayIndex} className="border-0 shadow-lg overflow-hidden">
              {/* Day Header */}
              <div 
                className="bg-haggai text-white p-4 cursor-pointer flex items-center justify-between"
                onClick={() => toggleDay(dayIndex)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">{txt.day} {day.day_number}</span>
                  <Input
                    type="date"
                    value={day.date || ''}
                    onChange={(e) => updateDay(dayIndex, 'date', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-40 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                  <Input
                    value={day.title || ''}
                    onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={txt.dayTitle}
                    className="w-48 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {agenda.is_published && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={(e) => { e.stopPropagation(); sendReminder(day.day_number); }}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      {txt.sendReminder}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => { e.stopPropagation(); removeDay(dayIndex); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedDays[dayIndex] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>

              {/* Day Content (Sessions) */}
              {expandedDays[dayIndex] && (
                <CardContent className="p-4">
                  {day.sessions.length === 0 ? (
                    <p className="text-center text-stone-400 py-8">{txt.noSessions}</p>
                  ) : (
                    <div className="space-y-2">
                      {day.sessions.map((session, sessionIndex) => (
                        <div 
                          key={session.id || sessionIndex}
                          className={`flex items-center gap-4 p-3 rounded-lg border ${
                            session.session_type === 'break' || session.session_type === 'lunch'
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-white border-stone-200 hover:border-haggai'
                          } cursor-pointer transition-colors`}
                          onClick={() => openEditSessionDialog(dayIndex, sessionIndex, session)}
                        >
                          <div className="flex items-center gap-2 min-w-[100px]">
                            {getSessionTypeIcon(session.session_type)}
                            <span className="font-mono text-sm font-medium">
                              {session.start_time}-{session.end_time}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium text-stone-800">{session.title}</p>
                            {session.leader_name && (
                              <p className="text-sm text-stone-500">
                                <User className="h-3 w-3 inline mr-1" />
                                {session.leader_name}
                              </p>
                            )}
                          </div>
                          
                          {getSessionTypeBadge(session.session_type)}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => { e.stopPropagation(); deleteSession(dayIndex, sessionIndex); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => openAddSessionDialog(dayIndex)}
                    variant="outline"
                    className="mt-4 w-full border-dashed border-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {txt.addSession}
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {agenda.days.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">Inga dagar tillagda ännu. Klicka på "Lägg till dag" för att börja.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Session Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSession ? txt.editSession : txt.addSession}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{txt.startTime}</Label>
                <Input
                  type="time"
                  value={sessionForm.start_time}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.endTime}</Label>
                <Input
                  type="time"
                  value={sessionForm.end_time}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <Label>{txt.sessionType}</Label>
              <select
                value={sessionForm.session_type}
                onChange={(e) => setSessionForm(prev => ({ ...prev, session_type: e.target.value }))}
                className="w-full rounded-lg border border-stone-300 p-2"
              >
                <option value="session">{txt.typeSession}</option>
                <option value="break">{txt.typeBreak}</option>
                <option value="lunch">{txt.typeLunch}</option>
                <option value="registration">{txt.typeRegistration}</option>
                <option value="other">{txt.typeOther}</option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>{txt.sessionTitle} *</Label>
              <Input
                value={sessionForm.title}
                onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder={sessionForm.session_type === 'break' ? 'Paus' : sessionForm.session_type === 'lunch' ? 'Lunch' : ''}
              />
            </div>

            {/* Leader (only for sessions) */}
            {sessionForm.session_type === 'session' && (
              <div className="space-y-2">
                <Label>{txt.leader}</Label>
                <select
                  value={sessionForm.leader_id}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, leader_id: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 p-2"
                >
                  <option value="">{txt.selectLeader}</option>
                  {leaders.map(leader => (
                    <option key={leader.id} value={leader.id}>{leader.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label>{txt.description}</Label>
              <Textarea
                value={sessionForm.description}
                onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowSessionDialog(false)} className="flex-1">
              {txt.cancel}
            </Button>
            <Button onClick={saveSession} className="flex-1 bg-haggai hover:bg-haggai-dark text-white">
              {txt.saveSession}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkshopAgenda;
