import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import { contactInfo } from '../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const { t, isRTL } = useLanguage();
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

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || formData.contactType,
          message: formData.message
        })
      });

      if (response.ok) {
        toast.success(t('contact.successTitle'), {
          description: t('contact.successDesc')
        });
        setFormData({ name: '', email: '', phone: '', subject: '', contactType: '', message: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Kunde inte skicka meddelandet. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-cream-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-3xl ${isRTL ? 'mr-auto text-right' : ''}`}>
            <span className="text-haggai font-medium text-sm tracking-wider uppercase mb-4 block">{t('contact.title')}</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">{t('contact.heading')}</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {t('contact.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid lg:grid-cols-3 gap-12 ${isRTL ? 'direction-rtl' : ''}`}>
            {/* Contact Info */}
            <div className={`lg:col-span-1 space-y-8 ${isRTL ? 'order-2 lg:order-1 text-right' : ''}`}>
              <div>
                <h2 className="text-2xl font-bold text-stone-800 mb-6">{t('contact.contactInfo')}</h2>
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className={`flex items-start space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-haggai-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-haggai" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">{t('contact.address')}</h3>
                          <p className="text-stone-600">{contactInfo.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className={`flex items-start space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-haggai-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-haggai" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">{t('contact.phone')}</h3>
                          <a href={`tel:${contactInfo.phone}`} className="text-haggai hover:text-haggai-dark" dir="ltr">
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className={`flex items-start space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-haggai-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-haggai" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">{t('contact.email')}</h3>
                          <a href={`mailto:${contactInfo.email}`} className="text-haggai hover:text-haggai-dark" dir="ltr">
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className={`flex items-start space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 bg-haggai-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-haggai" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-800 mb-1">{t('contact.responseTime')}</h3>
                          <p className="text-stone-600">{t('contact.responseTimeText')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`lg:col-span-2 ${isRTL ? 'order-1 lg:order-2' : ''}`}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className={`text-2xl font-bold text-stone-800 mb-6 ${isRTL ? 'text-right' : ''}`}>{t('contact.sendMessage')}</h2>
                  
                  <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">{t('contact.name')} *</Label>
                        <Input
                          id="contact-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">{t('contact.email')} *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="rounded-lg"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">{t('contact.phone')}</Label>
                        <Input
                          id="contact-phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-lg"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-type">{t('contact.iRepresent')}</Label>
                        <Select 
                          value={formData.contactType} 
                          onValueChange={(value) => setFormData({ ...formData, contactType: value })}
                        >
                          <SelectTrigger className={`rounded-lg ${isRTL ? 'text-right' : ''}`}>
                            <SelectValue placeholder={t('contact.selectOption')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">{t('contact.myself')}</SelectItem>
                            <SelectItem value="church">{t('contact.aChurch')}</SelectItem>
                            <SelectItem value="organization">{t('contact.anOrganization')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">{t('contact.subject')} *</Label>
                      <Input
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                        placeholder={t('contact.subjectPlaceholder')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message">{t('contact.message')} *</Label>
                      <Textarea
                        id="contact-message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                        placeholder={t('contact.messagePlaceholder')}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-haggai hover:bg-haggai-dark text-cream-50 py-6 text-lg rounded-xl shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {isSubmitting ? t('contact.submitting') : t('contact.submit')}
                      <Send className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
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
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{t('contact.whoCanContact')}</h2>
            <p className="text-lg text-stone-600">{t('contact.whoCanContactSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className={`p-8 text-center ${isRTL ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-haggai-100 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                  <span className="text-3xl font-bold text-haggai">I</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">{t('contact.individualsTitle')}</h3>
                <p className="text-stone-600">
                  {t('contact.individualsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className={`p-8 text-center ${isRTL ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-haggai-100 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                  <span className="text-3xl font-bold text-haggai">K</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">{t('contact.churchesTitle')}</h3>
                <p className="text-stone-600">
                  {t('contact.churchesDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className={`p-8 text-center ${isRTL ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-haggai-100 rounded-2xl flex items-center justify-center mb-6 ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                  <span className="text-3xl font-bold text-haggai">O</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">{t('contact.organizationsTitle')}</h3>
                <p className="text-stone-600">
                  {t('contact.organizationsDesc')}
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
