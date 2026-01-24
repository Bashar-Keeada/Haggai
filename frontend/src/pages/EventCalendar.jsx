import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Star, Globe, Home, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { eventsTranslations } from '../data/translations';
import { events } from '../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EventCalendar = () => {
  const { t, language, isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
  const [nominationEvent, setNominationEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });

  const [nominationData, setNominationData] = useState({
    nominator_name: '',
    nominator_email: '',
    nominator_phone: '',
    nominator_church: '',
    nominator_relation: '',
    nominee_name: '',
    nominee_email: '',
    nominee_phone: '',
    nominee_church: '',
    nominee_role: '',
    nominee_activities: '',
    motivation: ''
  });

  const nominationTranslations = {
    sv: {
      nominateButton: 'Nominera',
      nominateTitle: 'Nominera en person',
      nominateSubtitle: 'Rekommendera någon till denna utbildning. Din nominering granskas av admin innan den skickas vidare.',
      nominatorSection: 'Dina uppgifter (du som nominerar)',
      nomineeSection: 'Den du nominerar',
      yourName: 'Ditt namn',
      yourEmail: 'Din e-post',
      yourPhone: 'Ditt telefonnummer',
      yourChurch: 'Din kyrka/församling',
      yourRelation: 'Din relation till den nominerade',
      yourRelationPlaceholder: 'T.ex. pastor, vän, kollega, mentor...',
      nomineeName: 'Personens namn',
      nomineeEmail: 'Personens e-post',
      nomineePhone: 'Personens telefonnummer',
      nomineeChurch: 'Personens kyrka/församling',
      nomineeRole: 'Roll/ansvar i kyrkan',
      nomineeRolePlaceholder: 'T.ex. ungdomsledare, diakon, söndagsskolelärare...',
      nomineeActivities: 'Aktiviteter och engagemang',
      nomineeActivitiesPlaceholder: 'Beskriv personens aktiviteter och engagemang i kyrkan och samhället...',
      motivation: 'Motivering till nomineringen',
      motivationPlaceholder: 'Varför rekommenderar du denna person? Vad gör personen lämplig för programmet?',
      submit: 'Skicka nominering',
      submitting: 'Skickar...',
      cancel: 'Avbryt',
      successTitle: 'Nominering skickad!',
      successDesc: 'Tack! Din nominering har skickats till admin för granskning. Du får besked via e-post när nomineringen har behandlats.',
      errorTitle: 'Något gick fel',
      errorDesc: 'Kunde inte skicka nomineringen. Försök igen.',
      pendingNote: 'Nomineringen granskas av admin innan inbjudan skickas till den nominerade.',
      defaultMotivation: ''
    },
    en: {
      nominateButton: 'Nominate',
      nominateTitle: 'Nominate a person',
      nominateSubtitle: 'Recommend someone for this training. Your nomination will be reviewed by admin before being sent.',
      nominatorSection: 'Your details (nominator)',
      nomineeSection: 'Person you are nominating',
      yourName: 'Your name',
      yourEmail: 'Your email',
      yourPhone: 'Your phone',
      yourChurch: 'Your church/congregation',
      yourRelation: 'Your relation to the nominee',
      yourRelationPlaceholder: 'E.g. pastor, friend, colleague, mentor...',
      nomineeName: 'Person\'s name',
      nomineeEmail: 'Person\'s email',
      nomineePhone: 'Person\'s phone',
      nomineeChurch: 'Person\'s church/congregation',
      nomineeRole: 'Role/responsibility in church',
      nomineeRolePlaceholder: 'E.g. youth leader, deacon, Sunday school teacher...',
      nomineeActivities: 'Activities and engagement',
      nomineeActivitiesPlaceholder: 'Describe the person\'s activities and engagement in church and community...',
      motivation: 'Motivation for nomination',
      motivationPlaceholder: 'Why do you recommend this person? What makes them suitable for the program?',
      submit: 'Submit nomination',
      submitting: 'Submitting...',
      cancel: 'Cancel',
      successTitle: 'Nomination submitted!',
      successDesc: 'Thank you! Your nomination has been sent to admin for review. You will be notified via email when the nomination has been processed.',
      errorTitle: 'Something went wrong',
      errorDesc: 'Could not submit the nomination. Please try again.',
      pendingNote: 'The nomination is reviewed by admin before the invitation is sent to the nominee.',
      defaultMotivation: ''
    },
    ar: {
      nominateButton: 'رشّح',
      nominateTitle: 'رشّح شخصًا',
      nominateSubtitle: 'وصي بشخص لهذا التدريب',
      nominatorSection: 'بياناتك (المُرشِّح)',
      nomineeSection: 'الشخص الذي ترشحه',
      yourName: 'اسمك',
      yourEmail: 'بريدك الإلكتروني',
      yourPhone: 'رقم هاتفك',
      nomineeName: 'اسم الشخص',
      nomineeEmail: 'بريد الشخص الإلكتروني',
      nomineePhone: 'رقم هاتف الشخص',
      motivation: 'السبب (يمكن تعديله)',
      motivationPlaceholder: 'لماذا توصي بهذا الشخص؟',
      submit: 'إرسال الترشيح',
      submitting: 'جاري الإرسال...',
      cancel: 'إلغاء',
      successTitle: 'تم إرسال الترشيح!',
      successDesc: 'شكرًا لترشيحك إلى',
      errorTitle: 'حدث خطأ',
      errorDesc: 'تعذر إرسال الترشيح. حاول مرة أخرى.',
      defaultMotivation: `أود أن أعبّر لك بكل قناعة عن رغبتي القوية في ترشيحك لهذا البرنامج القيادي، لأنني أرى فيك إمكانيات حقيقية وتأثيرًا واضحًا فيمن حولك. هذا البرنامج يتميّز بطابعه المسكوني، إذ يجمع قادة مسيحيين من مختلف الكنائس والطوائف، دون أن يكون تابعًا لكنيسة بعينها، مما يمنح المشاركين خبرة غنية ومتوازنة قائمة على الاحترام والتعلّم المشترك.

أكثر ما يميّز هذه التجربة هو أنها لا تسعى إلى تغيير انتمائك الكنسي أو هويتك، بل على العكس، تهدف إلى تأهيلك للعودة إلى كنيستك بخبرة جديدة، ورؤية أوسع، وأدوات عملية تساعدك على قيادة مجموعتك بشكل أعمق، وأكثر فاعلية، وبوتيرة أسرع في مواجهة التحديات.

أنا على ثقة بأن مشاركتك في هذا البرنامج ستمنحك نموًا شخصيًا وروحيًا، وستعزّز قدرتك على التأثير، والخدمة، وقيادة الآخرين بحكمة ومسؤولية، لما فيه خير الكنيسة التي تخدمها، ولخير الجسد المسيحي بأكمله.`
    }
  };

  const nomTxt = nominationTranslations[language] || nominationTranslations.sv;

  const translatedEvents = eventsTranslations[language] || eventsTranslations.sv;
  
  // Helper to get localized text from object or string
  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field.sv || field.en || '';
  };

  // Merge translated content with event data
  const localizedEvents = events.map(event => {
    const translation = translatedEvents.find(te => te.id === event.id);
    // Use getLocalizedText for multilingual objects, fallback to translation for legacy events
    const title = typeof event.title === 'object' ? getLocalizedText(event.title) : (translation?.title || event.title);
    const description = typeof event.description === 'object' ? getLocalizedText(event.description) : (translation?.description || event.description);
    
    return {
      ...event,
      title: title,
      description: description,
      time: getLocalizedText(event.time),
      location: getLocalizedText(event.location)
    };
  });

  const eventDates = events.map(e => new Date(e.date));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleNominateClick = (event, e) => {
    e.stopPropagation(); // Prevent event card click
    setNominationEvent(event);
    // Set default motivation text
    setNominationData(prev => ({
      ...prev,
      motivation: nomTxt.defaultMotivation || ''
    }));
    setIsNominationDialogOpen(true);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    // Mock registration - store in localStorage
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    registrations.push({
      ...registrationData,
      eventId: selectedEvent.id,
      eventTitle: getLocalizedText(selectedEvent.title),
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
    
    toast.success(t('calendar.successTitle'), {
      description: `${t('calendar.successDesc')} ${getLocalizedText(selectedEvent.title)}`
    });
    setIsDialogOpen(false);
    setRegistrationData({ name: '', email: '', phone: '', organization: '', message: '' });
  };

  const handleNominationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/nominations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: nominationEvent.id.toString(),
          event_title: getLocalizedText(nominationEvent.title),
          event_date: nominationEvent.date,
          ...nominationData
        }),
      });

      if (response.ok) {
        toast.success(nomTxt.successTitle, {
          description: `${nomTxt.successDesc} ${getLocalizedText(nominationEvent.title)}`
        });
        setIsNominationDialogOpen(false);
        setNominationData({
          nominator_name: '',
          nominator_email: '',
          nominator_phone: '',
          nominee_name: '',
          nominee_email: '',
          nominee_phone: '',
          motivation: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error(nomTxt.errorTitle, {
        description: nomTxt.errorDesc
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocaleDateString = (dateStr) => {
    const date = new Date(dateStr);
    const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE';
    return {
      day: date.getDate(),
      month: date.toLocaleDateString(locale, { month: 'short' }),
      year: date.getFullYear()
    };
  };

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <span className="text-haggai font-medium text-sm tracking-wider uppercase mb-4 block">{t('calendar.title')}</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">{t('calendar.heading')}</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {t('calendar.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-3 gap-12 ${isRTL ? 'direction-rtl' : ''}`}>
            {/* Calendar Widget */}
            <div className={`lg:col-span-1 ${isRTL ? 'order-2 lg:order-1' : ''}`}>
              <Card className="border-0 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h3 className={`text-lg font-semibold text-stone-800 mb-4 flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <CalendarIcon className={`h-5 w-5 text-haggai ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('calendar.selectDate')}
                  </h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg"
                    modifiers={{
                      hasEvent: eventDates
                    }}
                    modifiersClassNames={{
                      hasEvent: 'bg-haggai-100 text-haggai-dark font-bold'
                    }}
                  />
                  <div className="mt-4 p-4 bg-cream-50 rounded-lg">
                    <div className={`flex items-center space-x-2 text-sm text-stone-600 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                      <div className="w-3 h-3 bg-haggai-100 rounded" />
                      <span>{t('calendar.datesWithEvents')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div className={`lg:col-span-2 ${isRTL ? 'order-1 lg:order-2 text-right' : ''}`}>
              <h2 className="text-2xl font-bold text-stone-800 mb-8">{t('calendar.allEvents')}</h2>
              <div className="space-y-6">
                {localizedEvents.map((event) => {
                  const dateInfo = getLocaleDateString(event.date);
                  const isLeaderExperience = event.type === 'leader-experience';
                  const isInternational = event.programType === 'international';
                  
                  return (
                    <Card 
                      key={event.id} 
                      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
                        isLeaderExperience ? 'ring-2 ring-haggai ring-offset-2' : ''
                      }`}
                      onClick={() => handleEventClick(event)}
                    >
                      <CardContent className="p-0">
                        <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                          {/* Date Badge */}
                          <div className={`md:w-32 ${isLeaderExperience ? 'bg-gradient-to-br from-haggai to-haggai-dark' : 'bg-haggai'} text-cream-50 p-6 flex flex-col items-center justify-center relative`}>
                            {isLeaderExperience && (
                              <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-300 fill-yellow-300" />
                            )}
                            <span className="text-4xl font-bold">
                              {dateInfo.day}
                            </span>
                            <span className="text-sm uppercase tracking-wider">
                              {dateInfo.month}
                            </span>
                            <span className="text-xs mt-1 opacity-80">
                              {dateInfo.year}
                            </span>
                          </div>
                          
                          {/* Event Details */}
                          <div className={`flex-1 p-6 ${isRTL ? 'text-right' : ''}`}>
                            <div className={`flex items-center gap-2 mb-2 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              {isLeaderExperience && (
                                <Badge className={`${isInternational ? 'bg-blue-100 text-blue-800' : 'bg-violet-100 text-violet-800'}`}>
                                  {isInternational ? (
                                    <><Globe className="h-3 w-3 mr-1" /> {language === 'sv' ? 'Internationellt' : language === 'ar' ? 'دولي' : 'International'}</>
                                  ) : (
                                    <><Home className="h-3 w-3 mr-1" /> {language === 'sv' ? 'Nationellt' : language === 'ar' ? 'وطني' : 'National'}</>
                                  )}
                                </Badge>
                              )}
                              {/* Target group badge */}
                              {event.targetGroup === 'women' && (
                                <Badge className="bg-pink-100 text-pink-700">
                                  ♀ {language === 'sv' ? 'Kvinnor' : language === 'ar' ? 'نساء' : 'Women'}
                                </Badge>
                              )}
                              {event.targetGroup === 'men' && (
                                <Badge className="bg-blue-100 text-blue-700">
                                  ♂ {language === 'sv' ? 'Män' : language === 'ar' ? 'رجال' : 'Men'}
                                </Badge>
                              )}
                              {isLeaderExperience && (
                                <Badge className="bg-haggai-100 text-haggai-dark">
                                  Leader Experience
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-haggai transition-colors">
                              {getLocalizedText(event.title)}
                            </h3>
                            <p className="text-stone-600 mb-4">{getLocalizedText(event.description)}</p>
                            
                            <div className={`flex flex-wrap gap-4 text-sm text-stone-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Clock className={`h-4 w-4 text-haggai ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {getLocalizedText(event.time)}
                              </span>
                              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <MapPin className={`h-4 w-4 text-haggai ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {getLocalizedText(event.location)}
                              </span>
                              {event.spots && (
                                <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <Users className={`h-4 w-4 text-haggai ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                  {event.spotsLeft} {t('calendar.spotsOf')} {event.spots} {t('calendar.spotsLeft')}
                                </span>
                              )}
                            </div>
                            
                            {/* Price display */}
                            {event.price && (
                              <div className="mt-3">
                                <Badge className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1">
                                  {event.price} {event.currency || 'SEK'}
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="md:w-48 p-6 flex flex-col items-center justify-center gap-3 bg-cream-50">
                            <Button 
                              className="w-full bg-haggai hover:bg-haggai-dark text-cream-50 rounded-xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              {t('calendar.signUp')}
                            </Button>
                            {isLeaderExperience && (
                              <Button 
                                variant="outline"
                                className="w-full border-haggai text-haggai hover:bg-haggai hover:text-white rounded-xl"
                                onClick={(e) => handleNominateClick(event, e)}
                                data-testid={`nominate-btn-${event.id}`}
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                {nomTxt.nominateButton}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle className="text-2xl text-stone-800">{t('calendar.registerTitle')}</DialogTitle>
            <DialogDescription className="text-stone-600">
              {getLocalizedText(selectedEvent?.title)} - {selectedEvent && new Date(selectedEvent.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE')}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRegistration} className={`space-y-4 mt-4 ${isRTL ? 'text-right' : ''}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">{t('calendar.name')} *</Label>
                <Input
                  id="reg-name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                  required
                  className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">{t('calendar.email')} *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  required
                  className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-phone">{t('calendar.phone')}</Label>
                <Input
                  id="reg-phone"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-org">{t('calendar.organization')}</Label>
                <Input
                  id="reg-org"
                  value={registrationData.organization}
                  onChange={(e) => setRegistrationData({ ...registrationData, organization: e.target.value })}
                  className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-message">{t('calendar.message')}</Label>
              <Textarea
                id="reg-message"
                value={registrationData.message}
                onChange={(e) => setRegistrationData({ ...registrationData, message: e.target.value })}
                rows={3}
                className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
              />
            </div>
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 rounded-xl"
              >
                {t('calendar.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-haggai hover:bg-haggai-dark text-cream-50 rounded-xl"
              >
                {t('calendar.submit')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Nomination Dialog */}
      <Dialog open={isNominationDialogOpen} onOpenChange={setIsNominationDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className={isRTL ? 'text-right' : ''}>
            <DialogTitle className="text-2xl text-stone-800 flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-haggai" />
              {nomTxt.nominateTitle}
            </DialogTitle>
            <DialogDescription className="text-stone-600">
              {nomTxt.nominateSubtitle}
            </DialogDescription>
            {nominationEvent && (
              <Badge className="w-fit mt-2 bg-haggai text-white">
                {getLocalizedText(nominationEvent.title)}
              </Badge>
            )}
          </DialogHeader>
          
          <form onSubmit={handleNominationSubmit} className={`space-y-6 mt-4 ${isRTL ? 'text-right' : ''}`}>
            {/* Nominator Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-700 border-b pb-2">{nomTxt.nominatorSection}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nominator-name">{nomTxt.yourName} *</Label>
                  <Input
                    id="nominator-name"
                    value={nominationData.nominator_name}
                    onChange={(e) => setNominationData({ ...nominationData, nominator_name: e.target.value })}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nominator-email">{nomTxt.yourEmail} *</Label>
                  <Input
                    id="nominator-email"
                    type="email"
                    value={nominationData.nominator_email}
                    onChange={(e) => setNominationData({ ...nominationData, nominator_email: e.target.value })}
                    required
                    className="rounded-lg"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nominator-phone">{nomTxt.yourPhone}</Label>
                <Input
                  id="nominator-phone"
                  value={nominationData.nominator_phone}
                  onChange={(e) => setNominationData({ ...nominationData, nominator_phone: e.target.value })}
                  className="rounded-lg"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Nominee Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-700 border-b pb-2">{nomTxt.nomineeSection}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nominee-name">{nomTxt.nomineeName} *</Label>
                  <Input
                    id="nominee-name"
                    value={nominationData.nominee_name}
                    onChange={(e) => setNominationData({ ...nominationData, nominee_name: e.target.value })}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nominee-email">{nomTxt.nomineeEmail} *</Label>
                  <Input
                    id="nominee-email"
                    type="email"
                    value={nominationData.nominee_email}
                    onChange={(e) => setNominationData({ ...nominationData, nominee_email: e.target.value })}
                    required
                    className="rounded-lg"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nominee-phone">{nomTxt.nomineePhone}</Label>
                <Input
                  id="nominee-phone"
                  value={nominationData.nominee_phone}
                  onChange={(e) => setNominationData({ ...nominationData, nominee_phone: e.target.value })}
                  className="rounded-lg"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <Label htmlFor="motivation">{nomTxt.motivation}</Label>
              <Textarea
                id="motivation"
                value={nominationData.motivation}
                onChange={(e) => setNominationData({ ...nominationData, motivation: e.target.value })}
                placeholder={nomTxt.motivationPlaceholder}
                rows={8}
                className="rounded-lg text-sm"
              />
            </div>

            {/* Actions */}
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNominationDialogOpen(false)}
                className="flex-1 rounded-xl"
                disabled={isSubmitting}
              >
                {nomTxt.cancel}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-haggai hover:bg-haggai-dark text-cream-50 rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? nomTxt.submitting : nomTxt.submit}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
