import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { Link, useNavigate } from 'react-router-dom';
import Loans from '../../components/Loans';
import { ClientFinance } from '../../components/ClientFinance';
import { useFetchUserData } from '../../utils'; 

const ClientPanel: React.FC = () => {
    const { logout } = useAuth();
    const { user, loading, error } = useFetchUserData();
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

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="md:hidden" id="mobile-menu">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            <a href="#" onClick={() => { setActiveTab('finance'); setMobileMenuOpen(false); }}
                                className={`block rounded-md px-3 py-2 text-base font-medium ${activeTab === 'finance' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                Situação Financeira
                            </a>
                            <a href="#" onClick={() => { setActiveTab('loans'); setMobileMenuOpen(false); }}
                                className={`block rounded-md px-3 py-2 text-base font-medium ${activeTab === 'loans' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                Meus Empréstimos
                            </a>
                            <a href="#" onClick={() => { setActiveTab('savings'); setMobileMenuOpen(false); }}
                                className={`block rounded-md px-3 py-2 text-base font-medium ${activeTab === 'savings' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                Minhas Poupanças
                            </a>
                        </div>
                        <div className="border-t border-gray-700 pt-4 pb-3">
                            <div className="px-5 flex items-center">
                                <div className="flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full" src={user?.photo || '/default-user.png'} alt="Perfil" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{user?.name || 'Usuário'}</div>
                                    <div className="text-sm font-medium text-gray-400">{user?.email || 'email@exemplo.com'}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <a href="#" className="block px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Perfil</a>
                                <a href="#" onClick={handleSignOut} className="block px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Sign out</a>
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

            <main className="bg-gray-10 md:mx-10">
                <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ClientPanel;
