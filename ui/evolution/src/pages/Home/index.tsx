import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Link } from "react-router-dom";
import { PageContainer } from "../../components/page-container";
import { Section } from "../../components/section";
import Typewriter from "typewriter-effect";
import { AlertPopUp } from "../../components/Modal/modaPopUp";
import { Benefits } from "../../components/Benefits";
import { Footer } from "../../components/Footer";
import { CoreValues } from "../../components/CoreValues";
import { Newsletter } from "../../components/Newslleter";
import { WhoWeAre } from "../../components/WhoWeAre";
import { Statistics } from "../../components/Statistics";

export function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container mx-auto px-4">
        <Navbar />
      </div>

      {showModal && <AlertPopUp />}

      {/* DESKTOP - conteúdo completo */}
      <div className="hidden md:block">
        <Section className="relative overflow-x-hidden">
          {/* Video Background */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            autoPlay
            loop
            muted
            controls={false}
          >
            <source src="/video/Capital.MP4" type="video/mp4" />
            Your browser does not support the video tag
          </video>

          {/* Blue Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-800 via-transparent to-transparent opacity-80 z-10"></div>

          {/* Dark Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

          {/* Content */}
          <PageContainer className="relative z-20">
            <section className="flex max-w-4xl flex-col-reverse md:flex-row items-center justify-between min-h-[64vh]">
              <div className="flex-1 text-white text-center md:text-left mt-6 md:mt-0">
                <h1
                  data-aos="slide-right"
                  className="font-extrabold uppercase text-2xl sm:text-4xl md:text-4xl lg:text-5xl leading-tight"
                >
                  <div className="min-h-[107px] md:min-h-[100px]">
                    <Typewriter
                      options={{
                        strings: [
                          "Não é apenas sobre o<br/>dinheiro, mas pela confiança",
                          "Garanta um futuro<br/>próspero e seguro agora!"
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 80,
                        deleteSpeed: 15,
                      }}
                    />
                  </div>
                  <span className="block text-lg sm:text-xl font-semibold mt-4">
                    Cooperativa de Poupança e Crédito.
                  </span>
                </h1>
                <div
                  data-aos="slide-right"
                  className="flex flex-col sm:flex-row items-center justify-center md:justify-start mt-6 space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <Link to="/loan">
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition-all duration-300">
                      Solicitar Crédito
                    </button>
                  </Link>
                  <Link to="/services">
                    <button className="ring-1 ring-white text-white hover:bg-white hover:text-blue-800 font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition-all duration-300">
                      Fazer Poupança
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center w-full md:w-auto">
                {/* <img src="/back.gif" ... /> */}
              </div>
            </section>
          </PageContainer>
        </Section>
      </div>

           {/* MOBILE - Layout com janela à direita vertical */}
           <div className="block md:hidden relative min-h-[70vh]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/businessman.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-5"></div>

          {/* Janela transparente na direita */}
          <div className="absolute top-0 py-3 bottom-100 right-0 w-[56%] bg-black bg-opacity-40 backdrop-blur-md p-4 me-3 flex flex-col justify-center gap-2 rounded-b-2xl shadow-lg text-white">
            {/* Título */}
            <h1 className="font-bold text-left">
              Group Benley Microcrédito,
              Crédito que cabe no seu bolso. Poupança que cresce com você.
            </h1>

            {/* Texto */}
            <p className="font-normal text-left leading-relaxed">
              A sua porta de entrada para crédito acessível e poupança segura. Experimente nossos serviços personalizados hoje.
            </p>

            {/* Botões empilhados */}
            <div className="flex flex-col gap-3">
              <a
                href="/loan"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg text-center shadow-md transition"
              >
                Solicitar Crédito
              </a>
              <a
                href="/services"
                className="bg-white bg-opacity-90 text-blue-800 hover:bg-opacity-100 text-sm font-semibold py-2 px-4 rounded-lg text-center shadow-md transition"
              >
                Fazer Poupança
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* Conteúdo restante (mostrado em ambas as views) */}
      <div className="relative p-6 px-5 md:p-14  md:max-w-7xl bg-white rounded-t-3xl lg:rounded-3xl shadow-lg z-30 -mt-14 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div data-aos="zoom-in" className="flex-1 text-center md:text-left">
            <h3 className=" text-2xl text-center md:text-left font-bold tracking-tight text-gray-900 md:text-4xl">
              Garanta um futuro seguro
            </h3>
            <p className="text-sm md:text-lg leading-7 text-gray-600 mt-4">
              Proteja seus sonhos! Comece a poupar hoje e veja seu dinheiro crescer com confiança. Com a Grupo Benley, seu futuro está mais próximo de você.
            </p>
            <Link to={"/services"}>
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 md:py-3 px-3 md:px-8 rounded-lg shadow-lg text-base md:text-lg md:mt-6 mt-3 transition-all duration-300">
                Começar a investir
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4">
        <Benefits />
      </div>
      <CoreValues />
      <Statistics />
      <Newsletter />
      <Footer />
    </>
  );
}
