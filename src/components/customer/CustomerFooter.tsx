import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface CustomerFooterProps {
  onNavigate: (page: string) => void;
}

export function CustomerFooter({ onNavigate }: CustomerFooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl text-white">AutoRent</div>
                <div className="text-xs">Your Rental Partner</div>
              </div>
            </div>
            <p className="text-sm mb-4">
              Your trusted car rental partner. Quality vehicles, competitive rates, and exceptional service.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-blue-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("cars")} className="hover:text-blue-400 transition-colors">
                  Browse Cars
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-blue-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-blue-400 transition-colors">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("faq")} className="hover:text-blue-400 transition-colors">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Daily Rentals</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Weekly Rentals</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Monthly Rentals</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Airport Pickup</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Long-term Leasing</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Main Street, Harare, Zimbabwe</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+263771234567" className="hover:text-blue-400 transition-colors">
                  +263 77 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:info@autorent.com" className="hover:text-blue-400 transition-colors">
                  info@autorent.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm">Business Hours:</p>
              <p className="text-sm">Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-sm">Sat-Sun: 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} AutoRent. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => onNavigate("terms")} className="hover:text-blue-400 transition-colors">
                Terms & Conditions
              </button>
              <button onClick={() => onNavigate("privacy")} className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => onNavigate("admin")} className="hover:text-blue-400 transition-colors text-gray-500">
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
