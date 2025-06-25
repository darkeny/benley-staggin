import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HowWork } from "../../components/HowWork";
import { Helmet } from "react-helmet";

const HowAbout: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Como Funciona o Crédito | Grupo Benley Microcrédito</title>
                <meta name="description" content="Aprenda passo a passo como solicitar um crédito com o Grupo Benley. Microcrédito seguro, rápido e acessível em Moçambique." />
                <meta name="keywords" content="como funciona, crédito, microcrédito, Benley, Grupo Benley, empréstimo Moçambique, passo a passo crédito" />
            </Helmet>
            <div className="container mx-auto px-4 sm:px-8">
                <Navbar />
            </div>
            <HowWork />
            <Footer />
        </>
    );
};

export { HowAbout };
