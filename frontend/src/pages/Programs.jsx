import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { programs } from '../data/mock';

const Programs = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-amber-700 font-medium text-sm tracking-wider uppercase mb-4 block">Våra Program</span>
            <h1 className="text-5xl font-bold text-stone-800 mb-6">Ledarskapsutbildningar</h1>
            <p className="text-xl text-stone-600 leading-relaxed">
              Utveckla ditt ledarskap genom våra utbildningar som bygger på bibliska 
              principer och beprövade metoder från Haggai International.
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="h-3 bg-amber-600 rounded-t-xl" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                      <Clock className="h-4 w-4 mr-1" />
                      {program.duration}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-stone-800 group-hover:text-amber-700 transition-colors">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-stone-600 mb-6 leading-relaxed">{program.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-stone-800 mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-amber-700" />
                      Ämnesområden
                    </h4>
                    <ul className="space-y-2">
                      {program.topics.map((topic, index) => (
                        <li key={index} className="flex items-center text-stone-600">
                          <CheckCircle className="h-4 w-4 mr-2 text-amber-600" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <Link to="/kontakt">
                      <Button className="w-full bg-amber-700 hover:bg-amber-800 text-cream-50 rounded-xl">
                        Fråga om programmet
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Varför välja våra utbildningar?</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Våra program är designade för att ge praktiska verktyg och djup andlig grund
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Beprövat", desc: "Metoder använda i över 50 år globalt" },
              { title: "Praktiskt", desc: "Verktyg du kan använda direkt" },
              { title: "Bibliskt", desc: "Grundat i Guds ord" },
              { title: "Nätverk", desc: "Möt ledare från hela Sverige" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-amber-700 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-stone-800 mb-6">Redo att ta nästa steg?</h2>
          <p className="text-xl text-stone-600 mb-10">
            Kontakta oss för mer information om våra utbildningar och hur du kan anmäla dig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kalender">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-cream-50 px-10 py-6 text-lg rounded-xl shadow-lg">
                Se kommande datum
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/kontakt">
              <Button variant="outline" size="lg" className="border-2 border-stone-400 text-stone-700 hover:bg-stone-100 px-10 py-6 text-lg rounded-xl">
                Kontakta oss
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
