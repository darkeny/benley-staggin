import React from 'react';
import { Link } from 'react-router-dom';

const Partners: React.FC = () => {
    return (
        <div className="overflow-hidden bg-white px-8 max-w-7xl py-14 sm:py-32 mx-auto">
            <div className="grid max-w-2xl mx-auto gap-x-8 gap-y-16 sm:gap-y-20 lg:max-w-none lg:grid-cols-2">

                {/* Coluna da Imagem */}
                <div className="flex justify-center lg:justify-start">
                    <img data-aos="slide-right" src="/Colorful Logo.png" alt="Logo da OPAC Advogados" className="max-w-full rounded-xl shadow-xl" />
                </div>

                {/* Coluna de Texto */}
                <div data-aos="slide-left" className="lg:pl-8 lg:pt-7">
                    <div className="lg:max-w-screen-2xl">
                        <h2 className="text-base text-center md:text-left font-semibold leading-4 text-indigo-600">
                            Parcerias
                        </h2>
                        <p className="mt-2 text-xl text-center md:text-left font-bold tracking-tight text-gray-900 md:text-4xl">
                            Nossos parceiros
                        </p>
                        <p className="my-5 lg:text-lg text-sm text-justify lg:leading-8 leading-7 text-gray-600">
                            A Grupo Benley tem a honra de contar com a OPAC Advogados, SU, Limitada como nosso parceiro estratégico. Com sua vasta experiência jurídica, a OPAC nos oferece proteção e orientação em questões legais, assegurando que nossa empresa esteja bem estruturada. Essa colaboração é essencial para garantir segurança e confiança aos nossos clientes, permitindo que nos concentremos em transformar sonhos em realizações financeiras.
                        </p>


                        {/* Botão Solicitar Crédito */}
                        <div className="flex justify-center md:justify-start">
                            <Link to="/loan">
                                <div className="inline-block md:mt-2 rounded-md bg-blue-950 px-10 py-2 text-center text-normal font-semibold text-white shadow-md hover:bg-indigo-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Solicitar crédito
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Partners };
