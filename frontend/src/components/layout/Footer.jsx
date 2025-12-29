import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { contactInfo } from '../../data/mock';

const Footer = () => {
  return (
    <footer className="bg-stone-800 text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-cream-50 font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-cream-50">Haggai</span>
                <span className="text-xs text-amber-400 font-medium tracking-wider uppercase">Sweden</span>
              </div>
            </Link>
            <p className="text-cream-300 text-sm leading-relaxed">
              En del av Haggai International - utbildar och stärker kyrkoledare för positiv samhällspåverkan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream-50 font-semibold mb-4">Snabblänkar</h4>
            <ul className="space-y-3">
              <li><Link to="/om-oss" className="text-cream-300 hover:text-amber-400 transition-colors text-sm">Om Oss</Link></li>
              <li><Link to="/utbildningar" className="text-cream-300 hover:text-amber-400 transition-colors text-sm">Utbildningar</Link></li>
              <li><Link to="/kalender" className="text-cream-300 hover:text-amber-400 transition-colors text-sm">Kalender</Link></li>
              <li><Link to="/bli-medlem" className="text-cream-300 hover:text-amber-400 transition-colors text-sm">Bli Medlem</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream-50 font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-cream-300 text-sm">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center space-x-3 text-cream-300 text-sm">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center space-x-3 text-cream-300 text-sm">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Haggai International */}
          <div>
            <h4 className="text-cream-50 font-semibold mb-4">Haggai International</h4>
            <p className="text-cream-300 text-sm mb-4 leading-relaxed">
              Vi är stolta att vara en del av det globala Haggai-nätverket.
            </p>
            <a
              href="https://www.haggai-international.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
            >
              Besök Haggai International
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-12 pt-8 text-center">
          <p className="text-cream-400 text-sm">
            © {new Date().getFullYear()} Haggai Sweden. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
