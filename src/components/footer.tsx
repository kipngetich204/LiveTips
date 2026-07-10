import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import { Marquee } from "../pages/marquue";

export function Footer() {
  const { t } = useTranslation();

  return (
    <>
    <footer className="bg-surface text-text-secondary py-12 mt-5 border-t border-border">
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1  md:grid-cols-4 gap-8 border-b border-border pb-10">
          {/* Logo & About */}
          <div>
            <a href="/" className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-brand-black rounded-full flex items-center justify-center text-brand-white font-bold text-lg">
                l
              </div>
              <span className="font-bold text-xl text-text-primary">Live Tips</span>
            </a>
            <p className="text-sm text-text-secondary leading-relaxed">
              Live Tips helps you stay ahead of the game with live scores, insights,
              and premium match analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-text-primary transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#livescore" className="hover:text-text-primary transition-colors duration-200">
                  Live Score
                </a>
              </li>
              <li>
                <a href="#premium" className="hover:text-text-primary transition-colors duration-200">
                  Premium
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-text-primary transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-text-primary transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-text-primary transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-text-primary transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link to="/responsible-gambling" className="hover:text-text-primary transition-colors duration-200">
                  {t('compliance.responsibleGamblingLinkLabel')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="min-h-11 min-w-11 flex items-center justify-center hover:text-text-primary transition-colors duration-200">
                <Twitter size={20} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Facebook" className="min-h-11 min-w-11 flex items-center justify-center hover:text-text-primary transition-colors duration-200">
                <Facebook size={20} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Instagram" className="min-h-11 min-w-11 flex items-center justify-center hover:text-text-primary transition-colors duration-200">
                <Instagram size={20} aria-hidden="true" />
              </a>
              <a href="#" aria-label="YouTube" className="min-h-11 min-w-11 flex items-center justify-center hover:text-text-primary transition-colors duration-200">
                <Youtube size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Compliance disclaimer — required, persistent, non-intrusive */}
        <p className="text-xs text-text-secondary text-center mt-8 max-w-3xl mx-auto leading-relaxed">
          {t('compliance.disclaimerShort')}{" "}
          <Link to="/responsible-gambling" className="underline hover:text-text-primary">
            {t('compliance.responsibleGamblingLinkLabel')}
          </Link>
        </p>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 text-sm text-text-secondary space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} Predict. All rights reserved.</p>
          <p>
            Built with ❤️ by{" "}
            <a href="#" className="hover:text-text-primary transition-colors duration-200">
              Brian
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}