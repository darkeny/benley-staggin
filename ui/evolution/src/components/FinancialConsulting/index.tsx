import React from 'react';
import { Link } from 'react-router-dom';

const FinancialConsulting: React.FC = () => {
    return (
        <div className="relative isolate px-6 py-10 sm:py-20 lg:px-8">
            <div data-aos="zoom-in" className="mx-auto max-w-7xl text-center">
                <h2 className="text-base font-semibold text-indigo-600">Serviço de Consultoria</h2>
                <p className="mt-2 font-bold tracking-tight text-gray-900 text-xl md:text-5xl">Consultoria Financeira Personalizada</p>
                <p className="mx-auto md:my-6 my-3 max-w-4xl text-center text-sm leading-7 text-gray-600 sm:text-xl/8">
                    Oferecemos consultoria financeira para ajudá-lo a otimizar seus investimentos e melhorar sua gestão financeira.
                    Nossos especialistas trabalham com você para criar estratégias que atendam às suas necessidades financeiras.
                </p>
            </div>

            <div data-aos="fade-up" className="md:my-16 my-8 grid gap-10 lg:grid-cols-3 lg:gap-8 px-3 max-w-6xl mx-auto">
                <div className="rounded-lg shadow-lg p-8 ring-1">
                    <h3 className="text-base/7 font-semibold text-indigo-600">Planejamento Financeiro</h3>
                    <p className="my-4 text-sm text-gray-600">
                        Analisamos seu perfil e criamos um plano financeiro personalizado, alinhado aos seus objetivos de curto e longo prazo.
                    </p>
                    <ul role="list" className="mt-6 md:space-y-3 space-y-2 text-sm text-gray-600">
                        <li className="flex gap-x-3">
                            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Análise de perfil financeiro
                        </li>
                        <li className="flex gap-x-3">
                            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Plano de investimento sob medida
                        </li>
                    </ul>
                </div>

                <div className="rounded-lg bg-indigo-600 p-8 shadow-lg text-white ring-1 ring-indigo-500">
                    <h3 className="text-base/7 font-semibold ">Gerenciamento de Risco</h3>
                    <p className="mt-4 text-sm">
                        Identificamos e mitigamos riscos financeiros, garantindo que você possa investir com segurança e tranquilidade.
                    </p>
                    <ul role="list" className="mt-6 md:space-y-3 space-y-2 text-sm">
                        <li className="flex gap-x-3">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Avaliação de perfil de risco
                        </li>
                        <li className="flex gap-x-3">
                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Redução de exposição a riscos
                        </li>
                    </ul>
                </div>

                <div className="rounded-lg bg-white shadow-lg p-8 ring-1">
                    <h3 className="text-base/7 font-semibold text-indigo-600">Apoio em Decisões</h3>
                    <p className="mt-4 text-sm text-gray-600">
                        Nossos consultores estão prontos para apoiá-lo em decisões importantes, proporcionando insights e orientação estratégica.
                    </p>
                    <ul role="list" className="mt-6 md:space-y-3 space-y-2 text-sm text-gray-600">
                        <li className="flex gap-x-3">
                            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Análise de mercado e oportunidades
                        </li>
                        <li className="flex gap-x-3">
                            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Planejamento de crescimento sustentável
                        </li>
                    </ul>
                </div>
            </div>
            <div data-aos="fade-up" className="text-center">
                <Link to={'/consulting'}>
                    <a className="inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">Marcar consulta agora</a>
                </Link>
            </div>
        </div>
    );
};

export { FinancialConsulting };
