import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircleDot, Shuffle, Text, Menu, X, Info, FileText, Shield, Trophy } from 'lucide-react';

function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const mainNavItems = [
    {
      path: '/',
      name: 'Spin Wheel',
      icon: CircleDot,
    },
    {
      path: '/random-number',
      name: 'Random Number',
      icon: Shuffle,
    },
    {
      path: '/random-alphabet',
      name: 'Random Letter',
      icon: Text,
    },
    {
      path: '/nfl-team-picker',
      name: 'NFL Team Picker',
      icon: Trophy,
    },
  ];

  const menuItems = [
    {
      path: '/about',
      name: 'About',
      icon: Info,
    },
    {
      path: '/terms-of-service',
      name: 'Terms of Service',
      icon: FileText,
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      icon: Shield,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <CircleDot className="w-8 h-8 text-blue-600" />
              <span className="text-lg font-semibold text-blue-600">SpinToChoose</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2"></div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default CustomNavbar;