import React from "react";
import { Navbar } from "../../components/Navbar";
import { CoreValues } from "../../components/CoreValues";
import { WhoWeAre } from "../../components/WhoWeAre";
import { Partners } from "../../components/Partners";
import { Footer } from "../../components/Footer";
import { Helmet } from "react-helmet";

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sobre o Grupo Benley | Sua Fonte de Capital</title>
        <meta name="description" content="Conheça a história e missão da Benley Microcrédito. Um grupo dedicado a apoiar o crescimento econômico em Moçambique." />
        <meta name="keywords" content="Grupo Benley, sobre Benley, microcrédito, história, missão, Moçambique" />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-8">
        <Navbar />
        <WhoWeAre />
      </div>
      <CoreValues />
      <Partners />
      <Footer />
    </>
  );
};

export { About };
