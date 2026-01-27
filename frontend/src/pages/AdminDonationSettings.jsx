import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Smartphone, Building2, CreditCard, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDonationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    swish_number: '',
    bank_name: '',
    account_number: '',
    iban: '',
    bic: '',
    reference: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/donation-settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Kunde inte hämta inställningar');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/donation-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Inställningar sparade!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Kunde inte spara inställningar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-haggai border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-stone-500 hover:text-stone-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-stone-800">Donationsinställningar</h1>
                <p className="text-sm text-stone-500">Hantera Swish och bankuppgifter</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-haggai hover:bg-haggai-dark text-white"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Sparar...' : 'Spara ändringar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Swish Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-white">Swish-inställningar</CardTitle>
                <CardDescription className="text-white/80">
                  Ange Swish-nummer för donationer
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="swish_number">Swish-nummer</Label>
                <Input
                  id="swish_number"
                  value={settings.swish_number}
                  onChange={(e) => handleChange('swish_number', e.target.value)}
                  placeholder="070 123 45 67"
                  className="mt-1"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Detta nummer visas på donationssidan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-white">Bankuppgifter</CardTitle>
                <CardDescription className="text-white/80">
                  Ange bankuppgifter för överföringar
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Banknamn</Label>
                <Input
                  id="bank_name"
                  value={settings.bank_name}
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                  placeholder="Swedbank"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="account_number">Kontonummer</Label>
                <Input
                  id="account_number"
                  value={settings.account_number}
                  onChange={(e) => handleChange('account_number', e.target.value)}
                  placeholder="1234-5 678 901 234-5"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={settings.iban}
                  onChange={(e) => handleChange('iban', e.target.value)}
                  placeholder="SE12 3456 7890 1234 5678 9012"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bic">BIC/SWIFT</Label>
                <Input
                  id="bic"
                  value={settings.bic}
                  onChange={(e) => handleChange('bic', e.target.value)}
                  placeholder="SWEDSESS"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reference">Referens/Meddelande</Label>
                <Input
                  id="reference"
                  value={settings.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  placeholder="Gåva + ditt namn"
                  className="mt-1"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Instruktion som visas för givaren
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-0 shadow-lg bg-stone-50">
          <CardHeader>
            <CardTitle className="text-stone-800">Förhandsvisning</CardTitle>
            <CardDescription>Så här kommer det att visas på donationssidan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Swish Preview */}
              <div className="p-4 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-stone-800">Swish</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{settings.swish_number || '---'}</p>
              </div>
              
              {/* Bank Preview */}
              <div className="p-4 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-stone-800">Bank</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-stone-500">Bank:</span> {settings.bank_name || '---'}</p>
                  <p><span className="text-stone-500">Konto:</span> {settings.account_number || '---'}</p>
                  <p><span className="text-stone-500">IBAN:</span> {settings.iban || '---'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDonationSettings;
