import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleRedirect = () => {
        navigate('/signup');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <nav className="bg-white my-2">
                <div className="mx-auto shadow-lg rounded-lg p-5 max-w-7xl px-2 sm:px-6 hover:shadow-2xl lg:px-8 transition-shadow duration-1000">
                    <div className="relative flex h-16 items-center justify-between">
                        {/* Left Logo */}
                        <a href='/' className="flex flex-1 items-center justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <img className="h-28 w-auto" src="/logo-benley.png" alt="Your Company" />
                                <span className='mr-5 block text-sm font-extrabold leading-6 px-3 py-2 hover:text-blue-500 whitespace-nowrap'> Group Benley</span>
                            </div>
                        </a>

                        {/* Main navigation for larger screens */}
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                            <div className="flex space-x-4 flex-nowrap">
                                <NavLink to="/" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`} aria-current="page">Home</NavLink>
                                <NavLink to="/about" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Sobre Nós</NavLink>
                                <NavLink to="/services" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Serviços</NavLink>
                                <NavLink to="/howabout" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Como Funciona</NavLink>
                                <NavLink to="/simulador" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Simulador</NavLink>
                                <NavLink to="/contact" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Contactos</NavLink>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                            <div className="relative flex items-center space-x-4">
                            </div>
                            <button type="button" onClick={toggleMenu} className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={menuOpen}>
                                <span className="sr-only">Open main menu</span>
                                {menuOpen ? (
                                    <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Right Sign Up Button for larger screens */}
                        <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="relative flex items-center space-x-4">
                                <button onClick={handleRedirect} className='flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
                                    <CiLogin size={18} />
                                    Inscreva-se
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="sm:hidden" id="mobile-menu">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <NavLink to="/" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`} aria-current="page">Home</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Sobre Nós</NavLink>
                            <NavLink to="/services" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Serviços</NavLink>
                            <NavLink to="/howabout" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Como Funciona</NavLink>
                            <NavLink to="/simulador" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Simulador</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `block text-sm font-normal leading-6 px-3 py-2 ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-900 hover:text-blue-500'} whitespace-nowrap`}>Contactos</NavLink>
                            <button onClick={handleRedirect} className='flex items-center gap-2 w-full text-left rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'>
                                <CiLogin size={18} />
                                Inscreva-se
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export { Navbar };
