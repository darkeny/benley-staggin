import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import { useFetchUserData } from '../../utils';
import { 
  FiGrid, 
  FiBriefcase, 
  FiDollarSign,
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell,
  FiUser,
  FiChevronDown
} from 'react-icons/fi';

interface ClientLayoutProps {
  activeTab: 'loans' | 'finance';
  setActiveTab: (tab: 'loans' | 'finance') => void;
  children: React.ReactNode;
  title: string;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ activeTab, setActiveTab, children, title }) => {
  const { logout } = useAuth();
  const { user, loading } = useFetchUserData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Financeiro', id: 'finance' as const, icon: FiDollarSign },
    { name: 'Meus Empréstimos', id: 'loans' as const, icon: FiBriefcase },
  ];

  const handleSignOut = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-[#0a0f1c] text-white sticky top-0 z-50 shadow-lg border-b border-[#1a2235]">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img className="h-10 w-auto filter drop-shadow-md" src="/logo-benley.png" alt="Benley" />
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden lg:block ml-10">
                <div className="flex items-baseline space-x-1">
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeTab === item.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-300 hover:bg-[#1a2235] hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 hidden sm:block">
                <FiBell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0f1c]"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 focus:outline-none bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-2xl transition-all border border-white/10"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{user?.name || 'Cliente'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Área do Cliente</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shadow-inner overflow-hidden border border-white/20 text-white font-bold">
                    {user?.name?.charAt(0) || <FiUser />}
                  </div>
                  <FiChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                        <p className="text-sm font-semibold text-slate-800">{user?.name || 'Cliente'}</p>
                        <p className="text-xs text-slate-500 truncate">Benley Group</p>
                      </div>
                      <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                        <FiUser className="h-4 w-4" />
                        Meu Perfil
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="h-4 w-4" />
                        Terminar Sessão
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2235] focus:outline-none transition-colors"
                >
                  {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0d1425] border-t border-[#1a2235]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-[#1a2235] hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                <FiLogOut className="h-5 w-5" />
                Sair
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Header (Sub-header) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie seus empréstimos e finanças com segurança.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-full mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/30 to-transparent pointer-events-none -z-10"></div>
        
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-slate-500 font-medium">© 2026 Benley Group. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
