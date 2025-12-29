import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { events } from '../data/mock';

const EventCalendar = () => {
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
    
    toast.success('Anmälan skickad!', {
      description: `Du är nu anmäld till ${selectedEvent.title}`
    });
    setIsDialogOpen(false);
    setRegistrationData({ name: '', email: '', phone: '', organization: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">Kalender</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">Kommande Evenemang</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Hitta och anmäl dig till våra utbildningar, workshops och nätverksträffar.
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Calendar Widget */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-amber-700" />
                    Välj datum
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
                      hasEvent: 'bg-amber-100 text-amber-800 font-bold'
                    }}
                  />
                  <div className="mt-4 p-4 bg-cream-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-stone-600">
                      <div className="w-3 h-3 bg-amber-100 rounded" />
                      <span>Datum med evenemang</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-stone-800 mb-8">Alla evenemang</h2>
              <div className="space-y-6">
                {events.map((event) => (
                  <Card 
                    key={event.id} 
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Date Badge */}
                        <div className="md:w-32 bg-amber-700 text-cream-50 p-6 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                          <span className="text-sm uppercase tracking-wider">
                            {new Date(event.date).toLocaleDateString('sv-SE', { month: 'short' })}
                          </span>
                          <span className="text-xs mt-1 opacity-80">
                            {new Date(event.date).getFullYear()}
                          </span>
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1 p-6">
                          <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-amber-700 transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-stone-600 mb-4">{event.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-amber-600" />
                              {event.time}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-amber-600" />
                              {event.location}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-amber-600" />
                              {event.spotsLeft} av {event.spots} platser kvar
                            </span>
                          </div>
                        </div>
                        
                        {/* Action */}
                        <div className="md:w-40 p-6 flex items-center justify-center bg-cream-50">
                          <Button className="bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-xl">
                            Anmäl dig
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-stone-800">Anmäl dig till evenemang</DialogTitle>
            <DialogDescription className="text-stone-600">
              {selectedEvent?.title} - {selectedEvent && new Date(selectedEvent.date).toLocaleDateString('sv-SE')}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleRegistration} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Namn *</Label>
                <Input
                  id="reg-name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">E-post *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  required
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reg-phone">Telefon</Label>
                <Input
                  id="reg-phone"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-org">Organisation/Kyrka</Label>
                <Input
                  id="reg-org"
                  value={registrationData.organization}
                  onChange={(e) => setRegistrationData({ ...registrationData, organization: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-message">Meddelande (valfritt)</Label>
              <Textarea
                id="reg-message"
                value={registrationData.message}
                onChange={(e) => setRegistrationData({ ...registrationData, message: e.target.value })}
                rows={3}
                className="rounded-lg"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 rounded-xl"
              >
                Avbryt
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-xl"
              >
                Skicka anmälan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
