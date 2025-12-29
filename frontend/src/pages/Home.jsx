import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Heart, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { testimonials, events } from '../data/mock';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-cream-300/40 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full mb-8">
              <span className="text-amber-800 text-sm font-medium">En del av Haggai International</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-800 leading-tight mb-6">
              Ledarskap som
              <span className="block text-amber-700">förändrar samhället</span>
            </h1>
            
            <p className="text-xl text-stone-600 mb-10 leading-relaxed max-w-2xl">
              Vi utbildar och stärker kyrkoledare från alla samfund att bli positiva förebilder 
              och initiativtagare i samhället – grundat i Kristi kärleksfulla ledarskap.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/bli-medlem">
                <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-cream-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Bli Medlem
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/utbildningar">
                <Button variant="outline" size="lg" className="border-2 border-stone-300 text-stone-700 hover:bg-cream-100 px-8 py-6 text-lg rounded-xl">
                  Utforska Utbildningar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Våra Kärnvärden</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Haggai Sweden bygger på principer från Kristi ledarskap
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Gemenskap", desc: "Vi samlar ledare från alla kyrkor och samfund i enhet" },
              { icon: BookOpen, title: "Utbildning", desc: "Grundlig ledarskapsutbildning baserad på bibliska principer" },
              { icon: Heart, title: "Tjänande", desc: "Ledarskap handlar om att tjäna andra med kärlek" },
              { icon: Globe, title: "Påverkan", desc: "Vi utrustar ledare att göra positiv skillnad i samhället" }
            ].map((value, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-cream-50 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:bg-amber-700 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-amber-700 group-hover:text-cream-50 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">{value.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">Om Haggai Sweden</span>
              <h2 className="text-4xl font-bold text-stone-800 mb-6">Stärker ledare för Guds rike</h2>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                Haggai Sweden är en del av det globala Haggai International-nätverket. 
                Vi är en registrerad organisation med en engagerad styrelse och över 50 medlemmar 
                från olika kyrkor och samfund runt om i Sverige.
              </p>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                Vårt uppdrag är att hålla ledarskapsutbildningar för de mest inflytelserika 
                kyrkoledarna – oberoende av denomination eller inriktning.
              </p>
              <Link to="/om-oss">
                <Button variant="outline" className="border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-cream-50 rounded-xl px-6">
                  Läs mer om oss
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-200/50 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-cream-50 rounded-2xl">
                    <span className="text-4xl font-bold text-amber-700">50+</span>
                    <p className="text-stone-600 mt-2">Medlemmar</p>
                  </div>
                  <div className="text-center p-6 bg-cream-50 rounded-2xl">
                    <span className="text-4xl font-bold text-amber-700">10+</span>
                    <p className="text-stone-600 mt-2">Utbildningar/år</p>
                  </div>
                  <div className="text-center p-6 bg-cream-50 rounded-2xl">
                    <span className="text-4xl font-bold text-amber-700">20+</span>
                    <p className="text-stone-600 mt-2">Samfund</p>
                  </div>
                  <div className="text-center p-6 bg-cream-50 rounded-2xl">
                    <span className="text-4xl font-bold text-amber-700">∞</span>
                    <p className="text-stone-600 mt-2">Potential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-stone-800 mb-2">Kommande Evenemang</h2>
              <p className="text-stone-600">Delta i våra utbildningar och nätverksträffar</p>
            </div>
            <Link to="/kalender" className="mt-4 sm:mt-0">
              <Button variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-cream-50 rounded-xl">
                Se alla evenemang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="h-2 bg-amber-600" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                      {new Date(event.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-sm text-stone-500">{event.time}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-amber-700 transition-colors">{event.title}</h3>
                  <p className="text-stone-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">{event.spotsLeft} platser kvar</span>
                    <Link to="/kalender">
                      <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-lg">
                        Anmäl dig
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-cream-50 mb-4">Vad våra medlemmar säger</h2>
            <p className="text-cream-300">Röster från ledare som genomgått våra utbildningar</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-stone-700/50 border-stone-600 backdrop-blur">
                <CardContent className="p-8">
                  <div className="text-amber-400 text-4xl mb-4">"</div>
                  <p className="text-cream-100 mb-6 leading-relaxed italic">{testimonial.quote}</p>
                  <div className="border-t border-stone-600 pt-4">
                    <p className="text-cream-50 font-semibold">{testimonial.name}</p>
                    <p className="text-cream-400 text-sm">{testimonial.church}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-stone-800 mb-6">
            Redo att växa som ledare?
          </h2>
          <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            Oavsett om du är en individ med vision, representerar en kyrka eller en organisation – 
            vi välkomnar dig till Haggai-familjen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bli-medlem">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-cream-50 px-10 py-6 text-lg rounded-xl shadow-lg">
                Bli Medlem Idag
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/kontakt">
              <Button variant="outline" size="lg" className="border-2 border-stone-400 text-stone-700 hover:bg-stone-100 px-10 py-6 text-lg rounded-xl">
                Kontakta Oss
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
