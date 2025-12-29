import React, { useState } from 'react';
import { Check, Users, Building, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { memberTypes } from '../data/mock';

const Membership = () => {
  const [selectedType, setSelectedType] = useState('individual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons = {
    individual: Users,
    church: Building,
    organization: Building2
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - store in localStorage
    const memberships = JSON.parse(localStorage.getItem('membershipApplications') || '[]');
    memberships.push({
      ...formData,
      memberType: selectedType,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('membershipApplications', JSON.stringify(memberships));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Ansökan skickad!', {
      description: 'Vi hör av oss inom kort.'
    });

    setFormData({ name: '', email: '', phone: '', organization: '', address: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">Bli Medlem</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">Gå med i Haggai Sweden</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Oavsett om du är en individ med vision, representerar en kyrka eller en organisation – 
              vi välkomnar dig att bli en del av vår gemenskap.
            </p>
          </div>
        </div>
      </section>

      {/* Membership Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Välj medlemstyp</h2>
            <p className="text-lg text-stone-600">Vilken kategori passar dig bäst?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {memberTypes.map((type) => {
              const Icon = icons[type.id];
              const isSelected = selectedType === type.id;
              
              return (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-amber-600 shadow-xl scale-105' 
                      : 'border-transparent shadow-lg hover:shadow-xl hover:border-amber-200'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-amber-700' : 'bg-amber-100'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        isSelected ? 'text-cream-50' : 'text-amber-700'
                      }`} />
                    </div>
                    <CardTitle className="text-xl text-stone-800">{type.title}</CardTitle>
                    <CardDescription className="text-stone-600">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold text-amber-700 mb-2">{type.price}</p>
                    {isSelected && (
                      <div className="flex items-center justify-center text-amber-700">
                        <Check className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Vald</span>
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
              <CardHeader>
                <CardTitle className="text-2xl text-stone-800">Medlemsansökan</CardTitle>
                <CardDescription>
                  Fyll i formuläret nedan så hör vi av oss inom kort.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Namn *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-lg"
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-post *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-lg"
                        placeholder="din@email.se"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-lg"
                        placeholder="070-XXX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">
                        {selectedType === 'individual' ? 'Församling/Kyrka' : 'Organisationsnamn *'}
                      </Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        required={selectedType !== 'individual'}
                        className="rounded-lg"
                        placeholder={selectedType === 'individual' ? 'Valfritt' : 'Organisationens namn'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adress</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="rounded-lg"
                      placeholder="Gatuadress, postnummer, ort"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Meddelande</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="rounded-lg"
                      placeholder="Berätta gärna lite om dig själv och varför du vill bli medlem..."
                    />
                  </div>

                  <div className="bg-cream-50 p-4 rounded-xl">
                    <p className="text-sm text-stone-600">
                      <strong>Vald medlemstyp:</strong> {memberTypes.find(t => t.id === selectedType)?.title} – {memberTypes.find(t => t.id === selectedType)?.price}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-cream-50 py-6 text-lg rounded-xl shadow-lg"
                  >
                    {isSubmitting ? 'Skickar...' : 'Skicka ansökan'}
                    <ArrowRight className="ml-2 h-5 w-5" />
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Fördelar med medlemskap</h2>
            <p className="text-lg text-stone-600">Som medlem får du tillgång till:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Rabatt på utbildningar',
              'Nätverksmöjligheter',
              'Nyhetsbrev och resurser',
              'Rösträtt på årsmöte',
              'Mentorprogram',
              'Exklusiva evenemang',
              'Internationellt nätverk',
              'Ledarskapsresurser'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-amber-700" />
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
