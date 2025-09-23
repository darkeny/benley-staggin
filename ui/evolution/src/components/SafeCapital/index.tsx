import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InvestmentForm } from './InvestmentForm';

const CapitalSeguro: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="relative isolate bg-gradient-to-r from-[#4b83b1] to-[#005f99] px-8 py-12 md:py-0">
            {/* Decoração no fundo */}
            <div className="absolute inset-x-0 -top-8 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                <div
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ffffff66] to-[#00aaff33] opacity-40"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            {/* Conteúdo principal */}
            <div className="container mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                {/* Coluna do texto */}
                <div className="text-white space-y-4" data-aos="fade-left">
                    <div className="max-w-4xl">
                        <h2 className="text-base/7 font-semibold text-white">Capital seguro</h2>
                    </div>
                    <h2 className="text-3xl font-bold sm:text-5xl">
                        Proteja e faça crescer seu capital
                    </h2>
                    <p className="text-lg leading-relaxed sm:text-xl/relaxed">
                        Escolha o serviço que deseja começar, e nós proporcionaremos os melhores recursos e fidelidade para impulsionar seus objetivos.
                    </p>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-block bg-white text-[#005f99] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition"
                    >
                        {showForm ? 'Cancelar Investimento' : 'Começar a Investir'}
                    </button>
                </div>

                {/* Coluna da imagem ou formulário */}
                <div
                    data-aos="fade-right"
                    className="flex justify-center items-center min-h-screen"
                    style={{ minHeight: "624px" }}
                >
                    {showForm ? (
                        <div className="w-full max-w-lg p-6">
                            <InvestmentForm />
                        </div>
                    ) : (
                        <div className="relative rounded-2xl p-[3px] overflow-hidden group">
                            {/* Borda LED dinâmica */}
                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                {/* Topo */}
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[move1_3s_linear_infinite]"></div>
                                {/* Base */}
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 animate-[move2_4s_linear_infinite]"></div>
                                {/* Lateral esquerda */}
                                <div className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 animate-[move3_5s_linear_infinite]"></div>
                                {/* Lateral direita */}
                                <div className="absolute top-0 right-0 h-full w-[3px] bg-gradient-to-b from-blue-500 via-pink-500 to-purple-500 animate-[move4_6s_linear_infinite]"></div>
                            </div>

                            {/* Conteúdo da imagem */}
                            <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl transform transition duration-500 group-hover:rotate-3 group-hover:scale-105 group-hover:-translate-y-1">
                                <img
                                    src="/front-view-happy-parents-kids.jpg"
                                    alt="Capital Seguro"
                                    className="w-full h-auto object-cover rounded-2xl"
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export { CapitalSeguro };
