import React, { useState } from 'react';
import { FaEye, FaHandsHelping } from "react-icons/fa";
import { GiBullseye } from "react-icons/gi";

interface ColersProps {
    text: string;
    title: string;

  }

const CoreValues: React.FC = () => {

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // Toggle card expansion
    const handleToggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="relative overflow-hidden px-3 py-10 sm:py-24">
            <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
                <div
                    className="mx-auto aspect-[1155/758] w-[72.1875rem] bg-gradient-to-tr from-[#00aaff] to-[#005f99] opacity-30"
                    style={{
                        clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                    }}
                />
            </div>
            <div className="mx-auto max-w-7xl px-7 lg:px-8">
                <div data-aos="zoom-in" className="text-center">
                    <h2 className="text-base font-semibold leading-4 text-indigo-600">Nossos valores</h2>
                    <p className="mt-2 font-bold tracking-tight text-gray-900 text-xl sm:text-4xl">Conheça os nosos valores</p>
                    <p className="my-5 lg:text-lg text-sm lg:leading-8 leading-6 text-gray-600 max-w-2xl mx-auto">
                        Conheça os valores que guiam nossa trajetória e inspira cada passo que damos para apoiar você.
                    </p>
                </div>

                <div data-aos="fade-up" className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                    {[
                        {
                            icon: <GiBullseye className="mx-auto h-12 w-9 lg:h-12 lg:w-12 text-indigo-600" />,
                            title: "Missão",
                            description: "Empoderar sonhos e transformar vidas através de soluções de microcrédito inteligentes e acessíveis. Nosso compromisso é entregar não apenas capital, mas confiança, impulsionando indivíduos e empreendedores a conquistar o sucesso com apoio personalizado e sustentável. Na Grupo Benley, cada passo rumo ao futuro é guiado pela excelência e integridade."
                        },
                        {
                            icon: <FaEye className="mx-auto h-12 w-9 lg:h-12 lg:w-12 text-indigo-600" />,
                            title: "Visão",
                            description: "Ser o farol que ilumina o caminho para a independência financeira e o crescimento sustentável. Queremos ser reconhecidos como a ponte que transforma aspirações em realizações, criando um impacto positivo em cada cliente e comunidade que tocamos."
                        },
                        {
                            icon: <FaHandsHelping className="mx-auto h-12 w-9 lg:h-12 lg:w-12 text-indigo-600" />,
                            title: "Valores",
                            description: (
                                <ul className="list-disc list-inside text-left mt-4 space-y-2">
                                    <li><strong>Confiança:</strong> Relacionamentos sólidos baseados em transparência.</li>
                                    <li><strong>Excelência:</strong> Superação de expectativas em cada detalhe do serviço.</li>
                                    <li><strong>Empoderamento:</strong> Oferecimento de crédito com a confiança necessária para o crescimento dos clientes.</li>
                                    <li><strong>Inovação:</strong> Soluções modernas que promovem progresso tangível.</li>
                                    <li><strong>Inclusão:</strong> O crédito como ferramenta de igualdade e oportunidades para todos.</li>
                                    <li><strong>Integridade:</strong> Ética e justiça como pilares fundamentais na jornada financeira.</li>
                                </ul>
                            )
                        }
                    ].map((value, index) => (
                        <div
                            key={index}
                            className={`relative text-center bg-white rounded-2xl shadow-lg p-8 transition-all duration-1000 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${expandedIndex === index ? 'h-auto' : 'h-96 overflow-hidden'
                                } flex flex-col justify-between`}
                            onClick={() => handleToggleExpand(index)}
                        >
                            <div>
                                {value.icon}
                                <h3 className="mt-4 lg:text-xl text-md font-bold text-gray-900">{value.title}</h3>
                                <div className="inline mt-4 lg:text-base text-sm leading-7 text-gray-600">
                                    {typeof value.description === 'string' ? (
                                        <p className={expandedIndex === index ? '' : 'line-clamp-6'}>
                                            {value.description}
                                        </p>
                                    ) : (
                                        <div className={expandedIndex === index ? '' : 'line-clamp-6'}>
                                            {value.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Indicador de expansão */}
                            <div className="mt-4 text-indigo-600 text-sm font-semibold">
                                {expandedIndex === index ? 'Ver menos' : 'Ver mais'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { CoreValues };
