import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { 
  ArrowLeft, Users, Mail, Send, Calendar, Clock, CheckCircle, 
  XCircle, User, Award, Bell, FileText, Download, Search,
  ChevronDown, ChevronUp, Filter
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminWorkshopParticipants = () => {
  const { workshopId } = useParams();
  const navigate = useNavigate();
  
  const [workshop, setWorkshop] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [agenda, setAgenda] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [sending, setSending] = useState(false);
  
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    include_agenda: false,
    include_badge_link: false,
    filter_status: 'approved'
  });

  useEffect(() => {
    fetchData();
  }, [workshopId]);

  const fetchData = async () => {
    try {
      const [workshopRes, participantsRes, agendaRes, statsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/workshops/${workshopId}`),
        fetch(`${BACKEND_URL}/api/workshops/${workshopId}/participants`),
        fetch(`${BACKEND_URL}/api/workshops/${workshopId}/agenda`),
        fetch(`${BACKEND_URL}/api/workshops/${workshopId}/participants/stats`)
      ]);

      if (workshopRes.ok) {
        const data = await workshopRes.json();
        setWorkshop(data);
      }

      if (participantsRes.ok) {
        const data = await participantsRes.json();
        setParticipants(data);
      }

      if (agendaRes.ok) {
        const data = await agendaRes.json();
        setAgenda(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendGroupEmail = async () => {
    if (!emailData.subject || !emailData.message) {
      toast.error('Fyll i ämne och meddelande');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/send-group-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`E-post skickad till ${result.sent_count} deltagare`);
        setShowEmailDialog(false);
        setEmailData({ subject: '', message: '', include_agenda: false, include_badge_link: false, filter_status: 'approved' });
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Kunde inte skicka e-post');
    } finally {
      setSending(false);
    }
  };

  const handleSendReminder = async () => {
    setSending(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/send-reminder?days_before=1`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Påminnelse skickad till ${result.sent_count} deltagare`);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Kunde inte skicka påminnelse');
    } finally {
      setSending(false);
    }
  };

  const openAttendanceDialog = async (session) => {
    setSelectedSession(session);
    
    // Fetch current attendance
    try {
      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/sessions/${session.id}/attendance`);
      if (response.ok) {
        const data = await response.json();
        const attendanceMap = {};
        data.forEach(p => {
          attendanceMap[p.participant_id] = p.present;
        });
        setAttendanceData(attendanceMap);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
    
    setShowAttendanceDialog(true);
  };

  const handleSaveAttendance = async () => {
    if (!selectedSession) return;

    setSending(true);
    try {
      const presentIds = Object.entries(attendanceData)
        .filter(([_, present]) => present)
        .map(([id]) => id);

      const response = await fetch(`${BACKEND_URL}/api/workshops/${workshopId}/sessions/${selectedSession.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_ids: presentIds,
          session_id: selectedSession.id,
          present: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Närvaro sparad. ${result.certificates_generated} nya certifikat!`);
        fetchData(); // Refresh data
        setShowAttendanceDialog(false);
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      toast.error('Kunde inte spara närvaro');
    } finally {
      setSending(false);
    }
  };

  const getWorkshopTitle = () => {
    if (!workshop) return '';
    const title = workshop.title;
    return typeof title === 'object' ? (title.sv || title.ar || title.en || '') : title;
  };

  const filteredParticipants = participants.filter(p => {
    const name = p.registration_data?.full_name || p.nominee_name || '';
    const email = p.registration_data?.email || p.nominee_email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_approval: { label: 'Väntar godkännande', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Godkänd', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Avvisad', color: 'bg-red-100 text-red-800' },
      completed: { label: 'Slutförd (21h)', color: 'bg-blue-100 text-blue-800' }
    };
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/workshops" className="text-haggai hover:text-haggai-dark">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-stone-800">{getWorkshopTitle()}</h1>
                <p className="text-sm text-stone-500">Deltagarhantering</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleSendReminder}
                disabled={sending}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Bell className="h-4 w-4 mr-2" />
                Skicka påminnelse
              </Button>
              <Button 
                onClick={() => setShowEmailDialog(true)}
                className="bg-haggai hover:bg-haggai-dark"
              >
                <Mail className="h-4 w-4 mr-2" />
                Skicka e-post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-stone-800">{stats.total}</p>
                <p className="text-sm text-stone-500">Totalt</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.pending_approval}</p>
                <p className="text-sm text-stone-500">Väntar</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-stone-500">Godkända</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
                <p className="text-sm text-stone-500">Slutförda</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-amber-700">{stats.with_certificate}</p>
                <p className="text-sm text-amber-600">Certifikat</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Participants List */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-haggai" />
                    Deltagare ({filteredParticipants.length})
                  </CardTitle>
                </div>
                
                {/* Filters */}
                <div className="flex gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                      placeholder="Sök namn eller e-post..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="all">Alla status</option>
                    <option value="pending_approval">Väntar godkännande</option>
                    <option value="approved">Godkända</option>
                    <option value="completed">Slutförda</option>
                  </select>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {filteredParticipants.map((p) => (
                    <div key={p.id} className="p-4 hover:bg-stone-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {p.registration_data?.profile_image ? (
                            <img 
                              src={p.registration_data.profile_image} 
                              alt="" 
                              className="w-12 h-12 rounded-full object-cover border-2 border-stone-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-haggai flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-stone-800">
                              {p.registration_data?.full_name || p.nominee_name}
                            </p>
                            <p className="text-sm text-stone-500">
                              {p.registration_data?.email || p.nominee_email}
                            </p>
                            {p.recommended_by && (
                              <p className="text-xs text-stone-400 mt-1">
                                Rekommenderad av: {p.recommended_by}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {getStatusBadge(p.status)}
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-stone-400" />
                            <span className={p.attendance_hours >= 21 ? 'text-green-600 font-semibold' : 'text-stone-600'}>
                              {p.attendance_hours || 0}h / 21h
                            </span>
                            {p.attendance_hours >= 21 && (
                              <Award className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          {p.account_activated && (
                            <p className="text-xs text-green-600 mt-1 flex items-center justify-end gap-1">
                              <CheckCircle className="h-3 w-3" /> Konto aktiverat
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredParticipants.length === 0 && (
                    <div className="p-12 text-center text-stone-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-stone-300" />
                      <p>Inga deltagare hittades</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions / Attendance */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-haggai" />
                  Närvarospårning
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {agenda && agenda.days ? (
                  <div className="divide-y">
                    {agenda.days.map((day) => (
                      <div key={day.day_number} className="p-4">
                        <p className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-haggai" />
                          Dag {day.day_number} - {day.date}
                        </p>
                        <div className="space-y-2">
                          {day.sessions
                            .filter(s => s.session_type === 'session')
                            .map((session) => (
                            <button
                              key={session.id}
                              onClick={() => openAttendanceDialog(session)}
                              className="w-full text-left p-3 bg-stone-50 rounded-lg hover:bg-haggai-50 transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-stone-800 group-hover:text-haggai text-sm">
                                    {session.title}
                                  </p>
                                  <p className="text-xs text-stone-500">
                                    {session.start_time} - {session.end_time}
                                  </p>
                                </div>
                                <CheckCircle className="h-4 w-4 text-stone-300 group-hover:text-haggai" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-stone-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-stone-300" />
                    <p className="text-sm">Inget program publicerat</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-haggai" />
              Skicka e-post till deltagare
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Skicka till</Label>
              <select
                value={emailData.filter_status}
                onChange={(e) => setEmailData(prev => ({ ...prev, filter_status: e.target.value }))}
                className="w-full mt-1 p-2 border rounded-lg"
              >
                <option value="all">Alla registrerade</option>
                <option value="approved">Endast godkända</option>
                <option value="pending_approval">Endast väntande</option>
                <option value="completed">Endast slutförda</option>
              </select>
            </div>
            
            <div>
              <Label>Ämne</Label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="T.ex. Viktig information om workshopen"
              />
            </div>
            
            <div>
              <Label>Meddelande</Label>
              <Textarea
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Skriv ditt meddelande här..."
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include_agenda"
                  checked={emailData.include_agenda}
                  onCheckedChange={(checked) => setEmailData(prev => ({ ...prev, include_agenda: checked }))}
                />
                <Label htmlFor="include_agenda" className="text-sm cursor-pointer">
                  Inkludera programmet i e-posten
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include_badge"
                  checked={emailData.include_badge_link}
                  onCheckedChange={(checked) => setEmailData(prev => ({ ...prev, include_badge_link: checked }))}
                />
                <Label htmlFor="include_badge" className="text-sm cursor-pointer">
                  Inkludera länk till namnskylt
                </Label>
              </div>
            </div>
            
            <Button
              onClick={handleSendGroupEmail}
              disabled={sending || !emailData.subject || !emailData.message}
              className="w-full bg-haggai hover:bg-haggai-dark"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Skickar...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Skicka e-post
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-haggai" />
              Närvaro: {selectedSession?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-stone-500 mb-4">
              {selectedSession?.start_time} - {selectedSession?.end_time}
            </p>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {participants
                .filter(p => p.status === 'approved' || p.status === 'completed')
                .map((p) => (
                <div 
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    attendanceData[p.id] ? 'bg-green-50 border-green-200' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={attendanceData[p.id] || false}
                      onCheckedChange={(checked) => {
                        setAttendanceData(prev => ({ ...prev, [p.id]: checked }));
                      }}
                    />
                    <div>
                      <p className="font-medium text-stone-800">
                        {p.registration_data?.full_name || p.nominee_name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {p.attendance_hours || 0}h totalt
                      </p>
                    </div>
                  </div>
                  {attendanceData[p.id] && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
            
            <Button
              onClick={handleSaveAttendance}
              disabled={sending}
              className="w-full mt-4 bg-haggai hover:bg-haggai-dark"
            >
              {sending ? 'Sparar...' : 'Spara närvaro'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkshopParticipants;
