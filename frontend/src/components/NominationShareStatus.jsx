import React, { useState, useEffect } from 'react';
import { 
  Share2, Eye, CheckCircle, Clock, Send, Users, RefreshCw,
  ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NominationShareStatus = ({ workshopId }) => {
  const { language, isRTL } = useLanguage();
  const [shares, setShares] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const txt = {
    sv: {
      title: 'Delningsstatus',
      total: 'Totalt',
      created: 'Skapade',
      sent: 'Skickade',
      opened: 'Öppnade',
      responded: 'Besvarade',
      refresh: 'Uppdatera',
      noShares: 'Inga delningar ännu',
      recipient: 'Mottagare',
      status: 'Status',
      sentAt: 'Skickad',
      openedAt: 'Öppnad',
      respondedAt: 'Besvarad'
    },
    en: {
      title: 'Share Status',
      total: 'Total',
      created: 'Created',
      sent: 'Sent',
      opened: 'Opened',
      responded: 'Responded',
      refresh: 'Refresh',
      noShares: 'No shares yet',
      recipient: 'Recipient',
      status: 'Status',
      sentAt: 'Sent',
      openedAt: 'Opened',
      respondedAt: 'Responded'
    },
    ar: {
      title: 'حالة المشاركة',
      total: 'الإجمالي',
      created: 'تم الإنشاء',
      sent: 'تم الإرسال',
      opened: 'تم الفتح',
      responded: 'تم الرد',
      refresh: 'تحديث',
      noShares: 'لا توجد مشاركات بعد',
      recipient: 'المستلم',
      status: 'الحالة',
      sentAt: 'تم الإرسال',
      openedAt: 'تم الفتح',
      respondedAt: 'تم الرد'
    }
  };

  const t = txt[language] || txt.sv;

  const fetchShares = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/nomination-shares?workshop_id=${workshopId}`);
      if (response.ok) {
        const data = await response.json();
        setShares(data.shares);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching shares:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workshopId) {
      fetchShares();
    }
  }, [workshopId]);

  const getStatusColor = (status) => {
    const colors = {
      created: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      opened: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.created;
  };

  const getStatusIcon = (status) => {
    const icons = {
      created: <Clock className="h-3 w-3" />,
      sent: <Send className="h-3 w-3" />,
      opened: <Eye className="h-3 w-3" />,
      responded: <CheckCircle className="h-3 w-3" />
    };
    return icons[status] || icons.created;
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-haggai border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (shares.length === 0) {
    return null;
  }

  return (
    <Card className={`border-0 shadow-lg ${isRTL ? 'rtl' : 'ltr'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-haggai" />
            {t.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchShares}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-stone-50 rounded-lg">
            <div className="text-2xl font-bold text-stone-800">{stats.total || 0}</div>
            <div className="text-xs text-stone-500">{t.total}</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.sent || 0}</div>
            <div className="text-xs text-blue-500">{t.sent}</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.opened || 0}</div>
            <div className="text-xs text-yellow-500">{t.opened}</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.responded || 0}</div>
            <div className="text-xs text-green-500">{t.responded}</div>
          </div>
        </div>

        {/* Expanded List */}
        {expanded && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {shares.map((share, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-haggai/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-haggai" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{share.recipient_name}</p>
                    <p className="text-xs text-stone-500">{share.recipient_contact}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(share.status)} flex items-center gap-1`}>
                  {getStatusIcon(share.status)}
                  {t[share.status] || share.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NominationShareStatus;
