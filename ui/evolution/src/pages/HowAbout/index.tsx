import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HowWork } from "../../components/HowWork";
import { Helmet } from 'react-helmet-async';

const HowAbout: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Como Funciona o Crédito | Group Benley Microcrédito</title>
                <meta name="description" content="Aprenda passo a passo como solicitar um crédito com o Group Benley. Microcrédito seguro, rápido e acessível em Moçambique." />
                <meta name="keywords" content="como funciona, crédito, microcrédito, Benley, Group Benley, empréstimo Moçambique, passo a passo crédito" />
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
