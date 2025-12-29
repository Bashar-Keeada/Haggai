import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { contactInfo } from '../data/mock';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    contactType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - store in localStorage
    const contacts = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    contacts.push({
      ...formData,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('contactMessages', JSON.stringify(contacts));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Meddelande skickat!', {
      description: 'Vi återkommer så snart vi kan.'
    });

    setFormData({ name: '', email: '', phone: '', subject: '', contactType: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">Kontakt</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">Hör av dig till oss</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Har du frågor om våra utbildningar, medlemskap eller något annat? 
              Vi finns här för att hjälpa dig.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-stone-800 mb-6">Kontaktuppgifter</h2>
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">Adress</h3>
                          <p className="text-stone-600">{contactInfo.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">Telefon</h3>
                          <a href={`tel:${contactInfo.phone}`} className="text-amber-700 hover:text-amber-800">
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">E-post</h3>
                          <a href={`mailto:${contactInfo.email}`} className="text-amber-700 hover:text-amber-800">
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-amber-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">Svarstid</h3>
                          <p className="text-stone-600">Vi svarar vanligtvis inom 1-2 arbetsdagar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-stone-800 mb-6">Skicka meddelande</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Namn *</Label>
                        <Input
                          id="contact-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="rounded-lg"
                          placeholder="Ditt namn"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">E-post *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="rounded-lg"
                          placeholder="din@email.se"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Telefon</Label>
                        <Input
                          id="contact-phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-lg"
                          placeholder="070-XXX XX XX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-type">Jag representerar</Label>
                        <Select 
                          value={formData.contactType} 
                          onValueChange={(value) => setFormData({ ...formData, contactType: value })}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Välj..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Mig själv (Individ)</SelectItem>
                            <SelectItem value="church">En kyrka/Församling</SelectItem>
                            <SelectItem value="organization">En organisation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">Ämne *</Label>
                      <Input
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="rounded-lg"
                        placeholder="Vad gäller det?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Meddelande *</Label>
                      <Textarea
                        id="contact-message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="rounded-lg"
                        placeholder="Skriv ditt meddelande här..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-700 hover:bg-amber-800 text-cream-50 py-6 text-lg rounded-xl shadow-lg"
                    >
                      {isSubmitting ? 'Skickar...' : 'Skicka meddelande'}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Info */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Vem kan kontakta oss?</h2>
            <p className="text-lg text-stone-600">Vi välkomnar kontakt från alla som är intresserade av ledarutveckling</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">I</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">Individer</h3>
                <p className="text-stone-600">
                  Du som har vision och ledarförmåga och vill utvecklas som ledare
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">K</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">Kyrkor</h3>
                <p className="text-stone-600">
                  Församlingar som vill investera i sina ledares utveckling
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">O</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">Organisationer</h3>
                <p className="text-stone-600">
                  Kristna organisationer som vill samarbeta eller stödja vårt arbete
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
