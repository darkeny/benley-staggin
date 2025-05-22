import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-2 lg:py-8">
            <div data-aos="zoom-in" className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Company Name and Description */}
                <div className="flex flex-col items-center md:items-start space-x-0 md:flex-row md:space-x-3 justify-center">
                    <img
                        src="/logo-benley.png"
                        alt="Logo"
                        className="md:w-10 md:h-10 h-8 w-8 lg:pb-2"
                    />
                    <h2 className="md:text-xl font-semibold md:mt-0 text-center md:text-left">Grupo Benley</h2>
                </div>

                {/* Solutions */}
                <div className='hidden md:block'>
                    <h3 className="text-xl font-semibold mb-3">Soluções</h3>
                    <ul className="space-y-1">
                        <li><a href="/loan" className="text-gray-400 hover:text-gray-300">Crédito</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Poupança</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Capital Seguro</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Consultoria Financeira</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div className='hidden md:block'>
                    <h3 className="text-xl font-semibold mb-3">Suporte</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Preços</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Documentação</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Guides</a></li>
                        <li><a href="/contact" className="text-gray-400 hover:text-gray-300">Apoio ao Cliente</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div className='hidden md:block'>
                    <h3 className="text-xl font-semibold mb-3">Empresa</h3>
                    <ul className="space-y-1">
                        <li><a href="/" className="text-gray-400 hover:text-gray-300">Home</a></li>
                        <li><a href="/services" className="text-gray-400 hover:text-gray-300">Serviços</a></li>
                        <li><a href="/about" className="text-gray-400 hover:text-gray-300">Sobre Nós</a></li>
                        <li><a href="/contact" className="text-gray-400 hover:text-gray-300">Contactos</a></li>
                        <li><a href="/howabout" className="text-gray-400 hover:text-gray-300">Como Funciona</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className='hidden md:block'>
                    <h3 className="text-xl font-semibold mb-3">Jurídico</h3>
                    <ul className="space-y-1">
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Termos</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-gray-300">Privacidade</a></li>
                    </ul>
                </div>
            </div>

            <div className="flex px-5 justify-center text-sm  lg:mt-8 mt-4 border-t border-gray-700 pt-4 text-center text-gray-400">
                <div className="ma">
                    <p>&copy; {new Date().getFullYear()} Grupo Benley. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
