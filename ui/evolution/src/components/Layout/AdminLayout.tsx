import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth';
import { useFetchUserData } from '../../utils';
import { 
  FiGrid, 
  FiUsers, 
  FiBriefcase, 
  FiMessageSquare, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiInfo,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';

interface AdminLayoutProps {
  activeTab: 'painel' | 'clients' | 'posts' | 'loans' | 'master';
  setActiveTab: (tab: 'painel' | 'clients' | 'posts' | 'loans' | 'master') => void;
  children: React.ReactNode;
  title: string;
}

interface Notification {
  id: string;
  amount: number;
  dueDate: string;
  alertStatus: 'OVERDUE' | 'TODAY' | 'UPCOMING';
  loan: {
    loanAmount: number;
    paymentMethod: string;
    accountNumber: string;
    customer: {
      fullName: string;
    }
  }
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, setActiveTab, children, title }) => {
  const { logout } = useAuth();
  const { user, loading } = useFetchUserData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const navigation = [
    { name: 'Dashboard', id: 'painel' as const, icon: FiGrid },
    { name: 'Clientes', id: 'clients' as const, icon: FiUsers },
    { name: 'Empréstimos', id: 'loans' as const, icon: FiBriefcase },
    { name: 'Comunicação', id: 'posts' as const, icon: FiMessageSquare },
    { name: 'Configurações', id: 'master' as const, icon: FiSettings, role: 'MASTER' },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${apiUrl}/installments/upcoming`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setNotifications(response.data.payload);
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
      }
    };

    if (user?.role === 'ADMIN' || user?.role === 'MASTER') {
      fetchNotifications();
    }
  }, [apiUrl, user?.role]);

  const filteredNavigation = navigation.filter(item => !item.role || item.role === user?.role || user?.role === 'MASTER');

  const handleSignOut = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status: 'OVERDUE' | 'TODAY' | 'UPCOMING') => {
    switch (status) {
      case 'OVERDUE':
        return {
          label: 'Em atraso',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-100',
          iconColor: 'bg-red-100 text-red-600',
          badge: 'bg-red-500'
        };
      case 'TODAY':
        return {
          label: 'Hoje',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-100',
          iconColor: 'bg-amber-100 text-amber-600',
          badge: 'bg-amber-500'
        };
      default:
        return {
          label: '',
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-700',
          borderColor: 'border-indigo-100',
          iconColor: 'bg-indigo-100 text-indigo-600',
          badge: 'bg-indigo-500'
        };
    }
  };

  if (loading) {
// ... existing loading logic ...
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
                  {filteredNavigation.map((item) => (
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
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                  className="relative p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10 hidden sm:block overflow-visible"
                >
                  <FiBell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border border-[#0a0f1c] text-[10px] flex items-center justify-center font-bold text-white leading-none">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-0 z-50 transform origin-top-right transition-all overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800">Notificações de Pagamentos</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Alertas Gerais
                        </span>
                      </div>
                      
                      <div className="max-h-[450px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => {
                            const config = getStatusConfig(notif.alertStatus);
                            return (
                              <div key={notif.id} className={`px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${config.bgColor}/30`}>
                                <div className="flex items-start gap-4">
                                  <div className={`p-2 rounded-xl ${config.iconColor}`}>
                                    <FiCalendar className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-bold text-slate-900">{notif.loan?.customer?.fullName || 'Cliente Desconhecido'}</p>
                                      {config.label && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${config.badge}`}>
                                          {config.label}
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-2 flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        <span>Vencimento: <span className="font-medium text-slate-700">{formatDate(notif.dueDate)}</span></span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <FiDollarSign className="w-3.5 h-3.5" />
                                        <span>Valor: <span className="font-bold text-emerald-600">{(notif.amount || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></span>
                                      </div>
                                      
                                      {/* Informações adicionais */}
                                      <div className="mt-1 pt-1.5 border-t border-slate-100 flex flex-wrap gap-x-3 gap-y-1">
                                        <span className="text-[10px] text-slate-400">
                                          Total: {(notif.loan?.loanAmount || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                          {notif.loan?.paymentMethod || 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-5 py-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
                              <FiBell className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Sem pagamentos próximos nos próximos 10 dias.</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="px-5 py-3 bg-slate-50 text-center border-t border-slate-100">
                        <button 
                          onClick={() => {
                            setActiveTab('loans');
                            setNotifMenuOpen(false);
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Ver Todos Empréstimos
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 focus:outline-none bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-2xl transition-all border border-white/10"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{user?.role === 'MASTER' ? 'Master User' : 'Administrator'}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shadow-inner overflow-hidden border border-white/20">
                    <img 
                      src={user?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                      alt="Admin" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <FiChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                        <p className="text-sm font-semibold text-slate-800">{user?.name || 'Administrador'}</p>
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
              {filteredNavigation.map((item) => (
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
          <p className="text-sm text-slate-500 mt-1">Bem-vindo de volta ao centro de controlo do Benley Group.</p>
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
