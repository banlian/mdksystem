import React from 'react';
import { LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthProvider';

interface AppNavigationProps {
  onShowAuth?: () => void;
  onShowProjects?: () => void;
  onShowLanding?: () => void;
  currentView?: 'landing' | 'auth' | 'projects' | 'designer';
}

const AppNavigation: React.FC<AppNavigationProps> = ({
  onShowAuth,
  onShowProjects,
  onShowLanding,
  currentView = 'landing'
}) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            {currentView !== 'landing' && onShowLanding && (
              <button
                onClick={onShowLanding}
                className="text-primary-600 hover:text-primary-700 transition-colors mr-4"
                title="返回首页"
              >
                ← 返回首页
              </button>
            )}
            <h1 className="text-2xl font-bold text-primary-600">MDKSYS</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentView === 'landing' && (
              <>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  功能特性
                </a>
                <a
                  href="#demo-section"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  演示项目
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  联系我们
                </a>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                {currentView !== 'designer' && onShowProjects && (
                  <button
                    onClick={onShowProjects}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    我的项目
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">退出</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>登录/注册</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentView === 'landing' && (
                <>
                  <a
                    href="#features"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    功能特性
                  </a>
                  <a
                    href="#demo-section"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    演示项目
                  </a>
                  <a
                    href="#contact"
                    className="block px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    联系我们
                  </a>
                </>
              )}
              {user && currentView !== 'designer' && onShowProjects && (
                <button
                  onClick={() => {
                    onShowProjects();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                >
                  我的项目
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppNavigation;