import React, { useState } from 'react';
import { Alert } from '../../components/Modal/alert';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { Navbar } from '../../components/Navbar';
import { SuccessAlert } from '../../components/Modal/successAlert';

const Contact: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!subject || !email || !message) {
            setAlertText('Todos os campos são obrigatórios.');
            setIsModalOpen(true);
        } else {
            setLoading(true); // Set loading to true when form submission starts
            try {
                // Lógica de submissão do formulário
                const response = await axios.post(`${apiUrl}/sendMessage`, { subject, email, message });
                if (response.status === 200) {
                    setAlertText('Mensagem enviada com sucesso!');
                    setIsModalSuccessOpen(true);
                    setSubject('');
                    setEmail('');
                    setMessage('');
                } else {
                    setAlertText('Falha ao enviar a mensagem. Tente novamente mais tarde.');
                    setIsModalOpen(true);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                setAlertText('Falha ao enviar a mensagem. Tente novamente mais tarde.');
                setIsModalOpen(true);
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
            <header className="bg-white shadow">
                <Navbar />
            </header>
            <main className='bg-gray-10'>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                    <div className="hidden md:block absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
                    <div className="hidden md:block absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>

                    <div data-aos="zoom-in" className="mx-auto max-w-8xl sm:px-10 sm:py-32 lg:px-8">
                        <div className="relative isolate overflow-hidden bg-slate-100 px-6 py-5 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                                <h2 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-4xl">Caro Cliente, <br /> Fale connosco aqui!
                                </h2>
                                <p className="my-4 text-sm leading-6 text-gray-700 sm:mt-6 sm:text-base sm:leading-8">Estimado Cliente, este é o seu espaço para compartilhar mensagens e informações. Envie-nos sua mensagem e estamos prontos para ajudar. Aguardamos o seu Contacto!</p>
                            </div>
                            <div className="mx-auto  lg:mx-0 lg:flex-auto lg:mt-0 md:pt-24">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-900">Assunto</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                                        <div className="mt-1">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-900">Mensagem</label>
                                        <div className="mt-1">
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <FaSpinner className="animate-spin h-5 w-5" />
                                                <span className="ml-2">Enviando...</span>
                                            </div>
                                        ) : (
                                            'Enviar'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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

export default Contact;
