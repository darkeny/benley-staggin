import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlertPopUp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleRedirect = () => {
        navigate('/signup');
    };

    return (
        <>
            {isOpen && (
                <div
                    id="static-modal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed px-4 inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
                >
                    <div
                        className="relative z-10 bg-white rounded-lg shadow-xl transform transition-all duration-300 sm:my-8 sm:max-w-lg w-full p-2 md:p-6"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="container relative isolate px-6 py-14 lg:px-8">
                            <div className="absolute top-2 right-2 z-30">
                                <button
                                    onClick={handleCloseModal}
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mx-auto max-w-2xl text-center relative z-20">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Inscreva-se para a Grupo Benley
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Aproveite esta oportunidade! Alcance seus objetivos e faça seus negócios crescerem!.
                                </p>
                            </div>
                            <div className="absolute inset-0 z-10">
                                <div className="relative w-full h-full bg-gradient-to-tr from-[#5c84ce] to-[#5492e2] opacity-10 blur-3xl"></div>
                            </div>
                            <div className="text-center mt-4 relative z-20">
                                <button
                                    onClick={handleRedirect}
                                    type="button"
                                    className="animate-bounce inline-flex w-full justify-center rounded-md bg-blue-600 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                                >
                                    Seja Cliente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { AlertPopUp };
