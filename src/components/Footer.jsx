import React from 'react';
import { Link } from 'react-router-dom';
import { Shuffle, Info, Home, Target } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4 flex items-center gap-2">
              <Shuffle className="h-6 w-6 text-orange-500" />
              SpinToChoose
            </h3>
            <p className="text-gray-400">
              Simplify decision-making with our interactive spin and choose tools. Make choices fun and random!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              
             
              <li>
                <Link to="/spin-wheel" className="hover:text-orange-500 transition flex items-center gap-2">
                  <Target className="h-4 w-4" /> Spin Wheel
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-500 transition flex items-center gap-2">
                  <Info className="h-4 w-4" /> About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <span>Email: <a href="mailto:support@spintochoose.com" className="hover:text-orange-500 transition">support@spintochoose.com</a></span>
              </li>
              
            </ul>
          </div>

         
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SpinToChoose. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 space-x-6">
              <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-orange-500 transition">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-orange-500 transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;