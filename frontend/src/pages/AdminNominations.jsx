import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, ArrowLeft, Search, Filter, Check, X, Mail, Phone, 
  Calendar, User, Users, TrendingUp, Clock, BarChart3, RefreshCw,
  ChevronDown, ChevronUp, Eye, Trash2, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminNominations = () => {
  const { language, isRTL } = useLanguage();
  const [nominations, setNominations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNomination, setSelectedNomination] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionNomination, setActionNomination] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const txt = {
    sv: {
      title: 'Nomineringar',
      subtitle: 'Granska och godkänn nomineringar till utbildningar',
      back: 'Tillbaka till Admin',
      search: 'Sök nominering...',
      filterAll: 'Alla',
      filterPending: 'Väntande',
      filterApproved: 'Godkända',
      filterRejected: 'Avvisade',
      filterContacted: 'Kontaktade',
      filterRegistered: 'Registrerade',
      filterPendingApproval: 'Väntar på godkännande',
      total: 'Totalt',
      pending: 'Väntande',
      approved: 'Godkända',
      rejected: 'Avvisade',
      contacted: 'Kontaktade',
      registered: 'Registrerade',
      pendingApproval: 'Väntar på godkännande',
      noNominations: 'Inga nomineringar hittades',
      nominator: 'Nominerad av',
      nominee: 'Nominerad person',
      nominatorInfo: 'Information om den som nominerar',
      nomineeInfo: 'Information om den nominerade',
      nominatorChurch: 'Kyrka',
      nominatorRelation: 'Relation till nominerad',
      nomineeChurch: 'Kyrka/församling',
      nomineeRole: 'Roll/ansvar',
      nomineeActivities: 'Aktiviteter',
      event: 'Utbildning',
      date: 'Datum',
      motivation: 'Motivering till nominering',
      status: 'Status',
      actions: 'Åtgärder',
      approve: 'Godkänn & skicka inbjudan',
      reject: 'Avvisa',
      contact: 'Markera kontaktad',
      delete: 'Radera',
      viewDetails: 'Visa detaljer',
      topNominators: 'Topp nominatorer',
      byEvent: 'Per utbildning',
      refresh: 'Uppdatera',
      confirmDelete: 'Är du säker på att du vill radera denna nominering?',
      statistics: 'Statistik',
      hideStats: 'Dölj statistik',
      showStats: 'Visa statistik',
      approveConfirm: 'Godkänn nominering?',
      approveConfirmDesc: 'En inbjudan med registreringslänk skickas till den nominerade personen.',
      approveRegistration: 'Godkänn registrering',
      approveRegistrationDesc: 'Deltagaren får ett konto och kan logga in i sin portal',
      rejectRegistration: 'Neka registrering',
      rejectRegistrationReason: 'Anledning för nekande',
      registrationApproved: 'Registrering godkänd!',
      registrationRejected: 'Registrering nekad',
      rejectConfirm: 'Avvisa nominering?',
      rejectReason: 'Anledning (valfritt)',
      cancel: 'Avbryt',
      confirm: 'Bekräfta',
      invitationSent: 'Inbjudan skickad!',
      nominationRejected: 'Nominering avvisad'
    },
    en: {
      title: 'Nominations',
      subtitle: 'Manage training nominations',
      back: 'Back to Admin',
      search: 'Search nomination...',
      filterAll: 'All',
      filterPending: 'Pending',
      filterApproved: 'Approved',
      filterRejected: 'Rejected',
      filterContacted: 'Contacted',
      total: 'Total',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      contacted: 'Contacted',
      noNominations: 'No nominations found',
      nominator: 'Nominated by',
      nominee: 'Nominated person',
      event: 'Training',
      date: 'Date',
      motivation: 'Motivation',
      status: 'Status',
      actions: 'Actions',
      approve: 'Approve',
      reject: 'Reject',
      contact: 'Mark contacted',
      delete: 'Delete',
      viewDetails: 'View details',
      topNominators: 'Top nominators',
      byEvent: 'By training',
      refresh: 'Refresh',
      confirmDelete: 'Are you sure you want to delete this nomination?',
      statistics: 'Statistics',
      hideStats: 'Hide statistics',
      showStats: 'Show statistics'
    },
    ar: {
      title: 'الترشيحات',
      subtitle: 'إدارة ترشيحات التدريب',
      back: 'العودة إلى الإدارة',
      search: 'بحث عن ترشيح...',
      filterAll: 'الكل',
      filterPending: 'قيد الانتظار',
      filterApproved: 'موافق عليه',
      filterRejected: 'مرفوض',
      filterContacted: 'تم الاتصال',
      total: 'المجموع',
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      contacted: 'تم الاتصال',
      noNominations: 'لم يتم العثور على ترشيحات',
      nominator: 'رشّحه',
      nominee: 'الشخص المرشح',
      event: 'التدريب',
      date: 'التاريخ',
      motivation: 'السبب',
      status: 'الحالة',
      actions: 'الإجراءات',
      approve: 'موافقة',
      reject: 'رفض',
      contact: 'تم الاتصال',
      delete: 'حذف',
      viewDetails: 'عرض التفاصيل',
      topNominators: 'أكثر المرشحين',
      byEvent: 'حسب التدريب',
      refresh: 'تحديث',
      confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا الترشيح؟',
      statistics: 'الإحصائيات',
      hideStats: 'إخفاء الإحصائيات',
      showStats: 'إظهار الإحصائيات'
    }
  }[language] || {};

  useEffect(() => {
    fetchNominations();
    fetchStats();
  }, [statusFilter]);

  const fetchNominations = async () => {
    try {
      const url = statusFilter === 'all' 
        ? `${BACKEND_URL}/api/nominations`
        : `${BACKEND_URL}/api/nominations?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNominations(data);
      }
    } catch (error) {
      console.error('Error fetching nominations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast.success(language === 'sv' ? 'Status uppdaterad' : 'Status updated');
        fetchNominations();
        fetchStats();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte uppdatera status' : 'Could not update status');
    }
  };

  const approveNomination = async () => {
    if (!actionNomination) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${actionNomination.id}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        toast.success(txt.invitationSent || 'Inbjudan skickad!');
        setShowApproveDialog(false);
        setActionNomination(null);
        fetchNominations();
        fetchStats();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte godkänna' : 'Could not approve');
    }
  };

  const rejectNomination = async () => {
    if (!actionNomination) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${actionNomination.id}/reject?reason=${encodeURIComponent(rejectReason)}`, {
        method: 'POST'
      });
      if (response.ok) {
        toast.success(txt.nominationRejected || 'Nominering avvisad');
        setShowRejectDialog(false);
        setActionNomination(null);
        setRejectReason('');
        fetchNominations();
        fetchStats();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte avvisa' : 'Could not reject');
    }
  };


  const approveRegistration = async (nominationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${nominationId}/approve-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });
      if (response.ok) {
        toast.success(txt.registrationApproved || 'Registrering godkänd!');
        fetchNominations();
        fetchStats();
      }
    } catch (error) {
      toast.error('Kunde inte godkänna registreringen');
    }
  };

  const rejectRegistration = async (nominationId, reason) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${nominationId}/approve-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejection_reason: reason })
      });
      if (response.ok) {
        toast.success(txt.registrationRejected || 'Registrering nekad');
        fetchNominations();
        fetchStats();
      }
    } catch (error) {
      toast.error('Kunde inte neka registreringen');
    }
  };


  const deleteNomination = async (id) => {
    if (!window.confirm(txt.confirmDelete)) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success(language === 'sv' ? 'Nominering raderad' : 'Nomination deleted');
        fetchNominations();
        fetchStats();
      }
    } catch (error) {
      toast.error(language === 'sv' ? 'Kunde inte radera' : 'Could not delete');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      contacted: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      pending: txt.pending,
      approved: txt.approved,
      rejected: txt.rejected,
      contacted: txt.contacted
    };
    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const filteredNominations = nominations.filter(nom => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      nom.nominee_name?.toLowerCase().includes(query) ||
      nom.nominator_name?.toLowerCase().includes(query) ||
      nom.event_title?.toLowerCase().includes(query) ||
      nom.nominee_email?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(
      language === 'sv' ? 'sv-SE' : language === 'ar' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
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
          
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-16 h-16 bg-haggai rounded-2xl flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-3xl font-bold text-stone-800">{txt.title}</h1>
              <p className="text-stone-600">{txt.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowStats(!showStats)}
          className={`mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <BarChart3 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {showStats ? txt.hideStats : txt.showStats}
          {showStats ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </Button>

        {/* Statistics Cards */}
        {showStats && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-stone-800">{stats.total}</p>
                <p className="text-sm text-stone-500">{txt.total}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-yellow-50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
                <p className="text-sm text-yellow-600">{txt.pending}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-green-50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
                <p className="text-sm text-green-600">{txt.approved}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-red-50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
                <p className="text-sm text-red-600">{txt.rejected}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-blue-50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-700">{stats.contacted}</p>
                <p className="text-sm text-blue-600">{txt.contacted}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Nominators & By Event */}
        {showStats && stats && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Top Nominators */}
            {stats.top_nominators?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className={isRTL ? 'text-right' : ''}>
                  <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TrendingUp className="h-5 w-5 text-haggai" />
                    {txt.topNominators}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.top_nominators.map((nom, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2 bg-stone-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="w-6 h-6 bg-haggai text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium">{nom.name || nom._id}</span>
                        </div>
                        <Badge variant="outline">{nom.count} st</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* By Event */}
            {stats.by_event?.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className={isRTL ? 'text-right' : ''}>
                  <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="h-5 w-5 text-haggai" />
                    {txt.byEvent}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.by_event.map((event, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-2 bg-stone-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-medium truncate flex-1">{event._id}</span>
                        <Badge className="bg-haggai text-white ml-2">{event.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={txt.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} rounded-xl`}
                />
              </div>
              <div className={`flex gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                {['all', 'pending', 'approved', 'rejected', 'contacted', 'pending_approval'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'bg-haggai text-white' : ''}
                  >
                    {txt[`filter${status.charAt(0).toUpperCase() + status.slice(1)}`] || status}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { fetchNominations(); fetchStats(); }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nominations List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNominations.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <UserPlus className="h-12 w-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500">{txt.noNominations}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNominations.map((nomination) => (
              <Card key={nomination.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`flex flex-col lg:flex-row lg:items-center gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Main Info */}
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <Badge className="bg-haggai-100 text-haggai-dark">{nomination.event_title}</Badge>
                        {getStatusBadge(nomination.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {/* Nominee */}
                        <div className={`p-3 bg-green-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                          <p className="text-xs text-green-600 font-medium mb-1">{txt.nominee}</p>
                          <p className="font-semibold text-stone-800">{nomination.nominee_name}</p>
                          <div className={`flex items-center gap-2 text-sm text-stone-600 mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <Mail className="h-3 w-3" />
                            {nomination.nominee_email}
                          </div>
                          {nomination.nominee_phone && (
                            <div className={`flex items-center gap-2 text-sm text-stone-600 mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <Phone className="h-3 w-3" />
                              {nomination.nominee_phone}
                            </div>
                          )}
                        </div>
                        
                        {/* Nominator */}
                        <div className={`p-3 bg-blue-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                          <p className="text-xs text-blue-600 font-medium mb-1">{txt.nominator}</p>
                          <p className="font-semibold text-stone-800">{nomination.nominator_name}</p>
                          <div className={`flex items-center gap-2 text-sm text-stone-600 mt-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <Mail className="h-3 w-3" />
                            {nomination.nominator_email}
                          </div>
                        </div>
                      </div>

                      {/* New fields: Church, Role, Activities */}
                      {(nomination.nominee_church || nomination.nominee_role || nomination.nominee_activities) && (
                        <div className={`mt-3 p-3 bg-amber-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                          <p className="text-xs text-amber-600 font-medium mb-2">{txt.nomineeInfo || 'Om den nominerade'}</p>
                          {nomination.nominee_church && (
                            <p className="text-sm text-stone-700"><strong>{txt.nomineeChurch || 'Kyrka'}:</strong> {nomination.nominee_church}</p>
                          )}
                          {nomination.nominee_role && (
                            <p className="text-sm text-stone-700"><strong>{txt.nomineeRole || 'Roll'}:</strong> {nomination.nominee_role}</p>
                          )}
                          {nomination.nominee_activities && (
                            <p className="text-sm text-stone-700 mt-1"><strong>{txt.nomineeActivities || 'Aktiviteter'}:</strong> {nomination.nominee_activities}</p>
                          )}
                        </div>
                      )}

                      {nomination.motivation && (
                        <div className={`mt-3 p-3 bg-stone-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                          <p className="text-xs text-stone-500 mb-1">{txt.motivation}</p>
                          <p className="text-sm text-stone-700 whitespace-pre-wrap">{nomination.motivation}</p>
                        </div>
                      )}

                      <p className="text-xs text-stone-400 mt-3">
                        {formatDate(nomination.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {nomination.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => { setActionNomination(nomination); setShowApproveDialog(true); }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {txt.approve}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => { setActionNomination(nomination); setShowRejectDialog(true); }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {txt.reject}
                          </Button>
                        </>
                      )}
                      {nomination.status === 'approved' && !nomination.registration_completed && (
                        <Badge className="bg-blue-100 text-blue-700">
                          Inbjudan skickad - väntar på registrering
                        </Badge>
                      )}
                      {nomination.registration_completed && (
                        <Badge className="bg-green-100 text-green-700">
                          ✅ Registrerad
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteNomination(nomination.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent className={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{txt.approveConfirm || 'Godkänn nominering?'}</DialogTitle>
            </DialogHeader>
            {actionNomination && (
              <div className="py-4">
                <p className="text-stone-600 mb-4">{txt.approveConfirmDesc || 'En inbjudan med registreringslänk skickas till den nominerade personen.'}</p>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p><strong>Till:</strong> {actionNomination.nominee_name}</p>
                  <p><strong>E-post:</strong> {actionNomination.nominee_email}</p>
                  <p><strong>Utbildning:</strong> {actionNomination.event_title}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                {txt.cancel || 'Avbryt'}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={approveNomination}>
                <Check className="h-4 w-4 mr-2" />
                {txt.confirm || 'Bekräfta'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{txt.rejectConfirm || 'Avvisa nominering?'}</DialogTitle>
            </DialogHeader>
            {actionNomination && (
              <div className="py-4">
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                  <p><strong>Person:</strong> {actionNomination.nominee_name}</p>
                  <p><strong>Nominerad av:</strong> {actionNomination.nominator_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{txt.rejectReason || 'Anledning (valfritt)'}</label>
                  <Input
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Ange anledning..."
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowRejectDialog(false); setRejectReason(''); }}>
                {txt.cancel || 'Avbryt'}
              </Button>
              <Button variant="destructive" onClick={rejectNomination}>
                <X className="h-4 w-4 mr-2" />
                {txt.reject || 'Avvisa'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminNominations;
