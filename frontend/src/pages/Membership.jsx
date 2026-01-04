import React, { useState } from 'react';
import { Check, Users, Building, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Membership = () => {
  const { t, language, isRTL } = useLanguage();
  const [selectedType, setSelectedType] = useState('individual');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    city: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberTypes = [
    {
      id: 'individual',
      icon: Users,
      title: t('membership.individual'),
      description: t('membership.individualDesc'),
      price: '500 kr'
    },
    {
      id: 'church',
      icon: Building,
      title: t('membership.church'),
      description: t('membership.churchDesc'),
      price: '2000 kr'
    },
    {
      id: 'organization',
      icon: Building2,
      title: t('membership.organizationType'),
      description: t('membership.organizationDesc'),
      price: '3000 kr'
    }
  ];

  const benefits = [
    t('membership.benefit1'),
    t('membership.benefit2'),
    t('membership.benefit3'),
    t('membership.benefit4'),
    t('membership.benefit5'),
    t('membership.benefit6'),
    t('membership.benefit7'),
    t('membership.benefit8')
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_type: selectedType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization || null,
          city: formData.city,
          message: formData.message || null
        })
      });

      if (response.ok) {
        toast.success(t('membership.successTitle'), {
          description: t('membership.successDesc')
        });
        setFormData({ firstName: '', lastName: '', email: '', phone: '', organization: '', city: '', message: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting membership:', error);
      toast.error('Kunde inte skicka ansökan. Försök igen.');
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
            <span className="text-haggai font-medium text-sm tracking-wider uppercase mb-4 block">{t('membership.title')}</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">{t('membership.heading')}</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              {t('membership.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Membership Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{t('membership.chooseType')}</h2>
            <p className="text-lg text-stone-600">{t('membership.chooseTypeSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {memberTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-haggai shadow-xl scale-105' 
                      : 'border-transparent shadow-lg hover:shadow-xl hover:border-haggai-100'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className={`text-center pb-4 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-haggai' : 'bg-haggai-100'
                    } ${isRTL ? 'mr-0 ml-auto' : 'mx-auto'}`}>
                      <Icon className={`h-8 w-8 ${
                        isSelected ? 'text-cream-50' : 'text-haggai'
                      }`} />
                    </div>
                    <CardTitle className="text-xl text-stone-800">{type.title}</CardTitle>
                    <CardDescription className="text-stone-600">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent className={`text-center ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-3xl font-bold text-haggai mb-2">{type.price}{t('membership.perYear')}</p>
                    {isSelected && (
                      <div className={`flex items-center justify-center text-haggai ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Check className={`h-5 w-5 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        <span className="text-sm font-medium">{t('membership.selected')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Registration Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className={isRTL ? 'text-right' : ''}>
                <CardTitle className="text-2xl text-stone-800">{t('membership.applicationTitle')}</CardTitle>
                <CardDescription>
                  {t('membership.applicationSubtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('membership.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('membership.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-lg"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('membership.phone')}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-lg"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">
                        {selectedType === 'individual' ? t('membership.churchOrg') : `${t('membership.orgName')} *`}
                      </Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required={selectedType !== 'individual'}
                        className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                        placeholder={selectedType === 'individual' ? t('membership.optional') : ''}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t('membership.address')}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                      placeholder={t('membership.addressPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('calendar.message')}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className={`rounded-lg ${isRTL ? 'text-right' : ''}`}
                      placeholder={t('membership.messagePlaceholder')}
                    />
                  </div>

                  <div className="bg-cream-50 p-4 rounded-xl">
                    <p className="text-sm text-stone-600">
                      <strong>{t('membership.selectedType')}</strong> {memberTypes.find(m => m.id === selectedType)?.title} – {memberTypes.find(m => m.id === selectedType)?.price}{t('membership.perYear')}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-haggai hover:bg-haggai-dark text-cream-50 py-6 text-lg rounded-xl shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {isSubmitting ? t('membership.submitting') : t('membership.submitApplication')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-4">{t('membership.benefits')}</h2>
            <p className="text-lg text-stone-600">{t('membership.benefitsSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className={`flex items-center space-x-3 bg-white p-4 rounded-xl shadow ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-haggai-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-haggai" />
                </div>
                <span className="text-stone-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
