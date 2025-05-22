import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HowWork } from "../../components/HowWork";

const HowAbout: React.FC = () => {
    return (
        <>
            <div className="container mx-auto px-4 sm:px-8">
                <Navbar />
            </div>
            <HowWork />
            <Footer />
        </>
    );
};

export { HowAbout };
