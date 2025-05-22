import React from 'react';
import { Link } from 'react-router-dom';

const WhoWeAre: React.FC = () => {
    return (
        <div className="overflow-hidden px-5 max-w-7xl py-14 sm:py-32 mx-auto">
            <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                <div
                    className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#00aaff] to-[#319cdf] opacity-30"
                    style={{
                        clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                    }}
                />
            </div>
            <div className="grid max-w-2xl mx-auto gap-x-8 gap-y-16 sm:gap-y-20 lg:max-w-none lg:grid-cols-2">

                {/* Coluna de Texto */}
                <div  className=":pr-8= lg:pt-7">
                    <div className="lg:max-w-screen-2xl">
                        <h2 className="text-base text-center md:text-left font-semibold leading-4 text-indigo-600">
                            Grupo Benley
                        </h2>
                        <p className="mt-2 text-2xl text-center md:text-left font-bold tracking-tight text-gray-900 md:text-4xl">
                            Quem somos?
                        </p>
                        <p className="my-5 md:text-lg text-sm text-justify md:leading-8 leading-7 text-gray-800">
                            A Grupo Benley é uma organização de poupança e crédito dedicada a transformar sonhos em realidade. Oferecemos microcréditos acessíveis e atendimento personalizado para apoiar indivíduos e pequenas empresas. Com foco na poupança responsável e condições justas, somos parceiros no sucesso financeiro de nossos clientes.
                        </p>

                        {/* Botão Solicitar Crédito */}
                        <div className="flex justify-center md:justify-start">
                            <Link to="/loan">
                                <div className="inline-block md:mt-2 rounded-md bg-blue-600 px-10 py-2 text-center text-normal font-semibold text-white shadow-md hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Solicitar crédito
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Coluna da Imagem */}
                <div className="flex justify-center lg:justify-end">
                    <img data-aos="slide-left" src="/GettyImages-1370735949.jpg" alt="Product screenshot" className=" max-w-full rounded-xl shadow-xl" />
                </div>
            </div>
        </div>
    );
};

export { WhoWeAre };
