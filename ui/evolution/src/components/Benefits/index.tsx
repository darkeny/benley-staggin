import React from 'react';
import { FaSquareCheck } from "react-icons/fa6";
import { SiBuzzfeed } from "react-icons/si";
import { FaUserTie } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Benefits: React.FC = () => {
    return (
        <>
            <div className="px-3 overflow-hidden bg-white py-8 lg:py-20">
                <div className="lg:px-8">
                    <div className="mx-auto grid grid-cols-1 gap-x-8 sm:gap-y-20 lg:grid-cols-2">
                        <div data-aos="slide-right" className="lg:pr-8 lg:pt-7">
                            <h2 className="text-base text-center md:text-left font-semibold leading-4 text-indigo-600">Grupo Benley</h2>
                            <p className="mt-2 text-xl text-center md:text-left font-bold tracking-tight text-gray-900 md:text-4xl">A melhor solução</p>
                            <p className="my-5 lg:text-lg text-sm lg:text-justify text-center lg:leading-8 leading-7 text-gray-600">Obtenha o crédito que vai transformar seus projetos em realidade. Nosso processo é rápido, confiável e pensado para atender às suas necessidades financeiras.</p>
                            <dl className="space-y-5 text-base leading-7 text-gray-600 ">
                                <div className="relative md:pl-9">
                                    <div className="flex justify-items-center">
                                        <FaSquareCheck className="me-2 md:absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                        <dt className="md:inline text-justify md:text-base text-sm font-semibold text-gray-900">Facilidade de aprovação.</dt>
                                    </div>
                                    <dd className="leading-7 text-sm text-justify lg:text-md">O Nosso sistema permite um processo rápido, seguro e simples para acessar o seu crédito e investimento com agilidade.</dd>
                                </div>
                                <div className="relative md:pl-9">
                                    <div className="flex justify-items-center">
                                        <SiBuzzfeed className="me-2  md:absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                        <dt className="md:inline font-semibold md:text-base text-sm text-gray-900">Taxas transparentes.</dt>
                                    </div>
                                    <dd className="leading-7 text-sm text-justify lg:text-md">Oferecemos aos nossos clientes condições claras e transparentes, para que saiba exatamente o valor a liquidar.</dd>
                                </div>
                                <div className="relative md:pl-9">
                                    <div className="flex justify-items-center">
                                        <FaUserTie className="md:mt-0 me-2  md:absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                        <dt className="md:inline font-semibold md:text-base text-sm text-gray-900">Área do Cliente.</dt>
                                    </div>
                                    <dd className="leading-7 text-sm text-justify lg:text-md">Poderá acompanhar o seu crédito e investimento de forma detalhada a qualquer momento na nossa plataforma.</dd>
                                </div>
                            </dl>
                            {/* Botão Saber Mais */}
                            <div className="flex justify-center md:justify-start">
                                <Link to="/services">
                                    <div className="inline-block mt-5 md:mt-5 rounded-md bg-blue-600 px-10 py-2 text-center text-normal font-semibold text-white shadow-md hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Saber Mais
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <img data-aos="slide-left" src="/loan.png" alt="Product screenshot" className=" hidden md:block w-[48rem] max-w-screen-lg rounded-xl shadow-xl sm:w-[67rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" />
                    </div>
                </div>
            </div>
        </>
    );
};

export { Benefits };
