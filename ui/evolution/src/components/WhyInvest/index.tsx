import React from 'react';
import { FaSquareCheck } from "react-icons/fa6";
import { SiBuzzfeed } from "react-icons/si";
import { PiPiggyBankFill } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { Link } from 'react-router-dom';

const WhyInvest: React.FC = () => {
    return (
        <>
            <div className="container px-3 mx-auto max-w-screen-xl overflow-hidden bg-white py-5 sm:py-20">
                <div className="px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                        <div data-aos="fade-up" className="lg:pr-8">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base text-center md:text-left font-semibold leading-4 text-indigo-600">Porquê?</h2>
                                <p className="mt-2 text-xl text-center md:text-left font-bold tracking-tight text-gray-900 md:text-4xl">Investir na Grupo Benley?</p>
                                <p className="my-5 md:text-justify text-center md:text-lg text-sm md:leading-8 leading-6 text-gray-600">
                                    Rentabilidade alta, sem taxas de manutenção de capital, segurança e transparência, facilidade de adesão, sem burocracias, garantia de retorno de investimento.
                                </p>
                                <dl className="max-w-xl space-y-5 text-sm md:text-base leading-7 text-gray-600 lg:max-w-none">
                                    <div className="relative pl-9">
                                        <FaSquareCheck className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                        <dt className="inline font-semibold text-gray-900">Facilidade de aprovação.</dt>
                                        <dd className="inline"> Nosso sistema permite um processo rápido e simples para acessar o seu crédito e investimento com agilidade.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <SiBuzzfeed className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                        <dt className="inline font-semibold text-gray-900">Taxas transparentes.</dt>
                                        <dd className="inline"> Oferecemos condições claras e transparentes, para que você saiba exatamente o valor a pagar.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <FaUserTie className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                                        <dt className="inline font-semibold text-gray-900">Área do Cliente.</dt>
                                        <dd className="inline"> Acompanhe suas solicitações e financiamentos a qualquer momento na nossa plataforma.</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-lg grid-cols-1 justify-center items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 gap-x-8">
                            <div data-aos="fade-right" className="rounded-3xl bg-white/60 p-8 ring-1 ring-r-500 sm:p-10">
                            <div className="text-center">
                                <PiPiggyBankFill className="flex md:h-9 md:w-9 h-7 w-7 text-blue-600" aria-hidden="true" />
                            </div>
                                <p className="mt-4 flex items-baseline ">
                                    <span className="text-xl font-extrabold tracking-tight text-blue-600">Conta poupança nos bancos</span>
                                </p>
                                <p className="md:mt-6 mt-2 text-base leading-7 text-gray-600">
                                    Taxa de Administração
                                </p>
                                <p className="mt-2 text-sm font-extrabold tracking-tight text-blue-600">
                                    Juros Variáveis e Falta de transparência                                </p>
                                <p className="md:mt-6 mt-2 text-base leading-7 text-gray-600">
                                    Taxas de lucratividade
                                </p>
                                <p className="mt-2 text-xl font-extrabold tracking-tight text-blue-600">
                                    1.8% a 2.5%
                                </p>
                                <ul className="md:my-8 pb-3 space-y-3 text-sm leading-6 text-gray-600"></ul>
                            </div>
                            <div data-aos="fade-right" className="rounded-3xl bg-white/60 p-8 ring-1 ring-green-500 sm:p-10">
                                <PiPiggyBankFill className=" md:h-9 md:w-9 h-7 w-7 text-green-500" aria-hidden="true" />
                                <p className="md:mt-4 mt-3 flex items-baseline ">
                                    <span className="text-xl font-extrabold tracking-tight text-green-500">Grupo Benley Funding</span>
                                </p>
                                <p className="md:mt-6 mt-2 text-base leading-7 text-gray-600">
                                    Taxa de Administração
                                </p>
                                <p className="mt-2 text-sm font-extrabold tracking-tight text-green-500">
                                    transparência de Juros e Taxas a sua disposição
                                </p>
                                <p className="md:my-5 my-2 text-base leading-7 text-gray-600">
                                    Taxas de lucratividade
                                </p>
                                <p className="mt-2 text-xl font-extrabold tracking-tight text-green-500">
                                    3% a 10%
                                </p>
                                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    <a  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })} aria-describedby="tier-enterprise" className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white ring-1 ring-inset hover:bg-green-600 bg-green-500 ring-green-200 hover:ring-green-300">
                                        Quero investir
                                    </a>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { WhyInvest };
