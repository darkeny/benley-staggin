import React from 'react';
import { Link } from 'react-router-dom';

const OurServices: React.FC = () => {

    return (
        <>

            <div className="relative isolate bg-white px-8 py-12 sm:py-32 lg:px-8">
                <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                    <div
                        className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#00aaff] to-[#005f99] opacity-30"
                        style={{
                            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    />
                </div>
                <div data-aos="zoom-in">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="text-base/7 font-semibold text-indigo-600">Nossos serviços</h2>
                        <p className="mt-2 text-xl text-center font-bold tracking-tight text-gray-900 md:text-6xl">Conheça os nossos serviços</p>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-gray-600 sm:text-xl/8">Escolha o serviço que deseja começar que nós o proporcionaremos os melhores recursos e fidelidade para impulsionar seus objectivos.</p>
                </div>
                <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                    <div data-aos="slide-left" className="rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-bl-3xl lg:rounded-tr-none">
                        <h3 id="tier-hobby" className="text-base/7 font-semibold text-indigo-600">Crédito</h3>
                        <p className="md:mt-4 flex items-baseline gap-x-2">
                            <span className="text-2xl md:text-5xl font-semibold tracking-tight text-gray-900">5000 MT</span>
                            <span className="text-sm text-gray-500">/ valor mínimo</span>
                        </p>
                        <p className="md:my-6 my-5  text-sm text-gray-600">Adira já o seu crédito e impulsione os seus investimentos financeiros agora.</p>
                        <ul role="list" className="space-y-2 md:space-y-3 text-sm/6 text-gray-600 sm:mt-10">
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                30% de taxas de Juros
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Sem taxas de impostos
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Segurança e Transparência
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                Tempo de resposta de suporte 24 horas
                            </li>
                        </ul>
                        <Link to={'/loan'}>
                            <a aria-describedby="tier-hobby" className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10">Comece hoje mesmo</a>
                        </Link>
                    </div>
                    <div data-aos="slide-right" className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
                        <h3 id="tier-enterprise" className="text-base/7 font-semibold text-indigo-400">Poupança</h3>
                        <p className="md:my-6 flex items-baseline gap-x-2">
                            <span className="text-2xl md:text-5xl font-semibold tracking-tight text-white">15.000 MT</span>
                            <span className="text-sm text-gray-400">/ valor mínimo</span>
                        </p>
                        <p className="md:mt-6 my-4 text-sm text-gray-300">Começe agora investindo connosco com a melhor infraestrutura dedicados para você.</p>
                        <ul role="list" className="py-3 space-y-2 md:space-y-3 text-sm/6 text-gray-300 sm:mt-10">
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                90 dias de contrato
                            </li>
                            <li className="flex gap-x-3">
                                <svg className="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                                2.5% de taxas de lucro
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
                        <a onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })} aria-describedby="tier-enterprise" className="mt-4 block rounded-md bg-indigo-500 px-3.5 py-3 md:py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10">Começar a investir</a>
                    </div>
                </div>
            </div>

        </>

    );
};

export { OurServices };
