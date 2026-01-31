import React, { useState, useEffect } from 'react';
import { 
  Share2, Mail, MessageCircle, Phone, Users, Plus, X, Send, 
  Check, Clock, Eye, MessageSquare, Copy, Link2, Smartphone,
  ChevronDown, ChevronUp, UserPlus, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NominationShareDialog = ({ open, onClose, workshopId, workshopTitle }) => {
  const { language, isRTL } = useLanguage();
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState({ name: '', contact: '', contactType: 'phone' });
  const [senderInfo, setSenderInfo] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareResults, setShareResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [contactsSupported, setContactsSupported] = useState(false);

  const txt = {
    sv: {
      title: 'Dela nomineringslänk',
      subtitle: 'Bjud in flera personer att nominera deltagare',
      recipients: 'Mottagare',
      addRecipient: 'Lägg till mottagare',
      name: 'Namn',
      contact: 'Telefon eller e-post',
      phone: 'Telefon',
      email: 'E-post',
      yourInfo: 'Din information (inbjudare)',
      yourName: 'Ditt namn',
      yourEmail: 'Din e-post (valfritt)',
      yourPhone: 'Ditt telefon (valfritt)',
      message: 'Meddelande (valfritt)',
      messagePlaceholder: 'Skriv ett personligt meddelande...',
      selectFromContacts: 'Välj från kontakter',
      addManually: 'Lägg till manuellt',
      sendVia: 'Skicka via',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      messenger: 'Messenger',
      copyLink: 'Kopiera länk',
      shareSystem: 'Dela...',
      createLinks: 'Skapa inbjudningar',
      noRecipients: 'Lägg till minst en mottagare',
      linksCopied: 'Länk kopierad!',
      linksCreated: 'Inbjudningar skapade! Registreringslänkar genererade.',
      sendNow: 'Skicka nu',
      results: 'Registreringslänkar',
      registrationLink: 'Registreringslänk',
      status: {
        created: 'Skapad',
        sent: 'Skickad',
        opened: 'Öppnad',
        responded: 'Registrerad'
      },
      close: 'Stäng',
      remove: 'Ta bort'
    },
    en: {
      title: 'Invite multiple participants',
      subtitle: 'Create invitations and send registration links to multiple people',
      recipients: 'Recipients',
      addRecipient: 'Add recipient',
      name: 'Name',
      contact: 'Phone or email',
      phone: 'Phone',
      email: 'Email',
      yourInfo: 'Your information',
      yourName: 'Your name',
      yourEmail: 'Your email (optional)',
      yourPhone: 'Your phone (optional)',
      message: 'Message (optional)',
      messagePlaceholder: 'Write a personal message...',
      selectFromContacts: 'Select from contacts',
      addManually: 'Add manually',
      sendVia: 'Send via',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      messenger: 'Messenger',
      copyLink: 'Copy link',
      shareSystem: 'Share...',
      createLinks: 'Create links',
      noRecipients: 'Add at least one recipient',
      linksCopied: 'Links copied!',
      linksCreated: 'Links created!',
      sendNow: 'Send now',
      results: 'Results',
      status: {
        created: 'Created',
        sent: 'Sent',
        opened: 'Opened',
        responded: 'Responded'
      },
      close: 'Close',
      remove: 'Remove'
    },
    ar: {
      title: 'مشاركة رابط الترشيح',
      subtitle: 'ادعُ عدة أشخاص لترشيح المشاركين',
      recipients: 'المستلمون',
      addRecipient: 'إضافة مستلم',
      name: 'الاسم',
      contact: 'الهاتف أو البريد الإلكتروني',
      phone: 'هاتف',
      email: 'بريد إلكتروني',
      yourInfo: 'معلوماتك',
      yourName: 'اسمك',
      yourEmail: 'بريدك الإلكتروني (اختياري)',
      yourPhone: 'هاتفك (اختياري)',
      message: 'رسالة (اختياري)',
      messagePlaceholder: 'اكتب رسالة شخصية...',
      selectFromContacts: 'اختر من جهات الاتصال',
      addManually: 'إضافة يدوياً',
      sendVia: 'إرسال عبر',
      sms: 'رسالة نصية',
      whatsapp: 'واتساب',
      messenger: 'ماسنجر',
      copyLink: 'نسخ الرابط',
      shareSystem: 'مشاركة...',
      createLinks: 'إنشاء الروابط',
      noRecipients: 'أضف مستلماً واحداً على الأقل',
      linksCopied: 'تم نسخ الروابط!',
      linksCreated: 'تم إنشاء الروابط!',
      sendNow: 'إرسال الآن',
      results: 'النتائج',
      status: {
        created: 'تم الإنشاء',
        sent: 'تم الإرسال',
        opened: 'تم الفتح',
        responded: 'تم الرد'
      },
      close: 'إغلاق',
      remove: 'إزالة'
    }
  };

  const t = txt[language] || txt.sv;

  useEffect(() => {
    // Check if Contact Picker API is supported
    if ('contacts' in navigator && 'ContactsManager' in window) {
      setContactsSupported(true);
    }
  }, []);

  const handleSelectContacts = async () => {
    if (!contactsSupported) {
      toast.error('Contact selection is not supported in this browser');
      return;
    }

    try {
      const props = ['name', 'email', 'tel'];
      const opts = { multiple: true };
      const contacts = await navigator.contacts.select(props, opts);
      
      const newRecipients = contacts.map(contact => ({
        name: contact.name?.[0] || '',
        contact: contact.tel?.[0] || contact.email?.[0] || '',
        contactType: contact.tel?.[0] ? 'phone' : 'email'
      })).filter(r => r.name && r.contact);
      
      setRecipients([...recipients, ...newRecipients]);
    } catch (err) {
      console.error('Contact selection cancelled or failed:', err);
    }
  };

  const addRecipient = () => {
    if (!newRecipient.name || !newRecipient.contact) {
      toast.error(t.noRecipients);
      return;
    }
    
    // Detect contact type
    const isEmail = newRecipient.contact.includes('@');
    const contactType = isEmail ? 'email' : 'phone';
    
    setRecipients([...recipients, { ...newRecipient, contactType }]);
    setNewRecipient({ name: '', contact: '', contactType: 'phone' });
  };

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const createShareLinks = async () => {
    if (recipients.length === 0) {
      toast.error(t.noRecipients);
      return;
    }
    
    if (!senderInfo.name) {
      toast.error(language === 'ar' ? 'الرجاء إدخال اسمك' : 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/nomination-shares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshop_id: workshopId,
          recipients: recipients.map(r => ({
            name: r.name,
            contact: r.contact,
            contact_type: r.contactType
          })),
          sender_name: senderInfo.name,
          sender_email: senderInfo.email,
          sender_phone: senderInfo.phone,
          message: message
        })
      });

      if (response.ok) {
        const data = await response.json();
        setShareResults(data.shares);
        setShowResults(true);
        toast.success(t.linksCreated);
      } else {
        toast.error('Failed to create links');
      }
    } catch (err) {
      console.error('Error creating share links:', err);
      toast.error('Error creating links');
    } finally {
      setLoading(false);
    }
  };

  const safeCopyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // Fallback below
    }
    
    // Fallback method
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (e) {
      return false;
    }
  };

  const copyLink = async (link) => {
    const success = await safeCopyToClipboard(link);
    if (success) {
      toast.success(t.linksCopied);
    } else {
      toast.error('Could not copy link');
    }
  };

  const copyAllLinks = async () => {
    const allLinks = shareResults.map(s => `${s.recipient_name}: ${s.link}`).join('\n');
    const success = await safeCopyToClipboard(allLinks);
    if (success) {
      toast.success(t.linksCopied);
    } else {
      toast.error('Could not copy links');
    }
  };

  const sendViaSMS = (recipient, link) => {
    const smsBody = encodeURIComponent(`${senderInfo.name} ${language === 'ar' ? 'يدعوك للترشيح' : language === 'sv' ? 'bjuder in dig' : 'invites you to nominate'}: ${link}`);
    let phone = recipient.recipient_contact.replace(/[^0-9+]/g, '');
    
    // Keep original format for SMS (local format works better)
    window.open(`sms:${phone}?body=${smsBody}`, '_blank');
    markAsSent(recipient.id);
  };

  const sendViaWhatsApp = (recipient, link) => {
    const text = encodeURIComponent(`${senderInfo.name} ${language === 'ar' ? 'يدعوك للترشيح في' : language === 'sv' ? 'bjuder in dig till' : 'invites you to nominate for'} ${workshopTitle}:\n\n${message ? message + '\n\n' : ''}${link}`);
    let phone = recipient.recipient_contact.replace(/[^0-9+]/g, '');
    
    // Convert Swedish phone number format (07...) to international format (467...)
    if (phone.startsWith('07') && phone.length === 10) {
      phone = '46' + phone.substring(1);
    } else if (phone.startsWith('0') && !phone.startsWith('00')) {
      // Other Swedish numbers starting with 0
      phone = '46' + phone.substring(1);
    } else if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }
    
    const whatsappUrl = `https://wa.me/${phone}?text=${text}`;
    console.log('WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
    markAsSent(recipient.id);
  };

  const sendViaEmail = async (recipient) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nomination-shares/send-email?share_id=${recipient.id}&recipient_email=${recipient.recipient_contact}&recipient_name=${recipient.recipient_name}&sender_name=${senderInfo.name}&workshop_title=${workshopTitle}&link=${recipient.link}&message=${message || ''}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success(`Email sent to ${recipient.recipient_name}`);
        updateShareStatus(recipient.id, 'sent');
      }
    } catch (err) {
      toast.error('Failed to send email');
    }
  };

  const shareViaSystem = async (recipient, link) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: workshopTitle,
          text: `${senderInfo.name} ${language === 'ar' ? 'يدعوك للترشيح' : 'invites you to nominate'}`,
          url: link
        });
        markAsSent(recipient.id);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyLink(link);
    }
  };

  const markAsSent = async (shareId) => {
    try {
      await fetch(`${BACKEND_URL}/api/nomination-shares/${shareId}/mark-sent`, {
        method: 'PUT'
      });
      updateShareStatus(shareId, 'sent');
    } catch (err) {
      console.error('Error marking as sent:', err);
    }
  };

  const updateShareStatus = (shareId, status) => {
    setShareResults(prev => prev.map(s => 
      s.id === shareId ? { ...s, status } : s
    ));
  };

  const getStatusBadge = (status) => {
    const colors = {
      created: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      opened: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800'
    };
    const icons = {
      created: <Clock className="h-3 w-3" />,
      sent: <Send className="h-3 w-3" />,
      opened: <Eye className="h-3 w-3" />,
      responded: <CheckCircle className="h-3 w-3" />
    };
    
    return (
      <Badge className={`${colors[status]} flex items-center gap-1`}>
        {icons[status]}
        {t.status[status]}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-haggai" />
            {t.title}
          </DialogTitle>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t.yourInfo}</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder={t.yourName + ' *'}
                  value={senderInfo.name}
                  onChange={(e) => setSenderInfo({ ...senderInfo, name: e.target.value })}
                />
                <Input
                  placeholder={t.yourEmail}
                  type="email"
                  value={senderInfo.email}
                  onChange={(e) => setSenderInfo({ ...senderInfo, email: e.target.value })}
                />
                <Input
                  placeholder={t.yourPhone}
                  type="tel"
                  value={senderInfo.phone}
                  onChange={(e) => setSenderInfo({ ...senderInfo, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{t.recipients}</Label>
                <div className="flex gap-2">
                  {contactsSupported && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectContacts}
                      className="text-haggai border-haggai"
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      {t.selectFromContacts}
                    </Button>
                  )}
                </div>
              </div>

              {/* Recipients List */}
              {recipients.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-haggai/10 p-2 rounded-full">
                          {recipient.contactType === 'email' ? 
                            <Mail className="h-4 w-4 text-haggai" /> : 
                            <Phone className="h-4 w-4 text-haggai" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{recipient.name}</p>
                          <p className="text-xs text-stone-500">{recipient.contact}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Recipient Form */}
              <div className="flex gap-2">
                <Input
                  placeholder={t.name}
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder={t.contact}
                  value={newRecipient.contact}
                  onChange={(e) => setNewRecipient({ ...newRecipient, contact: e.target.value })}
                  className="flex-1"
                />
                <Button onClick={addRecipient} variant="outline" className="text-haggai border-haggai">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>{t.message}</Label>
              <Textarea
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Create Links Button */}
            <Button
              onClick={createShareLinks}
              disabled={loading || recipients.length === 0}
              className="w-full bg-haggai hover:bg-haggai-dark text-white h-12"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Link2 className="h-5 w-5 mr-2" />
                  {t.createLinks} ({recipients.length})
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{t.results}</h3>
              <Button variant="outline" size="sm" onClick={copyAllLinks}>
                <Copy className="h-4 w-4 mr-1" />
                {t.copyLink}
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {shareResults?.map((share, index) => (
                <Card key={index} className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-haggai/10 p-2 rounded-full">
                          <Users className="h-4 w-4 text-haggai" />
                        </div>
                        <div>
                          <p className="font-medium">{share.recipient_name}</p>
                          <p className="text-xs text-stone-500">{share.recipient_contact}</p>
                        </div>
                      </div>
                      {getStatusBadge(share.status)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(share.link)}
                        className="text-stone-600"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t.copyLink}
                      </Button>
                      
                      {share.recipient_contact && !share.recipient_contact.includes('@') && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendViaSMS(share, share.link)}
                            className="text-blue-600 border-blue-200"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {t.sms}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendViaWhatsApp(share, share.link)}
                            className="text-green-600 border-green-200"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {t.whatsapp}
                          </Button>
                        </>
                      )}
                      
                      {share.recipient_contact?.includes('@') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendViaEmail(share)}
                          className="text-purple-600 border-purple-200"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {t.email}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareViaSystem(share, share.link)}
                        className="text-haggai border-haggai"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        {t.shareSystem}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setShareResults(null);
                  setRecipients([]);
                }}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t.addRecipient}
              </Button>
              <Button onClick={onClose} className="flex-1 bg-haggai">
                {t.close}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NominationShareDialog;
