import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { Chart } from '../../components/Chart';
import Clients from '../../components/Clients';
import { Posts } from '../../components/posts';
import { Link } from 'react-router-dom';
import Loans from '../../components/Loans';
const Panel: React.FC = () => {

    const { logout } = useAuth();

    const handleSignOut = () => {
        logout();
    };

    const [activeTab, setActiveTab] = useState<'painel' | 'clients' | 'posts' | 'loans'>('painel');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const renderContent = () => {
        if (activeTab === 'clients') {
            return <Clients />;
        }
        if (activeTab === 'posts') {
            return <Posts />;
        }

        if (activeTab === 'loans') {
            return <Loans />;
        }

        return (

            <>
                <Chart />
            </>
        );

    };


    return (
        <>
            <div className="min-h-full">
                <nav className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link to={'/'}>
                                    <div className="flex-shrink-0">
                                        <img className="h-8 w-8" src="/logo-benley.png" alt="Your Company" />
                                    </div>
                                </Link>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        <a href="#"
                                            className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'painel' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => setActiveTab('painel')} aria-current="page">Painel
                                        </a>
                                        <a href="#"
                                            className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'clients' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => setActiveTab('clients')}>Clientes
                                        </a>
                                        <a href="#" className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'loans' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => setActiveTab('loans')}>Empréstimos</a>
                                        <a href="#" className={`rounded-md px-3 py-2 text-sm font-medium ${activeTab === 'posts' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`} onClick={() => setActiveTab('posts')}>Comunicação</a>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">View notifications</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                    </button>
                                    <div className="relative ml-3">
                                        <div>
                                            <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                                <span className="absolute -inset-1.5"></span>
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                            </button>
                                        </div>
                                        {userMenuOpen && (
                                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2">Perfil</a>
                                                <a href="#" onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2">Sign out</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                <button type="button" className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" aria-controls="mobile-menu" aria-expanded="false">
                                    <span className="absolute -inset-0.5"></span>
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                    <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-extralight text-gray-900">Benley Plataforma de Monitoramento</h1>
                    </div>
                </header>
                <main className='bg-gray-10'>
                    <div className="mx-auto  px-4 py-6 sm:px-6 lg:px-8 ">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
                        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>
                        {/* <!-- Your content --> */}
                        {renderContent()}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Panel;
