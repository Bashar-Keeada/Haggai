import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Edit2, Archive, Trash2, Save, X, Clock, MapPin, 
  Users, FileText, ChevronDown, ChevronUp, CheckCircle, AlertCircle,
  RefreshCw, ClipboardList, LogIn, LogOut, Lock, Bell, Send, Eye, EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BoardMeetings = ({ language, isRTL }) => {
  const [meetings, setMeetings] = useState([]);
  const [archivedMeetings, setArchivedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [expandedMeeting, setExpandedMeeting] = useState(null);
  
  // Auth states - simplified
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    attendees: [],
    agenda_items: []
  });

  const [newAgendaItem, setNewAgendaItem] = useState({ title: '', description: '', responsible: '' });
  const [newAttendee, setNewAttendee] = useState('');

  const txt = {
    sv: {
      title: 'Styrelsemöten',
      subtitle: 'Planera och dokumentera styrelsemöten',
      newMeeting: 'Nytt möte',
      upcomingMeetings: 'Kommande & Pågående Möten',
      archivedMeetings: 'Arkiverade Möten',
      showArchived: 'Visa arkiv',
      hideArchived: 'Dölj arkiv',
      noMeetings: 'Inga möten planerade',
      noArchivedMeetings: 'Inga arkiverade möten',
      createMeeting: 'Skapa nytt styrelsemöte',
      editMeeting: 'Redigera styrelsemöte',
      meetingTitle: 'Mötestitel',
      meetingTitlePlaceholder: 'T.ex. Styrelsemöte Q1 2026',
      date: 'Datum',
      time: 'Tid',
      location: 'Plats',
      locationPlaceholder: 'T.ex. Kontoret, Zoom',
      attendees: 'Deltagare',
      addAttendee: 'Lägg till deltagare',
      agenda: 'Dagordning',
      addAgendaItem: 'Lägg till punkt',
      agendaTitle: 'Punktens titel',
      agendaDescription: 'Beskrivning (valfritt)',
      responsible: 'Ansvarig (valfritt)',
      save: 'Spara',
      cancel: 'Avbryt',
      archive: 'Arkivera',
      delete: 'Radera',
      edit: 'Redigera',
      status: 'Status',
      scheduled: 'Planerat',
      in_progress: 'Pågår',
      completed: 'Avslutat',
      archived: 'Arkiverat',
      minutes: 'Mötesanteckningar',
      minutesPlaceholder: 'Skriv mötesanteckningar här...',
      confirmDelete: 'Är du säker på att du vill radera detta möte?',
      confirmArchive: 'Vill du arkivera detta möte?',
      itemStatus: {
        pending: 'Väntande',
        discussed: 'Diskuterat',
        decided: 'Beslut fattat',
        postponed: 'Uppskjutet'
      },
      decision: 'Beslut',
      notes: 'Anteckningar',
      // Auth translations
      login: 'Logga in',
      logout: 'Logga ut',
      loginTitle: 'Logga in som styrelsemedlem',
      loginSubtitle: 'Logga in för att redigera möten och se fullständig information',
      setupTitle: 'Skapa konto',
      setupSubtitle: 'Skapa ett lösenord för ditt styrelsemedlemskonto',
      email: 'E-postadress',
      password: 'Lösenord',
      confirmPassword: 'Bekräfta lösenord',
      noAccount: 'Inget konto? Skapa ett',
      hasAccount: 'Har du redan ett konto? Logga in',
      loginButton: 'Logga in',
      setupButton: 'Skapa konto',
      loggedInAs: 'Inloggad som',
      loginRequired: 'Logga in för att redigera',
      sendInvitation: 'Skicka kallelse',
      sendReminder: 'Skicka påminnelse',
      invitationSent: 'Kallelse skickad!',
      reminderSent: 'Påminnelse skickad!',
      passwordMismatch: 'Lösenorden matchar inte',
      emailNotFound: 'E-postadressen tillhör inte en styrelsemedlem',
      welcomeBack: 'Välkommen tillbaka',
      accountCreated: 'Konto skapat! Du kan nu logga in.'
    },
    en: {
      title: 'Board Meetings',
      subtitle: 'Plan and document board meetings',
      newMeeting: 'New meeting',
      upcomingMeetings: 'Upcoming & Ongoing Meetings',
      archivedMeetings: 'Archived Meetings',
      showArchived: 'Show archive',
      hideArchived: 'Hide archive',
      noMeetings: 'No meetings planned',
      noArchivedMeetings: 'No archived meetings',
      createMeeting: 'Create new board meeting',
      editMeeting: 'Edit board meeting',
      meetingTitle: 'Meeting title',
      meetingTitlePlaceholder: 'E.g. Board Meeting Q1 2026',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      locationPlaceholder: 'E.g. Office, Zoom',
      attendees: 'Attendees',
      addAttendee: 'Add attendee',
      agenda: 'Agenda',
      addAgendaItem: 'Add item',
      agendaTitle: 'Item title',
      agendaDescription: 'Description (optional)',
      responsible: 'Responsible (optional)',
      save: 'Save',
      cancel: 'Cancel',
      archive: 'Archive',
      delete: 'Delete',
      edit: 'Edit',
      status: 'Status',
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      archived: 'Archived',
      minutes: 'Meeting minutes',
      minutesPlaceholder: 'Write meeting minutes here...',
      confirmDelete: 'Are you sure you want to delete this meeting?',
      confirmArchive: 'Do you want to archive this meeting?',
      itemStatus: {
        pending: 'Pending',
        discussed: 'Discussed',
        decided: 'Decided',
        postponed: 'Postponed'
      },
      decision: 'Decision',
      notes: 'Notes',
      login: 'Log in',
      logout: 'Log out',
      loginTitle: 'Log in as board member',
      loginSubtitle: 'Log in to edit meetings and see full information',
      setupTitle: 'Create account',
      setupSubtitle: 'Create a password for your board member account',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      noAccount: 'No account? Create one',
      hasAccount: 'Already have an account? Log in',
      loginButton: 'Log in',
      setupButton: 'Create account',
      loggedInAs: 'Logged in as',
      loginRequired: 'Log in to edit',
      sendInvitation: 'Send invitation',
      sendReminder: 'Send reminder',
      invitationSent: 'Invitation sent!',
      reminderSent: 'Reminder sent!',
      passwordMismatch: 'Passwords do not match',
      emailNotFound: 'Email does not belong to a board member',
      welcomeBack: 'Welcome back',
      accountCreated: 'Account created! You can now log in.'
    },
    ar: {
      title: 'اجتماعات مجلس الإدارة',
      subtitle: 'التخطيط وتوثيق اجتماعات مجلس الإدارة',
      newMeeting: 'اجتماع جديد',
      upcomingMeetings: 'الاجتماعات القادمة والجارية',
      archivedMeetings: 'الاجتماعات المؤرشفة',
      showArchived: 'عرض الأرشيف',
      hideArchived: 'إخفاء الأرشيف',
      noMeetings: 'لا توجد اجتماعات مخططة',
      noArchivedMeetings: 'لا توجد اجتماعات مؤرشفة',
      createMeeting: 'إنشاء اجتماع جديد',
      editMeeting: 'تعديل الاجتماع',
      meetingTitle: 'عنوان الاجتماع',
      meetingTitlePlaceholder: 'مثال: اجتماع مجلس الإدارة الربع الأول 2026',
      date: 'التاريخ',
      time: 'الوقت',
      location: 'المكان',
      locationPlaceholder: 'مثال: المكتب، زوم',
      attendees: 'الحضور',
      addAttendee: 'إضافة حاضر',
      agenda: 'جدول الأعمال',
      addAgendaItem: 'إضافة بند',
      agendaTitle: 'عنوان البند',
      agendaDescription: 'الوصف (اختياري)',
      responsible: 'المسؤول (اختياري)',
      save: 'حفظ',
      cancel: 'إلغاء',
      archive: 'أرشفة',
      delete: 'حذف',
      edit: 'تعديل',
      status: 'الحالة',
      scheduled: 'مجدول',
      in_progress: 'جاري',
      completed: 'مكتمل',
      archived: 'مؤرشف',
      minutes: 'محضر الاجتماع',
      minutesPlaceholder: 'اكتب محضر الاجتماع هنا...',
      confirmDelete: 'هل أنت متأكد من حذف هذا الاجتماع؟',
      confirmArchive: 'هل تريد أرشفة هذا الاجتماع؟',
      itemStatus: {
        pending: 'معلق',
        discussed: 'تمت مناقشته',
        decided: 'تم اتخاذ قرار',
        postponed: 'مؤجل'
      },
      decision: 'القرار',
      notes: 'ملاحظات',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      loginTitle: 'تسجيل الدخول كعضو مجلس إدارة',
      loginSubtitle: 'سجل الدخول لتعديل الاجتماعات',
      setupTitle: 'إنشاء حساب',
      setupSubtitle: 'أنشئ كلمة مرور لحساب عضو مجلس الإدارة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      noAccount: 'ليس لديك حساب؟ أنشئ واحدًا',
      hasAccount: 'لديك حساب بالفعل؟ سجل الدخول',
      loginButton: 'تسجيل الدخول',
      setupButton: 'إنشاء حساب',
      loggedInAs: 'مسجل الدخول كـ',
      loginRequired: 'سجل الدخول للتعديل',
      sendInvitation: 'إرسال دعوة',
      sendReminder: 'إرسال تذكير',
      invitationSent: 'تم إرسال الدعوة!',
      reminderSent: 'تم إرسال التذكير!',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      emailNotFound: 'البريد الإلكتروني لا ينتمي لعضو مجلس إدارة',
      welcomeBack: 'مرحبًا بعودتك',
      accountCreated: 'تم إنشاء الحساب! يمكنك الآن تسجيل الدخول.'
    }
  }[language] || {};

  // Board members for attendee selection
  const [boardMembers, setBoardMembers] = useState([]);

  // Check for existing login on mount
  useEffect(() => {
    const token = localStorage.getItem('boardMemberToken');
    if (token === 'board_authenticated') {
      setIsLoggedIn(true);
      setCurrentMember({ name: 'Styrelsemedlem' });
    }
    fetchMeetings();
    fetchBoardMembers();
  }, []);

  const fetchBoardMembers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/board-members?current_only=true`);
      if (response.ok) {
        const data = await response.json();
        setBoardMembers(data);
      }
    } catch (error) {
      console.error('Error fetching board members:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const [activeRes, archivedRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/board-meetings`),
        fetch(`${BACKEND_URL}/api/board-meetings/archived`)
      ]);
      
      if (activeRes.ok) {
        const data = await activeRes.json();
        setMeetings(data);
      }
      if (archivedRes.ok) {
        const data = await archivedRes.json();
        setArchivedMeetings(data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    // Simple password check
    if (loginPassword === 'board2030!') {
      localStorage.setItem('boardMemberToken', 'board_authenticated');
      setIsLoggedIn(true);
      setCurrentMember({ name: 'Styrelsemedlem' });
      setShowLoginDialog(false);
      toast.success(txt.welcomeBack || 'Välkommen!');
      resetLoginForm();
    } else {
      toast.error(language === 'sv' ? 'Felaktigt lösenord' : 'Incorrect password');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('boardMemberToken');
    setIsLoggedIn(false);
    setCurrentMember(null);
    toast.info(language === 'sv' ? 'Du har loggat ut' : 'You have been logged out');
  };

  const resetLoginForm = () => {
    setLoginPassword('');
    setShowPassword(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      attendees: [],
      agenda_items: []
    });
    setNewAgendaItem({ title: '', description: '', responsible: '' });
    setNewAttendee('');
  };

  const openCreateDialog = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    resetForm();
    setEditingMeeting(null);
    setShowCreateDialog(true);
  };

  const openEditDialog = (meeting) => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    setFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time || '',
      location: meeting.location || '',
      attendees: meeting.attendees || [],
      agenda_items: meeting.agenda_items || [],
      minutes: meeting.minutes || '',
      status: meeting.status
    });
    setEditingMeeting(meeting);
    setShowCreateDialog(true);
  };

  const handleAddAttendee = () => {
    if (newAttendee.trim()) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee('');
    }
  };

  const handleRemoveAttendee = (index) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const handleAddAgendaItem = () => {
    if (newAgendaItem.title.trim()) {
      setFormData(prev => ({
        ...prev,
        agenda_items: [...prev.agenda_items, { 
          ...newAgendaItem, 
          id: Date.now().toString(),
          status: 'pending',
          notes: '',
          decision: ''
        }]
      }));
      setNewAgendaItem({ title: '', description: '', responsible: '' });
    }
  };

  const handleRemoveAgendaItem = (index) => {
    setFormData(prev => ({
      ...prev,
      agenda_items: prev.agenda_items.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateAgendaItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      agenda_items: prev.agenda_items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      toast.error(language === 'sv' ? 'Titel och datum krävs' : 'Title and date required');
      return;
    }

    try {
      const url = editingMeeting 
        ? `${BACKEND_URL}/api/board-meetings/${editingMeeting.id}`
        : `${BACKEND_URL}/api/board-meetings`;
      
      const response = await fetch(url, {
        method: editingMeeting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingMeeting 
          ? (language === 'sv' ? 'Möte uppdaterat' : 'Meeting updated')
          : (language === 'sv' ? 'Möte skapat - Kallelse skickas till styrelsen' : 'Meeting created - Invitation sent to board')
        );
        setShowCreateDialog(false);
        fetchMeetings();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Något gick fel' : 'Something went wrong');
    }
  };

  const handleArchive = async (meetingId) => {
    if (!window.confirm(txt.confirmArchive)) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/board-meetings/${meetingId}/archive`, {
        method: 'PUT'
      });
      if (response.ok) {
        toast.success(language === 'sv' ? 'Möte arkiverat' : 'Meeting archived');
        fetchMeetings();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte arkivera' : 'Could not archive');
    }
  };

  const handleDelete = async (meetingId) => {
    if (!window.confirm(txt.confirmDelete)) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/board-meetings/${meetingId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success(language === 'sv' ? 'Möte raderat' : 'Meeting deleted');
        fetchMeetings();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte radera' : 'Could not delete');
    }
  };

  const handleSendInvitation = async (meetingId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/board-meetings/${meetingId}/send-invitation`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(`${txt.invitationSent} (${data.sent_to} ${language === 'sv' ? 'mottagare' : 'recipients'})`);
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte skicka kallelse' : 'Could not send invitation');
    }
  };

  const handleSendReminder = async (meetingId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/board-meetings/${meetingId}/send-reminder?days_until=1`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(`${txt.reminderSent} (${data.sent_to} ${language === 'sv' ? 'mottagare' : 'recipients'})`);
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte skicka påminnelse' : 'Could not send reminder');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      archived: 'bg-stone-100 text-stone-600'
    };
    return (
      <Badge className={styles[status] || 'bg-stone-100'}>
        {txt[status] || status}
      </Badge>
    );
  };

  const getItemStatusBadge = (status) => {
    const styles = {
      pending: 'bg-stone-100 text-stone-600',
      discussed: 'bg-blue-100 text-blue-700',
      decided: 'bg-green-100 text-green-700',
      postponed: 'bg-orange-100 text-orange-700'
    };
    return (
      <Badge className={`text-xs ${styles[status] || 'bg-stone-100'}`}>
        {txt.itemStatus?.[status] || status}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(
      language === 'sv' ? 'sv-SE' : language === 'ar' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const MeetingCard = ({ meeting, isArchived = false }) => {
    const isExpanded = expandedMeeting === meeting.id;
    
    return (
      <Card className={`border-0 shadow-lg ${isArchived ? 'opacity-75' : ''}`}>
        <CardHeader 
          className={`cursor-pointer hover:bg-stone-50 transition-colors ${isRTL ? 'text-right' : ''}`}
          onClick={() => setExpandedMeeting(isExpanded ? null : meeting.id)}
        >
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-haggai rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{meeting.title}</CardTitle>
                <div className={`flex items-center gap-3 mt-1 text-sm text-stone-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(meeting.date)}
                  </span>
                  {meeting.time && (
                    <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="h-3 w-3" />
                      {meeting.time}
                    </span>
                  )}
                  {meeting.location && (
                    <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="h-3 w-3" />
                      {meeting.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {getStatusBadge(meeting.status)}
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 border-t">
            {/* Attendees */}
            {meeting.attendees?.length > 0 && (
              <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                <h4 className={`font-semibold text-stone-700 mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Users className="h-4 w-4" />
                  {txt.attendees}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {meeting.attendees.map((attendee, idx) => (
                    <Badge key={idx} variant="outline">{attendee}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda Items */}
            {meeting.agenda_items?.length > 0 && (
              <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                <h4 className={`font-semibold text-stone-700 mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <ClipboardList className="h-4 w-4" />
                  {txt.agenda}
                </h4>
                <div className="space-y-3">
                  {meeting.agenda_items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 rounded-lg">
                      <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <span className="font-medium text-stone-800">{idx + 1}. {item.title}</span>
                            {getItemStatusBadge(item.status)}
                          </div>
                          {item.description && (
                            <p className="text-sm text-stone-600 mt-1">{item.description}</p>
                          )}
                          {item.responsible && (
                            <p className="text-xs text-stone-500 mt-1">
                              {txt.responsible}: {item.responsible}
                            </p>
                          )}
                          {item.decision && (
                            <div className="mt-2 p-2 bg-green-50 rounded border-l-2 border-green-500">
                              <p className="text-sm font-medium text-green-800">{txt.decision}:</p>
                              <p className="text-sm text-green-700">{item.decision}</p>
                            </div>
                          )}
                          {item.notes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded">
                              <p className="text-xs text-blue-600">{txt.notes}: {item.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Minutes */}
            {meeting.minutes && (
              <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                <h4 className={`font-semibold text-stone-700 mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <FileText className="h-4 w-4" />
                  {txt.minutes}
                </h4>
                <div className="p-4 bg-stone-50 rounded-lg whitespace-pre-wrap text-sm text-stone-700">
                  {meeting.minutes}
                </div>
              </div>
            )}

            {/* Actions */}
            {!isArchived && (
              <div className={`flex flex-wrap gap-2 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                {isLoggedIn ? (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => openEditDialog(meeting)}
                      className="bg-haggai hover:bg-haggai-dark"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      {txt.edit}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendInvitation(meeting.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {txt.sendInvitation}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendReminder(meeting.id)}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      {txt.sendReminder}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleArchive(meeting.id)}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      {txt.archive}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(meeting.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowLoginDialog(true)}
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    {txt.loginRequired}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h2 className="text-xl font-bold text-stone-800">{txt.title}</h2>
          <p className="text-stone-600 text-sm">{txt.subtitle}</p>
        </div>
        
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isLoggedIn ? (
            <>
              <Badge className="bg-green-100 text-green-700 px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                {language === 'sv' ? 'Inloggad' : 'Logged in'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-stone-500 hover:text-stone-700">
                <LogOut className="h-4 w-4" />
              </Button>
              <Button onClick={openCreateDialog} className="bg-haggai hover:bg-haggai-dark text-sm">
                <Plus className="h-4 w-4 mr-1" />
                {txt.newMeeting}
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setShowLoginDialog(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                <LogIn className="h-4 w-4 mr-1" />
                {language === 'sv' ? 'Logga in för att redigera' : 'Login to edit'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Help text when not logged in */}
      {!isLoggedIn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium">
                {language === 'sv' ? 'Vill du skapa eller redigera möten?' : 'Want to create or edit meetings?'}
              </p>
              <p className="text-blue-600">
                {language === 'sv' 
                  ? 'Klicka på "Logga in för att redigera" och använd styrelselösenordet.' 
                  : 'Click "Login to edit" and use the board password.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Meetings */}
      <div>
        <h3 className={`text-lg font-semibold text-stone-700 mb-4 ${isRTL ? 'text-right' : ''}`}>
          {txt.upcomingMeetings}
        </h3>
        {meetings.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noMeetings}</p>
              <Button onClick={openCreateDialog} className="mt-4 bg-haggai hover:bg-haggai-dark">
                <Plus className="h-4 w-4 mr-2" />
                {txt.newMeeting}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {meetings.map(meeting => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </div>

      {/* Archived Meetings Toggle */}
      {archivedMeetings.length > 0 && (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setShowArchived(!showArchived)}
            className="mb-4"
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? txt.hideArchived : txt.showArchived} ({archivedMeetings.length})
          </Button>
          
          {showArchived && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-stone-700 ${isRTL ? 'text-right' : ''}`}>
                {txt.archivedMeetings}
              </h3>
              {archivedMeetings.map(meeting => (
                <MeetingCard key={meeting.id} meeting={meeting} isArchived />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Login Dialog - Simple password */}
      <Dialog open={showLoginDialog} onOpenChange={(open) => { setShowLoginDialog(open); if (!open) resetLoginForm(); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-haggai" />
              {language === 'sv' ? 'Styrelseinloggning' : 'Board Login'}
            </DialogTitle>
            <DialogDescription>
              {language === 'sv' 
                ? 'Ange styrelselösenordet för att redigera möten' 
                : 'Enter the board password to edit meetings'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="password">{txt.password || 'Lösenord'}</Label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 ${isRTL ? 'left-3' : 'right-3'}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-haggai hover:bg-haggai-dark" disabled={authLoading}>
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              {language === 'sv' ? 'Logga in' : 'Log in'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle>
              {editingMeeting ? txt.editMeeting : txt.createMeeting}
            </DialogTitle>
          </DialogHeader>

          <div className={`space-y-6 mt-4 ${isRTL ? 'text-right' : ''}`}>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>{txt.meetingTitle} *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={txt.meetingTitlePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.date} *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{txt.time}</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>{txt.location}</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={txt.locationPlaceholder}
                />
              </div>
            </div>

            {/* Status (only when editing) */}
            {editingMeeting && (
              <div className="space-y-2">
                <Label>{txt.status}</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="scheduled">{txt.scheduled}</option>
                  <option value="in_progress">{txt.in_progress}</option>
                  <option value="completed">{txt.completed}</option>
                </select>
              </div>
            )}

            {/* Attendees - Select from board members */}
            <div className="space-y-2">
              <Label>{txt.attendees}</Label>
              
              {/* Board members checkboxes */}
              {boardMembers.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-stone-50 rounded-lg">
                  {boardMembers.map((member) => {
                    const isSelected = formData.attendees.includes(member.name);
                    return (
                      <label 
                        key={member.id || member.name} 
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-haggai text-white' : 'bg-white hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                attendees: [...prev.attendees, member.name]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                attendees: prev.attendees.filter(a => a !== member.name)
                              }));
                            }
                          }}
                          className="sr-only"
                        />
                        <User className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-stone-400'}`} />
                        <span className="text-sm font-medium">{member.name}</span>
                        {member.role && (
                          <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-stone-400'}`}>
                            ({member.role})
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Manual add */}
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder={language === 'sv' ? 'Lägg till annan deltagare...' : 'Add other attendee...'}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttendee())}
                />
                <Button type="button" onClick={handleAddAttendee} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected attendees (for manually added ones) */}
              {formData.attendees.filter(a => !boardMembers.find(m => m.name === a)).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.attendees.filter(a => !boardMembers.find(m => m.name === a)).map((attendee, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                      {attendee}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          attendees: prev.attendees.filter(a => a !== attendee)
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Agenda Items */}
            <div className="space-y-3">
              <Label>{txt.agenda}</Label>
              <div className="space-y-2 p-4 bg-stone-50 rounded-lg">
                <Input
                  value={newAgendaItem.title}
                  onChange={(e) => setNewAgendaItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={txt.agendaTitle}
                />
                <Input
                  value={newAgendaItem.description}
                  onChange={(e) => setNewAgendaItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={txt.agendaDescription}
                />
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Input
                    value={newAgendaItem.responsible}
                    onChange={(e) => setNewAgendaItem(prev => ({ ...prev, responsible: e.target.value }))}
                    placeholder={txt.responsible}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddAgendaItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    {txt.addAgendaItem}
                  </Button>
                </div>
              </div>
              
              {formData.agenda_items.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.agenda_items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white border rounded-lg">
                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <p className="font-medium">{idx + 1}. {item.title}</p>
                          {item.description && <p className="text-sm text-stone-500">{item.description}</p>}
                          {item.responsible && <p className="text-xs text-stone-400">{txt.responsible}: {item.responsible}</p>}
                        </div>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {editingMeeting && (
                            <select
                              value={item.status}
                              onChange={(e) => handleUpdateAgendaItem(idx, 'status', e.target.value)}
                              className="text-xs p-1 border rounded"
                            >
                              <option value="pending">{txt.itemStatus?.pending}</option>
                              <option value="discussed">{txt.itemStatus?.discussed}</option>
                              <option value="decided">{txt.itemStatus?.decided}</option>
                              <option value="postponed">{txt.itemStatus?.postponed}</option>
                            </select>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveAgendaItem(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {editingMeeting && (
                        <div className="mt-2 space-y-2">
                          <Input
                            placeholder={txt.decision}
                            value={item.decision || ''}
                            onChange={(e) => handleUpdateAgendaItem(idx, 'decision', e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder={txt.notes}
                            value={item.notes || ''}
                            onChange={(e) => handleUpdateAgendaItem(idx, 'notes', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting Minutes (only when editing) */}
            {editingMeeting && (
              <div className="space-y-2">
                <Label>{txt.minutes}</Label>
                <Textarea
                  value={formData.minutes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, minutes: e.target.value }))}
                  placeholder={txt.minutesPlaceholder}
                  rows={6}
                />
              </div>
            )}

            {/* Actions */}
            <div className={`flex gap-3 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
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
    </div>
  );
};

export default BoardMeetings;
