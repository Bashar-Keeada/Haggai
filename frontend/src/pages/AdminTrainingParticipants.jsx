import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserCheck, UserX, Clock, GraduationCap, Mail, Eye, Check, X, Download, Send, Calendar, MapPin, Phone, Briefcase, Church, FileText, Award, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminTrainingParticipants = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showDiplomaDialog, setShowDiplomaDialog] = useState(false);
  const [attendanceHours, setAttendanceHours] = useState(0);
  const [sendingDiploma, setSendingDiploma] = useState(false);
  const [generatingDiploma, setGeneratingDiploma] = useState(false);
  const [diplomaPreviewUrl, setDiplomaPreviewUrl] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected, completed

  const translations = {
    sv: {
      title: 'Utbildningsdeltagare',
      subtitle: 'Hantera registreringar, närvaro och diplom',
      back: 'Tillbaka till Admin',
      totalRegistered: 'Totalt registrerade',
      accepted: 'Accepterade',
      rejected: 'Avslagna',
      completed: 'Godkända',
      pending: 'Väntande',
      filterAll: 'Alla',
      filterPending: 'Väntande',
      filterAccepted: 'Accepterade',
      filterRejected: 'Avslagna',
      filterCompleted: 'Godkända',
      noParticipants: 'Inga deltagare hittades',
      viewDetails: 'Visa detaljer',
      accept: 'Acceptera',
      reject: 'Avslå',
      attendance: 'Närvaro',
      generateDiploma: 'Generera diplom',
      sendDiploma: 'Skicka diplom',
      hours: 'timmar',
      of21Hours: 'av 21 timmar',
      registrationDetails: 'Registreringsdetaljer',
      personalInfo: 'Personuppgifter',
      workInfo: 'Arbetsinformation',
      churchInfo: 'Kyrkoinformation',
      commitments: 'Åtaganden',
      attendanceTitle: 'Närvaroregistrering',
      attendanceDesc: 'Ange antal timmar deltagaren har närvarat',
      save: 'Spara',
      cancel: 'Avbryt',
      diplomaTitle: 'Diplom',
      diplomaDesc: 'Generera och skicka diplom till deltagaren',
      preview: 'Förhandsgranska',
      download: 'Ladda ner PDF',
      sendEmail: 'Skicka via e-post',
      diplomaSent: 'Diplom skickat!',
      diplomaSentDesc: 'Diplomet har skickats till deltagarens e-post',
      diplomaGenerated: 'Diplom genererat!',
      acceptedSuccess: 'Deltagare accepterad',
      rejectedSuccess: 'Deltagare avslagen',
      attendanceSaved: 'Närvaro sparad',
      nominatedFor: 'Nominerad till',
      nominatedBy: 'Nominerad av',
      registeredAt: 'Registrerad',
      status: 'Status',
      name: 'Namn',
      email: 'E-post',
      phone: 'Telefon',
      gender: 'Kön',
      dateOfBirth: 'Födelsedatum',
      address: 'Adress',
      maritalStatus: 'Civilstånd',
      birthPlace: 'Födelseort',
      workField: 'Arbetsområde',
      profession: 'Yrke',
      employer: 'Arbetsgivare',
      church: 'Kyrka',
      churchRole: 'Roll i kyrkan',
      attendanceCommitment: 'Närvaroåtagande',
      activeRoleCommitment: 'Aktivt deltagande',
      feeSupport: 'Ekonomiskt stöd',
      notes: 'Anteckningar',
      male: 'Man',
      female: 'Kvinna',
      yes: 'Ja',
      no: 'Nej'
    },
    en: {
      title: 'Training Participants',
      subtitle: 'Manage registrations, attendance and diplomas',
      back: 'Back to Admin',
      totalRegistered: 'Total Registered',
      accepted: 'Accepted',
      rejected: 'Rejected',
      completed: 'Completed',
      pending: 'Pending',
      filterAll: 'All',
      filterPending: 'Pending',
      filterAccepted: 'Accepted',
      filterRejected: 'Rejected',
      filterCompleted: 'Completed',
      noParticipants: 'No participants found',
      viewDetails: 'View details',
      accept: 'Accept',
      reject: 'Reject',
      attendance: 'Attendance',
      generateDiploma: 'Generate diploma',
      sendDiploma: 'Send diploma',
      hours: 'hours',
      of21Hours: 'of 21 hours',
      registrationDetails: 'Registration Details',
      personalInfo: 'Personal Information',
      workInfo: 'Work Information',
      churchInfo: 'Church Information',
      commitments: 'Commitments',
      attendanceTitle: 'Attendance Registration',
      attendanceDesc: 'Enter the number of hours the participant has attended',
      save: 'Save',
      cancel: 'Cancel',
      diplomaTitle: 'Diploma',
      diplomaDesc: 'Generate and send diploma to the participant',
      preview: 'Preview',
      download: 'Download PDF',
      sendEmail: 'Send via email',
      diplomaSent: 'Diploma sent!',
      diplomaSentDesc: 'The diploma has been sent to the participant\'s email',
      diplomaGenerated: 'Diploma generated!',
      acceptedSuccess: 'Participant accepted',
      rejectedSuccess: 'Participant rejected',
      attendanceSaved: 'Attendance saved',
      nominatedFor: 'Nominated for',
      nominatedBy: 'Nominated by',
      registeredAt: 'Registered',
      status: 'Status',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      gender: 'Gender',
      dateOfBirth: 'Date of birth',
      address: 'Address',
      maritalStatus: 'Marital status',
      birthPlace: 'Place of birth',
      workField: 'Work field',
      profession: 'Profession',
      employer: 'Employer',
      church: 'Church',
      churchRole: 'Church role',
      attendanceCommitment: 'Attendance commitment',
      activeRoleCommitment: 'Active role commitment',
      feeSupport: 'Fee support',
      notes: 'Notes',
      male: 'Male',
      female: 'Female',
      yes: 'Yes',
      no: 'No'
    },
    ar: {
      title: 'المشاركون في التدريب',
      subtitle: 'إدارة التسجيلات والحضور والشهادات',
      back: 'العودة إلى لوحة التحكم',
      totalRegistered: 'إجمالي المسجلين',
      accepted: 'مقبول',
      rejected: 'مرفوض',
      completed: 'مكتمل',
      pending: 'قيد الانتظار',
      filterAll: 'الكل',
      filterPending: 'قيد الانتظار',
      filterAccepted: 'مقبول',
      filterRejected: 'مرفوض',
      filterCompleted: 'مكتمل',
      noParticipants: 'لم يتم العثور على مشاركين',
      viewDetails: 'عرض التفاصيل',
      accept: 'قبول',
      reject: 'رفض',
      attendance: 'الحضور',
      generateDiploma: 'إنشاء الشهادة',
      sendDiploma: 'إرسال الشهادة',
      hours: 'ساعات',
      of21Hours: 'من 21 ساعة',
      registrationDetails: 'تفاصيل التسجيل',
      personalInfo: 'المعلومات الشخصية',
      workInfo: 'معلومات العمل',
      churchInfo: 'معلومات الكنيسة',
      commitments: 'التعهدات',
      attendanceTitle: 'تسجيل الحضور',
      attendanceDesc: 'أدخل عدد الساعات التي حضرها المشارك',
      save: 'حفظ',
      cancel: 'إلغاء',
      diplomaTitle: 'الشهادة',
      diplomaDesc: 'إنشاء وإرسال الشهادة للمشارك',
      preview: 'معاينة',
      download: 'تحميل PDF',
      sendEmail: 'إرسال عبر البريد الإلكتروني',
      diplomaSent: 'تم إرسال الشهادة!',
      diplomaSentDesc: 'تم إرسال الشهادة إلى بريد المشارك الإلكتروني',
      diplomaGenerated: 'تم إنشاء الشهادة!',
      acceptedSuccess: 'تم قبول المشارك',
      rejectedSuccess: 'تم رفض المشارك',
      attendanceSaved: 'تم حفظ الحضور',
      nominatedFor: 'مرشح لـ',
      nominatedBy: 'تم الترشيح بواسطة',
      registeredAt: 'تاريخ التسجيل',
      status: 'الحالة',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      gender: 'الجنس',
      dateOfBirth: 'تاريخ الميلاد',
      address: 'العنوان',
      maritalStatus: 'الحالة الاجتماعية',
      birthPlace: 'مكان الولادة',
      workField: 'مجال العمل',
      profession: 'المهنة',
      employer: 'جهة العمل',
      church: 'الكنيسة',
      churchRole: 'الدور في الكنيسة',
      attendanceCommitment: 'تعهد الحضور',
      activeRoleCommitment: 'تعهد الدور الفعال',
      feeSupport: 'دعم الرسوم',
      notes: 'ملاحظات',
      male: 'ذكر',
      female: 'أنثى',
      yes: 'نعم',
      no: 'لا'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (participant) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants/${participant.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      if (response.ok) {
        toast.success(txt.acceptedSuccess);
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error accepting participant:', error);
    }
  };

  const handleReject = async (participant) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants/${participant.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (response.ok) {
        toast.success(txt.rejectedSuccess);
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error rejecting participant:', error);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants/${selectedParticipant.id}/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance_hours: attendanceHours })
      });
      if (response.ok) {
        toast.success(txt.attendanceSaved);
        setShowAttendanceDialog(false);
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const handlePreviewDiploma = async () => {
    setGeneratingDiploma(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants/${selectedParticipant.id}/generate-diploma`, {
        method: 'POST'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDiplomaPreviewUrl(url);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte generera förhandsvisning');
      }
    } catch (error) {
      console.error('Error previewing diploma:', error);
      toast.error('Ett fel uppstod vid förhandsvisning');
    } finally {
      setGeneratingDiploma(false);
    }
  };

  const handleGenerateDiploma = async () => {
    // If we already have a preview, use it for download
    if (diplomaPreviewUrl) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = diplomaPreviewUrl;
      a.download = `Diploma_${selectedParticipant.registration_data?.full_name?.replace(/\s+/g, '_') || 'participant'}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
      toast.success(txt.diplomaGenerated);
      return;
    }

    // Otherwise generate and download
    setGeneratingDiploma(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants/${selectedParticipant.id}/generate-diploma`, {
        method: 'POST'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Diploma_${selectedParticipant.registration_data?.full_name?.replace(/\s+/g, '_') || 'participant'}.pdf`;
        document.body.appendChild(a);
        a.click();
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        toast.success(txt.diplomaGenerated);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte generera diplom');
      }
    } catch (error) {
      console.error('Error generating diploma:', error);
      toast.error('Ett fel uppstod vid generering av diplom');
    } finally {
      setGeneratingDiploma(false);
    }
  };

  const handleSendDiploma = async () => {
    setSendingDiploma(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/training-participants/${selectedParticipant.id}/send-diploma`, {
        method: 'POST'
      });
      if (response.ok) {
        toast.success(txt.diplomaSent, { description: txt.diplomaSentDesc });
        setShowDiplomaDialog(false);
        fetchParticipants();
      }
    } catch (error) {
      console.error('Error sending diploma:', error);
    } finally {
      setSendingDiploma(false);
    }
  };

  const getStatusBadge = (participant) => {
    if (participant.diploma_sent) {
      return <Badge className="bg-purple-100 text-purple-700">Diplom skickat</Badge>;
    }
    if (participant.status === 'completed') {
      return <Badge className="bg-emerald-100 text-emerald-700">{txt.completed}</Badge>;
    }
    if (participant.status === 'accepted') {
      return <Badge className="bg-blue-100 text-blue-700">{txt.accepted}</Badge>;
    }
    if (participant.status === 'rejected') {
      return <Badge className="bg-red-100 text-red-700">{txt.rejected}</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-700">{txt.pending}</Badge>;
  };

  const filteredParticipants = participants.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'pending') return p.status === 'registered' || p.status === 'pending';
    if (filter === 'completed') return p.status === 'completed' || p.diploma_sent;
    return p.status === filter;
  });

  const stats = {
    total: participants.length,
    accepted: participants.filter(p => p.status === 'accepted' || p.status === 'completed').length,
    rejected: participants.filter(p => p.status === 'rejected').length,
    completed: participants.filter(p => p.status === 'completed' || p.diploma_sent).length,
    pending: participants.filter(p => p.status === 'registered' || p.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-haggai" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 pt-16 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-haggai text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className={`text-white hover:bg-white/20 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {txt.back}
          </Button>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-3xl font-bold">{txt.title}</h1>
              <p className="text-white/80">{txt.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-haggai mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">{stats.total}</p>
              <p className="text-sm text-stone-500">{txt.totalRegistered}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">{stats.pending}</p>
              <p className="text-sm text-stone-500">{txt.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <UserCheck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">{stats.accepted}</p>
              <p className="text-sm text-stone-500">{txt.accepted}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <UserX className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">{stats.rejected}</p>
              <p className="text-sm text-stone-500">{txt.rejected}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-800">{stats.completed}</p>
              <p className="text-sm text-stone-500">{txt.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className={`flex flex-wrap gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {['all', 'pending', 'accepted', 'rejected', 'completed'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-haggai hover:bg-haggai-dark' : ''}
            >
              {txt[`filter${f.charAt(0).toUpperCase() + f.slice(1)}`]}
            </Button>
          ))}
        </div>

        {/* Participants List */}
        {filteredParticipants.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noParticipants}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredParticipants.map((participant) => (
              <Card key={participant.id} className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h3 className="text-lg font-semibold text-stone-800">
                          {participant.registration_data?.full_name || participant.nominee_name}
                        </h3>
                        {getStatusBadge(participant)}
                      </div>
                      <div className={`flex flex-wrap gap-4 text-sm text-stone-500 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Mail className="h-4 w-4" />
                          {participant.registration_data?.email || participant.nominee_email}
                        </span>
                        {participant.registration_data?.phone && (
                          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Phone className="h-4 w-4" />
                            {participant.registration_data.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-600">
                        <strong>{txt.nominatedFor}:</strong> {participant.event_title}
                      </p>
                      
                      {/* Attendance Progress */}
                      {participant.status === 'accepted' || participant.status === 'completed' ? (
                        <div className="mt-4">
                          <div className={`flex items-center justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm text-stone-600">{txt.attendance}</span>
                            <span className="text-sm font-medium text-stone-800">
                              {participant.attendance_hours || 0} {txt.of21Hours}
                            </span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                (participant.attendance_hours || 0) >= 21 ? 'bg-emerald-500' : 'bg-haggai'
                              }`}
                              style={{ width: `${Math.min(((participant.attendance_hours || 0) / 21) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Actions */}
                    <div className={`flex flex-col gap-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedParticipant(participant);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {txt.viewDetails}
                      </Button>
                      
                      {(participant.status === 'registered' || participant.status === 'pending') && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => handleAccept(participant)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {txt.accept}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(participant)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {txt.reject}
                          </Button>
                        </>
                      )}
                      
                      {participant.status === 'accepted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setAttendanceHours(participant.attendance_hours || 0);
                            setShowAttendanceDialog(true);
                          }}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {txt.attendance}
                        </Button>
                      )}
                      
                      {(participant.status === 'completed' || (participant.attendance_hours || 0) >= 21) && (
                        <Button
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600"
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setShowDiplomaDialog(true);
                          }}
                        >
                          <Award className="h-4 w-4 mr-1" />
                          {participant.diploma_sent ? txt.sendDiploma : txt.generateDiploma}
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

      {/* Registration Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : ''}>{txt.registrationDetails}</DialogTitle>
          </DialogHeader>
          
          {selectedParticipant?.registration_data && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className={`font-semibold text-stone-800 mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Users className="h-5 w-5 text-haggai" />
                  {txt.personalInfo}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>{txt.name}:</strong> {selectedParticipant.registration_data.full_name}</div>
                  <div><strong>{txt.gender}:</strong> {selectedParticipant.registration_data.gender === 'male' ? txt.male : txt.female}</div>
                  <div><strong>{txt.dateOfBirth}:</strong> {selectedParticipant.registration_data.date_of_birth}</div>
                  <div><strong>{txt.phone}:</strong> {selectedParticipant.registration_data.phone}</div>
                  <div><strong>{txt.email}:</strong> {selectedParticipant.registration_data.email}</div>
                  <div><strong>{txt.maritalStatus}:</strong> {selectedParticipant.registration_data.marital_status}</div>
                  <div className="col-span-2"><strong>{txt.address}:</strong> {selectedParticipant.registration_data.full_address}</div>
                  <div><strong>{txt.birthPlace}:</strong> {selectedParticipant.registration_data.place_of_birth}</div>
                </div>
              </div>
              
              {/* Work Info */}
              <div>
                <h4 className={`font-semibold text-stone-800 mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Briefcase className="h-5 w-5 text-haggai" />
                  {txt.workInfo}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>{txt.workField}:</strong> {selectedParticipant.registration_data.work_field}</div>
                  <div><strong>{txt.profession}:</strong> {selectedParticipant.registration_data.current_profession}</div>
                  <div><strong>{txt.employer}:</strong> {selectedParticipant.registration_data.employer_name}</div>
                </div>
              </div>
              
              {/* Church Info */}
              <div>
                <h4 className={`font-semibold text-stone-800 mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Church className="h-5 w-5 text-haggai" />
                  {txt.churchInfo}
                </h4>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div><strong>{txt.church}:</strong> {selectedParticipant.registration_data.church_name}</div>
                  <div><strong>{txt.churchRole}:</strong> {selectedParticipant.registration_data.church_role}</div>
                </div>
              </div>
              
              {/* Commitments */}
              <div>
                <h4 className={`font-semibold text-stone-800 mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <FileText className="h-5 w-5 text-haggai" />
                  {txt.commitments}
                </h4>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <strong>{txt.attendanceCommitment}:</strong>{' '}
                    <Badge className={selectedParticipant.registration_data.commitment_attendance === 'yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                      {selectedParticipant.registration_data.commitment_attendance === 'yes' ? txt.yes : txt.no}
                    </Badge>
                  </div>
                  <div>
                    <strong>{txt.activeRoleCommitment}:</strong>{' '}
                    <Badge className={selectedParticipant.registration_data.commitment_active_role === 'yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                      {selectedParticipant.registration_data.commitment_active_role === 'yes' ? txt.yes : txt.no}
                    </Badge>
                  </div>
                  {selectedParticipant.registration_data.fee_support_request && (
                    <div><strong>{txt.feeSupport}:</strong> {selectedParticipant.registration_data.fee_support_request}</div>
                  )}
                  {selectedParticipant.registration_data.notes && (
                    <div><strong>{txt.notes}:</strong> {selectedParticipant.registration_data.notes}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent className={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : ''}>{txt.attendanceTitle}</DialogTitle>
          </DialogHeader>
          <p className={`text-stone-600 ${isRTL ? 'text-right' : ''}`}>{txt.attendanceDesc}</p>
          <div className="py-4">
            <Label>{txt.attendance} ({txt.hours})</Label>
            <Input
              type="number"
              min="0"
              max="21"
              value={attendanceHours}
              onChange={(e) => setAttendanceHours(Number(e.target.value))}
              className="mt-2"
            />
            <div className="mt-2 text-sm text-stone-500">
              {attendanceHours >= 21 ? (
                <span className="text-emerald-600 font-medium">✓ Godkänd för diplom</span>
              ) : (
                <span>{21 - attendanceHours} {txt.hours} kvar</span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
              {txt.cancel}
            </Button>
            <Button onClick={handleSaveAttendance} className="bg-haggai hover:bg-haggai-dark">
              {txt.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diploma Dialog */}
      <Dialog open={showDiplomaDialog} onOpenChange={(open) => {
        setShowDiplomaDialog(open);
        if (!open) setDiplomaPreviewUrl(null);
      }}>
        <DialogContent className={`max-w-4xl ${isRTL ? 'rtl' : 'ltr'}`}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : ''}>{txt.diplomaTitle}</DialogTitle>
          </DialogHeader>
          <p className={`text-stone-600 ${isRTL ? 'text-right' : ''}`}>{txt.diplomaDesc}</p>
          
          {selectedParticipant && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-stone-50 rounded-xl">
                <p><strong>{txt.name}:</strong> {selectedParticipant.registration_data?.full_name}</p>
                <p><strong>{txt.email}:</strong> {selectedParticipant.registration_data?.email}</p>
                <p><strong>{txt.attendance}:</strong> {selectedParticipant.attendance_hours || 0} {txt.hours}</p>
              </div>
              
              {/* PDF Preview */}
              {diplomaPreviewUrl ? (
                <div className="border rounded-xl overflow-hidden bg-gray-50 p-4">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-green-700">
                        {language === 'sv' ? 'Diplom genererat!' : 
                         language === 'ar' ? 'تم إنشاء الشهادة!' : 
                         'Diploma generated!'}
                      </p>
                      <p className="text-sm text-stone-500">
                        {language === 'sv' ? 'Du kan nu förhandsgranska, ladda ner eller skicka diplomet.' : 
                         language === 'ar' ? 'يمكنك الآن معاينة الشهادة أو تنزيلها أو إرسالها.' : 
                         'You can now preview, download or send the diploma.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => window.open(diplomaPreviewUrl, '_blank')}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {language === 'sv' ? 'Öppna i ny flik' : language === 'ar' ? 'فتح في علامة تبويب جديدة' : 'Open in new tab'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-xl p-8 bg-gray-50 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-stone-500 mb-4">
                    {language === 'sv' ? 'Klicka på "Förhandsgranska" för att se diplomet' : 
                     language === 'ar' ? 'انقر على "معاينة" لعرض الشهادة' : 
                     'Click "Preview" to view the diploma'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handlePreviewDiploma}
                    disabled={generatingDiploma}
                  >
                    {generatingDiploma ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {language === 'sv' ? 'Förhandsgranska' : language === 'ar' ? 'معاينة' : 'Preview'}
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {diplomaPreviewUrl && (
              <>
                <Button
                  variant="outline"
                  onClick={handleGenerateDiploma}
                  disabled={generatingDiploma}
                >
                  {generatingDiploma ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  {txt.download}
                </Button>
                <Button
                  onClick={handleSendDiploma}
                  disabled={sendingDiploma}
                  className="bg-haggai hover:bg-haggai-dark"
                >
                  {sendingDiploma ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  {txt.sendEmail}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTrainingParticipants;
