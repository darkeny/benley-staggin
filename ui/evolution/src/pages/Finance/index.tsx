import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loans from '../../components/Loans';
import { ClientFinance } from '../../components/ClientFinance';
import { useFetchUserData } from '../../utils'; 
import { WelcomeModal } from '../../components/Modal/WelcomeModal';

const ClientPanel: React.FC = () => {
    const { logout } = useAuth();
    const { user, loading, error } = useFetchUserData();
    const location = useLocation();
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(location.state?.newClient || false);
    const generatedPassword = location.state?.generatedPassword || '';
    const [activeTab, setActiveTab] = useState<'finance' | 'loans' | 'savings'>('finance');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignOut = () => {
        logout();
    };

    const renderContent = () => {
        if (activeTab === 'loans') return <Loans />;
        if (activeTab === 'savings') return <div className="text-gray-500">Poupanças ainda não disponíveis.</div>;
        return <ClientFinance />;
    };

    if (loading) return <div className="p-4 text-gray-700">Carregando dados do usuário...</div>;
    if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;

    return (
        <div className="min-h-full">
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/">
                                <div className="flex-shrink-0">
                                    <img className="h-10 w-10" src="/logo-benley.png" alt="Benley" />
                                </div>
                            </Link>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a href="#" onClick={() => setActiveTab('finance')}
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'finance' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                        Situação Financeira
                                    </a>
                                    <a href="#" onClick={() => setActiveTab('loans')}
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'loans' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                        Meus Empréstimos
                                    </a>
                                    <a href="#" onClick={() => setActiveTab('savings')}
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'savings' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                        Minhas Poupanças
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                </button>

                                <div className="relative ml-3">
                                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white">
                                        <img className="h-8 w-8 rounded-full" src={user?.photo || '/default-user.png'} alt="Perfil" />
                                    </button>
                                    {userMenuOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700">{user?.name || 'Perfil'}</a>
                                            <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700">Sign out</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex md:hidden">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                <svg className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* SUPER MOBILE MENU (DRAWER) */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-[100] flex justify-end transition-all">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="relative w-72 max-w-[80vw] h-full bg-gray-800 shadow-2xl flex flex-col transform transition-transform">
                            <div className="px-4 py-5 flex justify-between items-center border-b border-gray-700 bg-gray-900/50">
                                <img className="h-8 w-auto" src="/logo-benley.png" alt="Benley" />
                                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                                <a href="#" onClick={() => { setActiveTab('finance'); setMobileMenuOpen(false); }}
                                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${activeTab === 'finance' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                    Situação Financeira
                                </a>
                                <a href="#" onClick={() => { setActiveTab('loans'); setMobileMenuOpen(false); }}
                                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${activeTab === 'loans' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                    Meus Empréstimos
                                </a>
                                <a href="#" onClick={() => { setActiveTab('savings'); setMobileMenuOpen(false); }}
                                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${activeTab === 'savings' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                    Minhas Poupanças
                                </a>
                            </div>
                            <div className="border-t border-gray-700 bg-gray-800/80 p-4">
                                <div className="flex items-center mb-4 px-2">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full border border-gray-600" src={user?.photo || '/default-user.png'} alt="Perfil" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{user?.name || 'Usuário'}</div>
                                        <div className="text-sm font-medium text-gray-400 truncate w-40">{user?.email || 'email@exemplo.com'}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <a href="#" className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">Perfil</a>
                                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">Sair da Conta</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-extralight text-gray-900">Benley Painel do usúario</h1>
                </div>
            </header>

            <main className="bg-gray-10 md:mx-10 overflow-x-hidden relative">
                <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <WelcomeModal 
                        isOpen={showWelcome} 
                        onClose={() => setShowWelcome(false)} 
                        generatedPassword={generatedPassword} 
                    />
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ClientPanel;
