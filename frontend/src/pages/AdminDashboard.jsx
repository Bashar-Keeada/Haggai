import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, FileText, Mail, Calendar, ChevronDown, ChevronUp, 
  Eye, Check, X, Clock, Filter, Search, Download, RefreshCw, UserCog, Shield, Building2, Handshake, Quote, UserPlus, GraduationCap, Heart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Data states
  const [leaderApplications, setLeaderApplications] = useState([]);
  const [membershipApplications, setMembershipApplications] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);

  const translations = {
    sv: {
      title: 'Admin Dashboard',
      subtitle: 'Hantera alla ansökningar och meddelanden',
      leaderApplications: 'Leader Experience Ansökningar',
      membershipApplications: 'Medlemsansökningar',
      contactMessages: 'Kontaktmeddelanden',
      search: 'Sök...',
      filterAll: 'Alla',
      filterPending: 'Väntande',
      filterApproved: 'Godkända',
      filterRejected: 'Avvisade',
      noApplications: 'Inga ansökningar ännu',
      noMessages: 'Inga meddelanden ännu',
      refresh: 'Uppdatera',
      name: 'Namn',
      email: 'E-post',
      phone: 'Telefon',
      date: 'Datum',
      status: 'Status',
      program: 'Program',
      type: 'Typ',
      pending: 'Väntande',
      approved: 'Godkänd',
      rejected: 'Avvisad',
      approve: 'Godkänn',
      reject: 'Avvisa',
      viewDetails: 'Visa detaljer',
      nominationType: 'Nominering',
      self: 'Egen ansökan',
      friend: 'Nominerad av vän',
      city: 'Stad',
      country: 'Land',
      organization: 'Organisation/Kyrka',
      role: 'Roll',
      yearsInRole: 'År i rollen',
      ministryDescription: 'Beskrivning av tjänst',
      whyApply: 'Varför ansöker du?',
      expectations: 'Förväntningar',
      nominatorInfo: 'Nominatorns information',
      memberType: 'Medlemstyp',
      individual: 'Individ',
      church: 'Kyrka/Församling',
      organizationType: 'Organisation',
      subject: 'Ämne',
      message: 'Meddelande',
      total: 'Totalt',
      exportData: 'Exportera'
    },
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Manage all applications and messages',
      leaderApplications: 'Leader Experience Applications',
      membershipApplications: 'Membership Applications',
      contactMessages: 'Contact Messages',
      search: 'Search...',
      filterAll: 'All',
      filterPending: 'Pending',
      filterApproved: 'Approved',
      filterRejected: 'Rejected',
      noApplications: 'No applications yet',
      noMessages: 'No messages yet',
      refresh: 'Refresh',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      date: 'Date',
      status: 'Status',
      program: 'Program',
      type: 'Type',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      approve: 'Approve',
      reject: 'Reject',
      viewDetails: 'View details',
      nominationType: 'Nomination',
      self: 'Self application',
      friend: 'Nominated by friend',
      city: 'City',
      country: 'Country',
      organization: 'Organization/Church',
      role: 'Role',
      yearsInRole: 'Years in role',
      ministryDescription: 'Ministry description',
      whyApply: 'Why are you applying?',
      expectations: 'Expectations',
      nominatorInfo: 'Nominator information',
      memberType: 'Member type',
      individual: 'Individual',
      church: 'Church/Congregation',
      organizationType: 'Organization',
      subject: 'Subject',
      message: 'Message',
      total: 'Total',
      exportData: 'Export'
    },
    ar: {
      title: 'لوحة الإدارة',
      subtitle: 'إدارة جميع الطلبات والرسائل',
      leaderApplications: 'طلبات خبرة القيادة',
      membershipApplications: 'طلبات العضوية',
      contactMessages: 'رسائل الاتصال',
      search: 'بحث...',
      filterAll: 'الكل',
      filterPending: 'قيد الانتظار',
      filterApproved: 'موافق عليها',
      filterRejected: 'مرفوضة',
      noApplications: 'لا توجد طلبات بعد',
      noMessages: 'لا توجد رسائل بعد',
      refresh: 'تحديث',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      date: 'التاريخ',
      status: 'الحالة',
      program: 'البرنامج',
      type: 'النوع',
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      approve: 'موافقة',
      reject: 'رفض',
      viewDetails: 'عرض التفاصيل',
      nominationType: 'الترشيح',
      self: 'طلب ذاتي',
      friend: 'مرشح من صديق',
      city: 'المدينة',
      country: 'البلد',
      organization: 'المنظمة/الكنيسة',
      role: 'الدور',
      yearsInRole: 'سنوات في الدور',
      ministryDescription: 'وصف الخدمة',
      whyApply: 'لماذا تتقدم؟',
      expectations: 'التوقعات',
      nominatorInfo: 'معلومات المُرشِّح',
      memberType: 'نوع العضوية',
      individual: 'فرد',
      church: 'كنيسة/جماعة',
      organizationType: 'منظمة',
      subject: 'الموضوع',
      message: 'الرسالة',
      total: 'المجموع',
      exportData: 'تصدير'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leaderRes, memberRes, contactRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/leader-experience-applications`),
        fetch(`${BACKEND_URL}/api/membership`),
        fetch(`${BACKEND_URL}/api/contact`)
      ]);

      if (leaderRes.ok) {
        const data = await leaderRes.json();
        setLeaderApplications(data);
      }
      if (memberRes.ok) {
        const data = await memberRes.json();
        setMembershipApplications(data);
      }
      if (contactRes.ok) {
        const data = await contactRes.json();
        setContactSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Kunde inte hämta data');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (type, id, newStatus) => {
    try {
      const endpoint = type === 'leader' 
        ? `${BACKEND_URL}/api/leader-experience-applications/${id}`
        : `${BACKEND_URL}/api/membership/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Status uppdaterad till ${newStatus}`);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: txt.pending, className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: txt.approved, className: 'bg-green-100 text-green-800' },
      rejected: { label: txt.rejected, className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE',
      { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  const filterData = (data) => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        (item.first_name && item.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.last_name && item.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const tabs = [
    { id: 'applications', label: txt.leaderApplications, count: leaderApplications.length, icon: FileText },
    { id: 'membership', label: txt.membershipApplications, count: membershipApplications.length, icon: Users },
    { id: 'contact', label: txt.contactMessages, count: contactSubmissions.length, icon: Mail }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-cream-50 py-24 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-bold text-stone-800 mb-2">{txt.title}</h1>
          <p className="text-lg text-stone-600">{txt.subtitle}</p>
        </div>

        {/* Admin Quick Links */}
        <div className={`grid md:grid-cols-2 gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/admin/ledare">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-haggai-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-haggai rounded-2xl flex items-center justify-center">
                    <UserCog className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Facilitatorer/Tränare' : language === 'ar' ? 'إدارة الميسرين/المدربين' : 'Manage Facilitators/Trainers'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Lägg till och redigera facilitatorer' : language === 'ar' ? 'إضافة وتعديل الميسرين' : 'Add and edit facilitators'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/styrelse">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-haggai-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-haggai rounded-2xl flex items-center justify-center">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Styrelse' : language === 'ar' ? 'إدارة المجلس' : 'Manage Board'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Styrelsemedlemmar och arkiv' : language === 'ar' ? 'أعضاء المجلس والأرشيف' : 'Board members and archive'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/medlemmar">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-violet-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Medlemmar' : language === 'ar' ? 'إدارة الأعضاء' : 'Manage Members'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Kyrkor och organisationer' : language === 'ar' ? 'الكنائس والمنظمات' : 'Churches and organizations'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/partners">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-amber-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
                    <Handshake className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Partners' : language === 'ar' ? 'إدارة الشركاء' : 'Manage Partners'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Samarbetspartners' : language === 'ar' ? 'شركاء التعاون' : 'Collaboration partners'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/vittnesmal">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-pink-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center">
                    <Quote className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Vittnesmål' : language === 'ar' ? 'إدارة الشهادات' : 'Manage Testimonials'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Citat från deltagare' : language === 'ar' ? 'اقتباسات من المشاركين' : 'Quotes from participants'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/donationer">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-red-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center">
                    <Heart className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Donationsinställningar' : language === 'ar' ? 'إعدادات التبرعات' : 'Donation Settings'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Swish & Bankuppgifter' : language === 'ar' ? 'سويش والبنك' : 'Swish & Bank details'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/nomineringar">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-teal-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center">
                    <UserPlus className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Nomineringar' : language === 'ar' ? 'إدارة الترشيحات' : 'Manage Nominations'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Nominerade till workshops' : language === 'ar' ? 'المرشحون للورش' : 'Nominated for workshops'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/workshops">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-indigo-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Hantera Workshops' : language === 'ar' ? 'إدارة ورش العمل' : 'Manage Workshops'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Justera priser och detaljer' : language === 'ar' ? 'تعديل الأسعار والتفاصيل' : 'Adjust prices and details'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/utbildning">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-emerald-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Utbildningsdeltagare' : language === 'ar' ? 'المشاركون في التدريب' : 'Training Participants'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Närvaro, godkännande & diplom' : language === 'ar' ? 'الحضور والموافقة والشهادات' : 'Attendance, approval & diplomas'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/utvardering">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-orange-50">
              <CardContent className="p-6">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-lg font-bold text-stone-800">
                      {language === 'sv' ? 'Utvärderingar' : language === 'ar' ? 'التقييمات' : 'Evaluations'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      {language === 'sv' ? 'Sessionsutvärderingar & återkoppling' : language === 'ar' ? 'تقييمات الجلسات والتعليقات' : 'Session evaluations & feedback'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Card 
                key={tab.id}
                className={`cursor-pointer transition-all ${activeTab === tab.id ? 'ring-2 ring-haggai' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardContent className="p-6">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <p className="text-sm text-stone-500 mb-1">{tab.label}</p>
                      <p className="text-3xl font-bold text-stone-800">{tab.count}</p>
                    </div>
                    <div className="w-12 h-12 bg-haggai-100 rounded-xl flex items-center justify-center">
                      <Icon className="h-6 w-6 text-haggai" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className={`flex flex-wrap gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={txt.search}
              className={`${isRTL ? 'pr-10' : 'pl-10'}`}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-haggai' : ''}
              >
                {status === 'all' ? txt.filterAll : 
                 status === 'pending' ? txt.filterPending :
                 status === 'approved' ? txt.filterApproved : txt.filterRejected}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={fetchAllData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {txt.refresh}
          </Button>
        </div>

        {/* Leader Experience Applications */}
        {activeTab === 'applications' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : ''}>{txt.leaderApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              {filterData(leaderApplications).length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">{txt.noApplications}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filterData(leaderApplications).map((app) => (
                    <div key={app.id} className="border border-stone-200 rounded-xl overflow-hidden">
                      <div 
                        className={`p-4 bg-stone-50 flex items-center justify-between cursor-pointer hover:bg-stone-100 ${isRTL ? 'flex-row-reverse' : ''}`}
                        onClick={() => setExpandedItem(expandedItem === app.id ? null : app.id)}
                      >
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 bg-haggai-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-haggai" />
                          </div>
                          <div className={isRTL ? 'text-right' : ''}>
                            <p className="font-semibold text-stone-800">{app.first_name} {app.last_name}</p>
                            <p className="text-sm text-stone-500">{app.email}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Badge variant="outline">{app.program_id}</Badge>
                          {getStatusBadge(app.status)}
                          <span className="text-sm text-stone-500">{formatDate(app.created_at)}</span>
                          {expandedItem === app.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                      
                      {expandedItem === app.id && (
                        <div className="p-6 border-t border-stone-200 bg-white">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-stone-500">{txt.nominationType}</p>
                                <p className="font-medium">{app.nomination_type === 'self' ? txt.self : txt.friend}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.phone}</p>
                                <p className="font-medium">{app.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.city} / {txt.country}</p>
                                <p className="font-medium">{app.city}, {app.country}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.organization}</p>
                                <p className="font-medium">{app.church_or_organization}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.role}</p>
                                <p className="font-medium">{app.current_role} ({app.years_in_role} {txt.yearsInRole})</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-stone-500">{txt.ministryDescription}</p>
                                <p className="text-sm">{app.ministry_description}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.whyApply}</p>
                                <p className="text-sm">{app.why_apply}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.expectations}</p>
                                <p className="text-sm">{app.expectations}</p>
                              </div>
                              {app.nomination_type === 'friend' && app.nominator_name && (
                                <div className="p-4 bg-stone-50 rounded-lg">
                                  <p className="text-sm font-semibold text-stone-700 mb-2">{txt.nominatorInfo}</p>
                                  <p className="text-sm">{app.nominator_name}</p>
                                  <p className="text-sm">{app.nominator_email}</p>
                                  <p className="text-sm">{app.nominator_phone}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className={`flex gap-2 mt-6 pt-4 border-t border-stone-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateApplicationStatus('leader', app.id, 'approved')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {txt.approve}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => updateApplicationStatus('leader', app.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {txt.reject}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Membership Applications */}
        {activeTab === 'membership' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : ''}>{txt.membershipApplications}</CardTitle>
            </CardHeader>
            <CardContent>
              {filterData(membershipApplications).length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">{txt.noApplications}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filterData(membershipApplications).map((app) => (
                    <div key={app.id} className="border border-stone-200 rounded-xl overflow-hidden">
                      <div 
                        className={`p-4 bg-stone-50 flex items-center justify-between cursor-pointer hover:bg-stone-100 ${isRTL ? 'flex-row-reverse' : ''}`}
                        onClick={() => setExpandedItem(expandedItem === app.id ? null : app.id)}
                      >
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 bg-haggai-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-haggai" />
                          </div>
                          <div className={isRTL ? 'text-right' : ''}>
                            <p className="font-semibold text-stone-800">{app.first_name} {app.last_name}</p>
                            <p className="text-sm text-stone-500">{app.email}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Badge variant="outline">
                            {app.member_type === 'individual' ? txt.individual : 
                             app.member_type === 'church' ? txt.church : txt.organizationType}
                          </Badge>
                          {getStatusBadge(app.status)}
                          <span className="text-sm text-stone-500">{formatDate(app.created_at)}</span>
                          {expandedItem === app.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                      
                      {expandedItem === app.id && (
                        <div className="p-6 border-t border-stone-200 bg-white">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-stone-500">{txt.phone}</p>
                                <p className="font-medium">{app.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-stone-500">{txt.city}</p>
                                <p className="font-medium">{app.city}</p>
                              </div>
                              {app.organization && (
                                <div>
                                  <p className="text-sm text-stone-500">{txt.organization}</p>
                                  <p className="font-medium">{app.organization}</p>
                                </div>
                              )}
                            </div>
                            {app.message && (
                              <div>
                                <p className="text-sm text-stone-500">{txt.message}</p>
                                <p className="text-sm">{app.message}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className={`flex gap-2 mt-6 pt-4 border-t border-stone-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateApplicationStatus('membership', app.id, 'approved')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {txt.approve}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => updateApplicationStatus('membership', app.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {txt.reject}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Messages */}
        {activeTab === 'contact' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : ''}>{txt.contactMessages}</CardTitle>
            </CardHeader>
            <CardContent>
              {contactSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500">{txt.noMessages}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactSubmissions.filter(msg => 
                    searchTerm === '' || 
                    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((msg) => (
                    <div key={msg.id} className="border border-stone-200 rounded-xl overflow-hidden">
                      <div 
                        className={`p-4 bg-stone-50 flex items-center justify-between cursor-pointer hover:bg-stone-100 ${isRTL ? 'flex-row-reverse' : ''}`}
                        onClick={() => setExpandedItem(expandedItem === msg.id ? null : msg.id)}
                      >
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-10 h-10 bg-haggai-100 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-haggai" />
                          </div>
                          <div className={isRTL ? 'text-right' : ''}>
                            <p className="font-semibold text-stone-800">{msg.name}</p>
                            <p className="text-sm text-stone-500">{msg.subject}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm text-stone-500">{formatDate(msg.created_at)}</span>
                          {expandedItem === msg.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                      
                      {expandedItem === msg.id && (
                        <div className="p-6 border-t border-stone-200 bg-white">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-stone-500">{txt.email}</p>
                              <a href={`mailto:${msg.email}`} className="text-haggai hover:underline">{msg.email}</a>
                            </div>
                            <div>
                              <p className="text-sm text-stone-500">{txt.message}</p>
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
