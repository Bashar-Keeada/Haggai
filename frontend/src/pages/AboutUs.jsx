import React from 'react';
import { Users, Target, Heart, Award } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { boardMembers } from '../data/mock';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">Om Oss</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">Haggai Sweden</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Vi är en del av det globala Haggai International-nätverket och arbetar för att 
              stärka kyrkoledare i Sverige genom utbildning och gemenskap.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-amber-700" />
                </div>
                <h2 className="text-3xl font-bold text-stone-800 mb-4">Vårt Uppdrag</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Haggai Sweden finns för att hålla ledarskapsutbildningar för de mest 
                  påverkande kyrkoledarna från alla olika kyrkor och samfund. Vi är inte 
                  begränsade till en gren eller en riktning och äger ingen kyrka – 
                  vi stöttar alla kyrkoledare.
                </p>
              </div>
              <div>
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="h-7 w-7 text-amber-700" />
                </div>
                <h2 className="text-3xl font-bold text-stone-800 mb-4">Vår Vision</h2>
                <p className="text-lg text-stone-600 leading-relaxed">
                  Att se kyrkoledare växa till påverkande ledare och förebilder som är 
                  aktiva initiativtagare i samhället för att göra en positiv påverkan – 
                  allt grundat i Kristi kärleksfulla och tjänande ledarskap.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-200/30 rounded-3xl blur-2xl" />
              <div className="relative bg-cream-100 rounded-3xl p-10 h-full flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-stone-800 mb-8">Ledarskap utifrån Kristi perspektiv</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-cream-50 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-1">Tjänande Ledarskap</h4>
                      <p className="text-stone-600">Att leda genom att tjäna andra, precis som Kristus gjorde.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-cream-50 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-1">Integritet & Ärlighet</h4>
                      <p className="text-stone-600">Ledarskap byggt på karaktär och pålitlighet.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-cream-50 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-1">Visionärt Tänkande</h4>
                      <p className="text-stone-600">Att se möjligheter och leda mot positiv förändring.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-cream-50 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-800 mb-1">Enhet i Mångfald</h4>
                      <p className="text-stone-600">Samarbete över konfessionella gränser.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Haggai International */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-6">Del av ett globalt nätverk</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Haggai International grundades 1969 och har sedan dess utbildat över 
              120,000 ledare i mer än 185 länder. Haggai Sweden är stolta att vara 
              en del av detta globala nätverk.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-amber-700">120K+</span>
                <p className="text-stone-600 mt-2">Utbildade ledare globalt</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-amber-700">185+</span>
                <p className="text-stone-600 mt-2">Länder</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <span className="text-5xl font-bold text-amber-700">50+</span>
                <p className="text-stone-600 mt-2">År av erfarenhet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Vår Styrelse</h2>
            <p className="text-lg text-stone-600">Engagerade ledare som driver Haggai Sweden framåt</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardMembers.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-amber-100 to-cream-100 flex items-center justify-center">
                    <div className="w-24 h-24 bg-amber-700 rounded-full flex items-center justify-center">
                      <Users className="h-12 w-12 text-cream-50" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-stone-800 mb-1">{member.name}</h3>
                    <p className="text-amber-700 text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-stone-600 text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-24 bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cream-50 mb-4">Vilka vi tjänar</h2>
            <p className="text-cream-300 text-lg">Våra utbildningar riktar sig till:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-stone-700/50 backdrop-blur rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">Individer</h3>
              <p className="text-cream-300">Personer med vision och ledarförmåga som vill utvecklas</p>
            </div>
            <div className="bg-stone-700/50 backdrop-blur rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">Kyrkor & Församlingar</h3>
              <p className="text-cream-300">Alla kyrkor oavsett samfund eller inriktning</p>
            </div>
            <div className="bg-stone-700/50 backdrop-blur rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-semibold text-cream-50 mb-3">Organisationer</h3>
              <p className="text-cream-300">Kristna organisationer och nätverk som vill stärka sitt ledarskap</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
