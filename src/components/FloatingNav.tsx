import { useEffect, useState } from 'react';

import { scrollToSection } from '../utils/scrollUtils';

const FloatingNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      setIsVisible(scrollY > 100);

      // Determine active section based on scroll position for full-page sections
      const sections = ['home', 'features', 'technology', 'cta', 'footer'];
      const windowHeight = window.innerHeight;
      const currentSectionIndex = Math.floor(scrollY / windowHeight);

      if (currentSectionIndex >= 0 && currentSectionIndex < sections.length) {
        setActiveSection(sections[currentSectionIndex] || 'home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'technology', label: 'Tech', icon: '🔧' },
    { id: 'cta', label: 'Get Started', icon: '🚀' },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-full border border-gray-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center space-x-1 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { FloatingNav };
