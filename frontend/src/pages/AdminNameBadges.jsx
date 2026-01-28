import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { 
  IdCard, Download, Printer, Search, Users, UserCheck, 
  Filter, CheckCircle, Clock, ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminNameBadges = () => {
  const { language } = useLanguage();
  const [participants, setParticipants] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, participants, leaders
  const [selectedItems, setSelectedItems] = useState([]);

  const txt = {
    sv: {
      title: 'Namnbrickor - Administration',
      subtitle: 'Hantera och skriv ut namnbrickor för deltagare och ledare',
      participants: 'Deltagare',
      leaders: 'Ledare',
      all: 'Alla',
      search: 'Sök efter namn...',
      selected: 'valda',
      selectAll: 'Välj alla',
      deselectAll: 'Avmarkera alla',
      downloadSelected: 'Ladda ner valda',
      printSelected: 'Skriv ut valda',
      downloadAll: 'Ladda ner alla',
      printAll: 'Skriv ut alla',
      status: 'Status',
      approved: 'Godkänd',
      pending: 'Väntande',
      workshop: 'Workshop',
      organization: 'Organisation',
      noData: 'Inga namnbrickor att visa',
      loading: 'Laddar...'
    },
    en: {
      title: 'Name Badges - Administration',
      subtitle: 'Manage and print name badges for participants and leaders',
      participants: 'Participants',
      leaders: 'Leaders',
      all: 'All',
      search: 'Search by name...',
      selected: 'selected',
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
      downloadSelected: 'Download selected',
      printSelected: 'Print selected',
      downloadAll: 'Download all',
      printAll: 'Print all',
      status: 'Status',
      approved: 'Approved',
      pending: 'Pending',
      workshop: 'Workshop',
      organization: 'Organization',
      noData: 'No badges to display',
      loading: 'Loading...'
    }
  };

  const t = txt[language] || txt.sv;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch approved participants
      const participantsRes = await fetch(`${BACKEND_URL}/api/nominations?status=approved`);
      if (participantsRes.ok) {
        const data = await participantsRes.json();
        setParticipants(data);
      }

      // Fetch approved leaders
      const leadersRes = await fetch(`${BACKEND_URL}/api/leader-registrations`);
      if (leadersRes.ok) {
        const data = await leadersRes.json();
        const approvedLeaders = data.filter(l => l.status === 'approved');
        setLeaders(approvedLeaders);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Kunde inte ladda data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBadge = async (id, name, type) => {
    try {
      const endpoint = type === 'participant' 
        ? `${BACKEND_URL}/api/participants/${id}/name-badge`
        : `${BACKEND_URL}/api/leaders/${id}/name-badge`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Namnskylt_${name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Namnbricka för ${name} nedladdad!`);
      }
    } catch (err) {
      console.error('Error downloading badge:', err);
      toast.error('Kunde inte ladda ner namnbrickan');
    }
  };

  const handlePrintBadge = async (id, type) => {
    try {
      const endpoint = type === 'participant' 
        ? `${BACKEND_URL}/api/participants/${id}/name-badge`
        : `${BACKEND_URL}/api/leaders/${id}/name-badge`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
          iframe.contentWindow.print();
        };
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.URL.revokeObjectURL(url);
        }, 1000);
      }
    } catch (err) {
      console.error('Error printing badge:', err);
      toast.error('Kunde inte skriva ut namnbrickan');
    }
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = [
      ...participants.map(p => `p-${p.id}`),
      ...leaders.map(l => `l-${l.id}`)
    ];
    setSelectedItems(allIds);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const getFilteredData = () => {
    let data = [];
    
    if (filterType === 'all' || filterType === 'participants') {
      data = [...data, ...participants.map(p => ({
        ...p,
        type: 'participant',
        displayName: p.registration_data?.full_name || p.nominee_name,
        organization: p.registration_data?.church_name || p.nominee_church || '',
        uniqueId: `p-${p.id}`
      }))];
    }
    
    if (filterType === 'all' || filterType === 'leaders') {
      data = [...data, ...leaders.map(l => ({
        ...l,
        type: 'leader',
        displayName: l.name,
        organization: '',
        uniqueId: `l-${l.id}`
      }))];
    }

    if (searchTerm) {
      data = data.filter(item => 
        item.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  };

  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/admin" 
          className="inline-flex items-center text-stone-600 hover:text-haggai mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {language === 'sv' ? 'Tillbaka till Admin' : language === 'ar' ? 'العودة إلى الإدارة' : 'Back to Admin'}
        </Link>

        {/* Header */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <IdCard className="h-6 w-6 text-haggai" />
                  {t.title}
                </CardTitle>
                <p className="text-sm text-stone-500 mt-1">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <Users className="h-3 w-3 mr-1" />
                  {participants.length} {t.participants}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {leaders.length} {t.leaders}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Controls */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.search}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-haggai' : ''}
                >
                  {t.all}
                </Button>
                <Button
                  variant={filterType === 'participants' ? 'default' : 'outline'}
                  onClick={() => setFilterType('participants')}
                  className={filterType === 'participants' ? 'bg-blue-600' : ''}
                >
                  {t.participants}
                </Button>
                <Button
                  variant={filterType === 'leaders' ? 'default' : 'outline'}
                  onClick={() => setFilterType('leaders')}
                  className={filterType === 'leaders' ? 'bg-purple-600' : ''}
                >
                  {t.leaders}
                </Button>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                {selectedItems.length > 0 ? (
                  <>
                    <Button variant="outline" size="sm" onClick={deselectAll}>
                      {t.deselectAll} ({selectedItems.length})
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {t.selectAll}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <IdCard className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">{t.noData}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredData.map((item) => (
                  <div
                    key={item.uniqueId}
                    className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                      selectedItems.includes(item.uniqueId)
                        ? 'bg-haggai/5 border-haggai'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.uniqueId)}
                      onChange={() => toggleSelection(item.uniqueId)}
                      className="h-5 w-5 text-haggai rounded"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-stone-800">{item.displayName}</h3>
                        <Badge className={item.type === 'participant' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                          {item.type === 'participant' ? 'PARTICIPANT' : 'LEADER'}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t.approved}
                        </Badge>
                      </div>
                      {item.organization && (
                        <p className="text-sm text-stone-500 mt-1">{item.organization}</p>
                      )}
                      {item.event_title && (
                        <p className="text-sm text-stone-600 mt-1">
                          <span className="text-stone-400">{t.workshop}:</span> {item.event_title}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadBadge(item.id, item.displayName, item.type)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t.downloadSelected.split(' ')[0]}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrintBadge(item.id, item.type)}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        {t.printSelected.split(' ')[0]}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNameBadges;
