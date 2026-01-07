import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Star, Globe, Home } from 'lucide-react';
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

const EventCalendar = () => {
  const { t, language, isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });

  const translatedEvents = eventsTranslations[language] || eventsTranslations.sv;
  
  // Merge translated content with event data
  const localizedEvents = events.map(event => {
    const translation = translatedEvents.find(te => te.id === event.id);
    return {
      ...event,
      title: translation?.title || event.title,
      description: translation?.description || event.description
    };
  });

  const eventDates = events.map(e => new Date(e.date));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    // Mock registration - store in localStorage
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    registrations.push({
      ...registrationData,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
    
    toast.success(t('calendar.successTitle'), {
      description: `${t('calendar.successDesc')} ${selectedEvent.title}`
    });
    setIsDialogOpen(false);
    setRegistrationData({ name: '', email: '', phone: '', organization: '', message: '' });
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
                  return (
                    <Card 
                      key={event.id} 
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <CardContent className="p-0">
                        <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                          {/* Date Badge */}
                          <div className="md:w-32 bg-haggai text-cream-50 p-6 flex flex-col items-center justify-center">
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
                            <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-haggai transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-stone-600 mb-4">{event.description}</p>
                            
                            <div className={`flex flex-wrap gap-4 text-sm text-stone-500 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Clock className={`h-4 w-4 text-haggai ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {event.time}
                              </span>
                              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <MapPin className={`h-4 w-4 text-haggai ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {event.location}
                              </span>
                              <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Users className={`h-4 w-4 text-haggai ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                {event.spotsLeft} {t('calendar.spotsOf')} {event.spots} {t('calendar.spotsLeft')}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action */}
                          <div className="md:w-40 p-6 flex items-center justify-center bg-cream-50">
                            <Button className="bg-haggai hover:bg-haggai-dark text-cream-50 rounded-xl">
                              {t('calendar.signUp')}
                            </Button>
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
              {selectedEvent?.title} - {selectedEvent && new Date(selectedEvent.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'sv-SE')}
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
    </div>
  );
};

export default EventCalendar;
