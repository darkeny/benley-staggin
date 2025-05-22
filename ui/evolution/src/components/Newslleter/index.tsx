import axios from 'axios';
import React, { useState } from 'react';
import { Alert } from '../Modal/alert';
import { SuccessAlert } from '../Modal/successAlert';
import { FaSpinner } from 'react-icons/fa6';
import ERROR_MESSAGES from '../../constants/error-messages';

const Newsletter: React.FC = () => {

    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email) {
            setAlertText('Para se juntar a nossa Newsletter adicione o seu email.');
            setIsModalOpen(true);
        } else {
            setLoading(true); // Set loading to true when form submission starts
            try {
                // Lógica de submissão do formulário
                const response = await axios.post(`${apiUrl}/newsletter`, { email });
                if (response.status === 200) {
                    setAlertText('Email cadastrado com sucesso!');
                    setIsModalSuccessOpen(true);

                    setEmail('');

                } else {
                    setAlertText('Email cadastrado com sucesso!');
                    setIsModalSuccessOpen(true);

                    setEmail('');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                setAlertText('Falha ao enviar a mensagem. Tente novamente mais tarde.');
                setIsModalOpen(true);

                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.data) {
                        if (error.response.data.error === ERROR_MESSAGES.duplicateEmail) {
                            setAlertText(ERROR_MESSAGES.duplicateEmail);

                        } else {
                            setAlertText('Ocorreu um erro ao enviar o formulário.');
                        }
                    } else {
                        setAlertText('Ocorreu um erro ao enviar o formulário.');
                    }
                } else {
                    setAlertText('Ocorreu um erro desconhecido.');
                }
            } finally {
                setLoading(false); // Set loading to false when form submission completes
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };



    return (
        <>
            <div className="relative isolate overflow-hidden  py-16 sm:py-24 lg:py-32">
                <div className="inset-0 -z-10 overflow-hidden">
                    <svg className="absolute left-[max(50%,25rem)] top-0 h-[34rem] w-[108rem] -translate-x-4/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]" aria-hidden="true">
                        <defs>
                            <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                                <path d="M100 200V.5M.5 .5H200" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" strokeWidth="0" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
                    </svg>
                </div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                        <div data-aos="zoom-in" className="max-w-xl lg:max-w-lg">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">Seja o primeiro <br /> a receber nossas novidades!</h2>
                            <p className="mt-4 lg:text-lg text-sm leading-8 text-gray-700">Receba ofertas exclusivas e informações sobre nossos produtos. Junte-se a nós e dê o primeiro passo rumo à independência financeira!</p>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="mt-6 flex max-w-md gap-x-4">
                                    <label htmlFor="email" className="sr-only">Endereço de e-mail</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" autoComplete="email" className="min-w-0 flex-auto rounded-lg border border-gray-300 px-3.5 py-2   focus:ring-gray-400 sm:text-sm sm:leading-6" placeholder="Digite seu e-mail" />
                                    <button
                                        type="submit"
                                        className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <FaSpinner className="animate-spin h-5 w-5" />
                                                <span className="ml-2">Enviando...</span>
                                            </div>
                                        ) : (
                                            'Inscrever-se'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <dl data-aos="fade-right" className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="rounded-full bg-indigo-100 p-4">
                                    <svg className="md:h-6 md:w-6 h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l6 5 6-5V7m0-4v4l6 5m-6-9L9 7m0-4L3 7m6 0v4m0 0l3-3 3 3" />
                                    </svg>
                                </div>
                                <dt className="mt-4 font-semibold text-gray-900">Dicas financeiras</dt>
                                <dd className="md:text-left text-center md:text-base text-sm mt-2 text-gray-600">Receba conteúdos sobre como gerir suas finanças, economizar e aproveitar melhor seu capital.</dd>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <div className="rounded-full bg-green-100 p-4">
                                    <svg className="md:h-6 md:w-6 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 15l2 2 4-4m5 6h6M12 6h8m-8 8h4M6 18v-6m0 0H2v6m0-6h2" />
                                    </svg>
                                </div>
                                <dt className="mt-4 font-semibold text-gray-900">Sem spam</dt>
                                <dd className="md:text-left text-center md:text-base text-sm mt-2 text-gray-600">Garantimos que você só receberá informações relevantes e ofertas exclusivas.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
            <Alert text={alertText} isOpen={isModalOpen} onClose={handleCloseModal} />

            {isModalSuccessOpen && (
                <SuccessAlert
                    isOpen={isModalSuccessOpen}
                    text={alertText}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export { Newsletter };
