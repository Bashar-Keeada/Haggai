import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo } from '../../data/mock';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-haggai-dark text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 ${isRTL ? 'text-right' : ''}`}>
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className={`flex items-center mb-6 ${isRTL ? 'justify-end' : ''}`}>
              <img 
                src="/haggai-logo-white.png" 
                alt="Haggai International" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-cream-300 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream-50 font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li><Link to="/om-oss" className="text-cream-300 hover:text-haggai-200 transition-colors text-sm">{t('nav.about')}</Link></li>
              <li><Link to="/leader-experience" className="text-cream-300 hover:text-haggai-200 transition-colors text-sm">Leader Experience</Link></li>
              <li><Link to="/kalender" className="text-cream-300 hover:text-haggai-200 transition-colors text-sm">{t('nav.calendar')}</Link></li>
              <li><Link to="/bli-medlem" className="text-cream-300 hover:text-haggai-200 transition-colors text-sm">{t('nav.membership')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream-50 font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className={`flex items-center space-x-3 text-cream-300 text-sm ${isRTL ? 'space-x-reverse flex-row-reverse justify-end' : ''}`}>
                <MapPin className="h-4 w-4 text-haggai-200 flex-shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className={`flex items-center space-x-3 text-cream-300 text-sm ${isRTL ? 'space-x-reverse flex-row-reverse justify-end' : ''}`}>
                <Phone className="h-4 w-4 text-haggai-200 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className={`flex items-center space-x-3 text-cream-300 text-sm ${isRTL ? 'space-x-reverse flex-row-reverse justify-end' : ''}`}>
                <Mail className="h-4 w-4 text-haggai-200 flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Haggai International */}
          <div>
            <h4 className="text-cream-50 font-semibold mb-4">{t('footer.haggaiInternational')}</h4>
            <p className="text-cream-300 text-sm mb-4 leading-relaxed">
              {t('footer.proudPart')}
            </p>
            <a
              href="https://www.haggai-international.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center text-haggai-200 hover:text-haggai-100 transition-colors text-sm font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {t('footer.visitHaggai')}
              <svg className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-haggai-700 mt-12 pt-8 text-center">
          <p className="text-cream-400 text-sm">
            © {new Date().getFullYear()} Haggai Sweden. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
