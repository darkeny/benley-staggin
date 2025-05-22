import React from 'react';
import { Link } from 'react-router-dom';

const InvestmentPackages: React.FC = () => {

    return (
        <>

            <div id="packages" className="relative isolate bg-white px-6 py-12 sm:pb-32 lg:px-8">
                <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                    <div
                        className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#00aaff] to-[#005f99] opacity-30"
                        style={{
                            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    />
                </div>
                <div data-aos="zoom-in">
                    <div className="mx-auto max-w-7xl text-center">
                        <h2 className="text-base/7 font-semibold text-indigo-600">Planos de investimento</h2>
                        <p className="mt-2 text-xl text-center font-bold tracking-tight text-gray-900 md:text-6xl">Conheça os planos de investimento</p>
                    </div>
                    <p className="mx-auto md:mt-6 mt-4 max-w-2xl text-center md:text-lg text-sm leading-8 text-gray-600 sm:text-xl/8">Escolha o plano que deseja investir que nós o proporcionaremos os melhores recursos e fidelidade para impulsionar seus objectivos.</p>
                </div>
                <div className="mx-auto mt-10 grid grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-screen-2xl lg:grid-cols-3">
                    <div data-aos="fade-right" className="rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-bl-3xl lg:rounded-tr-none">
                        <h3 id="tier-hobby" className="text-xl font-semibold text-indigo-600">Standard</h3>
                        <p className="md:mt-4 flex items-baseline gap-x-2">
                            <span className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900">5.000 mzn</span>
                            <span className="md:text-base text-sm text-gray-500">/ valor mínimo</span>
                        </p>
                        <p className="md:mt-6 mt-4 md:text-base/7 text-sm text-gray-600">O plano Standard oferece <strong>3%</strong> de taxa de lucro a ser arecadado todos os meses.</p>
                        <ul role="list" className="mt-8 md:space-y-3 space-y-2 text-sm/6 text-gray-600 sm:mt-10">
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                90 dias de contrato
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                3% de taxas de lucro
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Valor a receber no fim do contracto
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Tempo de resposta de suporte 24 horas
                            </li>
                        </ul>
                        <Link to={'/loan'}>
                            <a aria-describedby="tier-hobby" className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10">Quero investir</a>
                        </Link>
                    </div>
                    <div data-aos="zoom-in" className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
                        <h3 id="tier-enterprise" className="text-xl font-semibold text-indigo-400">Essential</h3>
                        <p className="md:mt-4 flex items-baseline gap-x-2">
                            <span className="text-2xl md:text-5xl font-semibold tracking-tight text-white">25.000 mzn</span>
                            <span className="md:text-base text-sm text-gray-400">/ valor mínimo</span>
                        </p>
                        <p className="md:mt-6 mt-4 md:text-base/7 text-sm text-gray-300">O plano partner oferece <strong>7%</strong> de taxa de lucro a ser arecadado todos os meses.</p>
                        <ul role="list" className="md:py-6 mt-8 md:space-y-3 space-y-2 text-sm/6 text-gray-300 sm:mt-10">
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                180 dias de contrato
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                7% de taxas de lucro
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Valor a receber no fim do contracto
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Tempo de resposta de suporte 24 horas
                            </li>
                        </ul>
                        <a href="#" aria-describedby="tier-enterprise" className="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10">Quero investir</a>
                    </div>
                    <div data-aos="fade-left" className="rounded-3xl rounded-t-none bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-3xl sm:p-10 lg:mx-0 lg:rounded-bl-none lg:rounded-tr-3xl">
                        <h3 id="tier-hobby" className="text-xl font-semibold text-indigo-600">Premium</h3>
                        <p className="md:mt-4 flex items-baseline gap-x-2">
                            <span className="text-2xl md:text-5xl font-semibold tracking-tight text-gray-900">50.000 mzn</span>
                            <span className="md:text-base text-sm text-gray-500">/ valor mínimo</span>
                        </p>
                        <p className="md:mt-6 mt-4 md:text-base/7 text-sm text-gray-600">O plano premium oferece <strong>10%</strong> de taxa de lucro a ser arecadado todos os meses.</p>
                        <ul role="list" className="mt-8 md:space-y-3 space-y-2 text-sm/6 text-gray-600 sm:mt-10">
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                365 dias de contrato
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                10% de taxas de Juro
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Valor a receber no fim do contracto
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Tempo de resposta de suporte 24 horas
                            </li>
                        </ul>
                        <Link to={'/loan'}>
                            <a aria-describedby="tier-hobby" className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10">Quero investir</a>
                        </Link>
                    </div>
                </div>
            </div>

        </>

    );
};

export { InvestmentPackages };
