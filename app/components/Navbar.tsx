import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './ui/button';
import {
  Home,
  BookOpen,
  Users,
  FileText,
  MessageCircle,
  LayoutDashboard,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: Log profile changes
  useEffect(() => {
    console.log('🔔 Navbar - Profile updated:', {
      user: user?.email,
      profile: profile ? {
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name
      } : null,
      isAdmin: profile?.role === 'admin',
      isStaff: profile?.role === 'staff' || profile?.role === 'admin',
      isEditor: profile?.role === 'editor' || profile?.role === 'staff' || profile?.role === 'admin'
    });
  }, [user, profile]);

  const navItems = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/library', label: 'المكتبة', icon: BookOpen },
    { path: '/study-plans', label: 'الخطط الدراسية', icon: GraduationCap },
    { path: '/faculty', label: 'الهيئة التدريسية', icon: Users },
    { path: '/procedures', label: 'الإجراءات', icon: FileText },
    { path: '/chatbot', label: 'المرشد التقني', icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900 dark:text-white">منصة مرشد تقني</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">جامعة الطفيلة التقنية</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md transition-colors ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {(profile?.role === 'admin' || profile?.role === 'staff' || profile?.role === 'editor') && (
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md transition-colors ${location.pathname.startsWith('/dashboard')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة التحكم</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {profile?.full_name || user.email}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل خروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    تسجيل دخول
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {(profile?.role === 'admin' || profile?.role === 'staff' || profile?.role === 'editor') && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md ${location.pathname.startsWith('/dashboard')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>لوحة التحكم</span>
              </Link>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  {profile?.full_name || user.email}
                </div>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل خروج</span>
                </Button>
              </>
            ) : (
              <div className="space-y-2 px-3">
                <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    تسجيل دخول
                  </Button>
                </Link>
                <Link to="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}