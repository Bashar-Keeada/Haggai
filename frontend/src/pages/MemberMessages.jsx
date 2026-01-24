import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, User, Send, MessageSquare, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MemberMessages = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { partnerId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const messagesEndRef = useRef(null);

  const translations = {
    sv: {
      title: 'Meddelanden',
      back: 'Tillbaka',
      inbox: 'Inkorg',
      noMessages: 'Inga meddelanden ännu',
      noMessagesDesc: 'Besök medlemskatalogen för att hitta och kontakta andra medlemmar',
      viewMembers: 'Visa medlemmar',
      typeMessage: 'Skriv ett meddelande...',
      send: 'Skicka',
      unread: 'olästa',
      startConversation: 'Starta en konversation',
      selectConversation: 'Välj en konversation från listan'
    },
    en: {
      title: 'Messages',
      back: 'Back',
      inbox: 'Inbox',
      noMessages: 'No messages yet',
      noMessagesDesc: 'Visit the member directory to find and contact other members',
      viewMembers: 'View members',
      typeMessage: 'Type a message...',
      send: 'Send',
      unread: 'unread',
      startConversation: 'Start a conversation',
      selectConversation: 'Select a conversation from the list'
    },
    ar: {
      title: 'الرسائل',
      back: 'رجوع',
      inbox: 'البريد الوارد',
      noMessages: 'لا توجد رسائل بعد',
      noMessagesDesc: 'قم بزيارة دليل الأعضاء للعثور على أعضاء آخرين والتواصل معهم',
      viewMembers: 'عرض الأعضاء',
      typeMessage: 'اكتب رسالة...',
      send: 'إرسال',
      unread: 'غير مقروء',
      startConversation: 'ابدأ محادثة',
      selectConversation: 'اختر محادثة من القائمة'
    }
  };

  const txt = translations[language] || translations.sv;

  useEffect(() => {
    fetchData();
  }, [partnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchData = async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/medlem-login');
      return;
    }

    try {
      // Get current member
      const meRes = await fetch(`${BACKEND_URL}/api/members/me?token=${token}`);
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentMemberId(meData.id);
      }

      // Get all conversations
      const convRes = await fetch(`${BACKEND_URL}/api/messages?token=${token}`);
      if (convRes.ok) {
        const convData = await convRes.json();
        setConversations(convData);
      }

      // If partnerId is provided, fetch that conversation
      if (partnerId) {
        const msgRes = await fetch(`${BACKEND_URL}/api/messages/${partnerId}?token=${token}`);
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages);
          setCurrentConversation(msgData.partner);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Kunde inte hämta meddelanden');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !partnerId) return;

    setSending(true);
    const token = localStorage.getItem('memberToken');

    try {
      const response = await fetch(`${BACKEND_URL}/api/messages?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: partnerId,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Refresh messages
        const msgRes = await fetch(`${BACKEND_URL}/api/messages/${partnerId}?token=${token}`);
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData.messages);
        }
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunde inte skicka meddelande');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ett fel uppstod');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haggai"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-haggai-50 via-cream-50 to-cream-100 pt-16 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-haggai text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/mina-sidor')}
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {txt.back}
          </Button>
          <h1 className="text-2xl font-bold">{txt.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          {/* Conversations List */}
          <Card className="border-0 shadow-lg md:col-span-1 overflow-hidden">
            <CardHeader className="bg-stone-50 border-b">
              <CardTitle className="text-lg">{txt.inbox}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto h-full">
              {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">{txt.noMessages}</p>
                  <p className="text-stone-400 text-xs mt-1">{txt.noMessagesDesc}</p>
                  <Link to="/mina-sidor/medlemmar">
                    <Button variant="outline" size="sm" className="mt-4">
                      {txt.viewMembers}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <Link
                      key={conv.partner?.id}
                      to={`/mina-sidor/meddelanden/${conv.partner?.id}`}
                      className={`block p-4 hover:bg-stone-50 transition-colors ${
                        partnerId === conv.partner?.id ? 'bg-haggai/5 border-l-4 border-haggai' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                          {conv.partner?.profile_image ? (
                            <img src={conv.partner.profile_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-stone-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-stone-800 truncate">{conv.partner?.full_name}</p>
                            {conv.unread_count > 0 && (
                              <Badge className="bg-red-500 text-white text-xs">
                                {conv.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-stone-500 truncate">
                            {conv.last_message?.content?.substring(0, 30)}...
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="border-0 shadow-lg md:col-span-2 flex flex-col overflow-hidden">
            {partnerId && currentConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="bg-stone-50 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                      {currentConversation.profile_image ? (
                        <img src={currentConversation.profile_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">{currentConversation.full_name}</p>
                      {currentConversation.city && (
                        <p className="text-sm text-stone-500">{currentConversation.city}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentMemberId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender_id === currentMemberId
                            ? 'bg-haggai text-white rounded-br-sm'
                            : 'bg-stone-100 text-stone-800 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === currentMemberId ? 'text-white/70' : 'text-stone-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t bg-stone-50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={txt.typeMessage}
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()} className="bg-haggai hover:bg-haggai-dark">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-stone-200 mx-auto mb-4" />
                  <p className="text-stone-400">{txt.selectConversation}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberMessages;
