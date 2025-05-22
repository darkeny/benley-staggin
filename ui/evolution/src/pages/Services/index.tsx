import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { OurServices } from "../../components/OurService";
import { ForWhom } from "../../components/ForWhom";
import { InvestmentPackages } from "../../components/InvestmentPackages";
import { WhyInvest } from "../../components/WhyInvest";
import { FinancialConsulting } from "../../components/FinancialConsulting";
import { ConsultingModal } from "../../components/Modal/ConsultingModal";
import { CapitalSeguro } from "../../components/SafeCapital";

const Services: React.FC = () => {
    return (
        <>
            <div className="container mx-auto px-4">
                <Navbar />
            </div>
            <OurServices />
            <CapitalSeguro />
            <FinancialConsulting />
            <ForWhom />
            <WhyInvest />
            <InvestmentPackages />
            <Footer />
            <ConsultingModal text="test" subtitles="Obrigado por solicitar uma consulta financeira com os nossos consultores, informe os dados para finalizar" />
        </>
    );
};

export { Services };
