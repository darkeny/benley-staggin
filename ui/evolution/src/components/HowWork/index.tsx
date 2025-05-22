import React from 'react';
import { RiCheckDoubleFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const HowWork: React.FC = () => {

    return (
        <>
            <div className="py-14 sm:py-16">
                <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                    <div
                        className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#00aaff] to-[#005f99] opacity-30"
                        style={{
                            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                        }}
                    />
                </div>
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                    <div data-aos="zoom-in">
                        <h2 className="text-center text-base/7 font-semibold text-indigo-600">Como funciona?</h2>
                        <p className="mx-auto mt-2 max-w-4xl text-balance text-center font-semibold tracking-tight text-gray-950 text-2xl sm:text-5xl">Conheça o processo para adquirir o seu crédito</p>
                    </div>
                    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                        <div data-aos="slide-right" className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-blue-100 p-2">
                                            <span className="text-lg font-bold text-blue-600">1</span>
                                        </div>
                                        <p className="ml-3 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Inscrição na plataforma</p>
                                    </div>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Primeiro, você precisa se cadastrar na nossa plataforma, criando sua conta de forma rápida e segura.</p>
                                </div>
                                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                                    <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                                        <img className="size-full object-cover object-top" src="/signup.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
                        </div>
                        <div data-aos="fade-down" className="relative max-lg:row-start-2">
                            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-blue-100 p-2">
                                            <span className="text-lg font-bold text-blue-600">2</span>
                                        </div>
                                        <p className="ml-3 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Solicitação do empréstimo</p>
                                    </div>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Após o cadastro, você poderá fazer sua solicitação de empréstimo, informando o valor e as condições desejadas.</p>
                                </div>
                                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                                    <img className="w-full max-lg:max-w-xs" src="/bitmap.png" alt="" />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
                        </div>
                        <div data-aos="fade-up" className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                            <div className="absolute inset-px rounded-lg bg-white"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-blue-100 p-2">
                                            <span className="text-lg font-bold text-blue-600">3</span>
                                        </div>
                                        <p className="ml-3 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Aguarde a aprovação</p>
                                    </div>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Nossa equipe analisará a sua solicitação. Esse processo é ágil e você será informado(a) assim que tivermos uma resposta.</p>
                                </div>
                                <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                                    <img className="h-[min(152px,40cqw)] object-cover object-center" src="https://tailwindui.com/plus/img/component-images/bento-03-security.png" alt="" />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
                        </div>
                        <div data-aos="zoom-in" className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                <div className="px-8 pb-3 pt-48 sm:px-10 sm:pb-0 sm:pt-10">
                                    <div className="flex items-center">
                                        <div className="rounded-full bg-green-100 p-2">
                                            <RiCheckDoubleFill className="h-6 w-6 text-green-600" />
                                        </div>
                                        <p className="ml-3 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Tudo pronto!</p>
                                    </div>
                                    <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">Com o empréstimo aprovado, você pode acompanhar todos os detalhes do seu crédito e das suas finanças diretamente na plataforma.</p>
                                </div>
                                <div className="relative w-full grow">
                                    <div className="absolute bottom-0 pb-9 left-0 overflow-hidden rounded-tl-xl bg-white shadow-2xl">
                                        <img className="object-cover" src="/bg.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                        </div>
                    </div>
                </div>

                <Link to={'/loan'} className='text-center flex justify-center'>
                    <div className="mt-8 block max-auto rounded-md bg-indigo-500 px-10 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10">Solicitar créditor</div>
                </Link>

            </div>
        </>
    );
}

export { HowWork };
