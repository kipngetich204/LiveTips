import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
//import { Marquee } from "../pages/marquue";
export function Footer() {
  return (
    <>
   
    <footer className="bg-gray-900 text-gray-300 py-12 mt-5">
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1  md:grid-cols-4 gap-8 border-b border-gray-700 pb-10">
          {/* Logo & About */}
          <div>
            <a href="/" className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                l
              </div>
              <span className="font-bold text-xl text-white">Live Tips</span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed">
              Live Tips helps you stay ahead of the game with live scores, insights,
              and premium match analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-yellow-400 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#livescore" className="hover:text-yellow-400 transition-colors duration-200">
                  Live Score
                </a>
              </li>
              <li>
                <a href="#premium" className="hover:text-yellow-400 transition-colors duration-200">
                  Premium
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-yellow-400 transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-yellow-400 transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-yellow-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-yellow-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-yellow-400 transition-colors duration-200">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors duration-200">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors duration-200">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors duration-200">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-10 text-sm text-gray-500 space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} Predict. All rights reserved.</p>
          <p>
            Built with ❤️ by{" "}
            <a href="#" className="hover:text-yellow-400 transition-colors duration-200">
              Brian
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
