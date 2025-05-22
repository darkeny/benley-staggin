import axios from 'axios';
import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Alert } from '../Modal/alert';
import { SuccessAlert } from '../Modal/successAlert';

const Posts: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [pdfUploaded, setPdfUploaded] = useState(false);
    const [photoUploaded, setPhotoUploaded] = useState(false);

    const fileInputRefPDF = React.useRef<HTMLInputElement>(null);
    const fileInputRefPhoto = React.useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!subject || !message) {
            setAlertText('Todos os campos são obrigatórios.');
            setIsModalOpen(true);
            return;
        }

        setLoading(true); // Set loading to true when form submission starts
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('message', message);

        if (pdfFile) {
            formData.append('pdf', pdfFile);
        }

        if (photoFile) {
            formData.append('photo', photoFile);
        }

        try {
            const response = await axios.post(`${apiUrl}/sendNews`, formData);
            if (response.status === 200) {
                setAlertText('Mensagem enviada com sucesso!');
                setIsModalSuccessOpen(true);
                setSubject('');
                setMessage('');
                setPdfUploaded(false);
                setPhotoUploaded(false);
                setPdfFile(null);
                setPhotoFile(null);
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
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    const handlePDFUpload = () => {
        fileInputRefPDF.current?.click();
    };

    const handlePhotoUpload = () => {
        fileInputRefPhoto.current?.click();
    };

    const onPDFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPdfFile(event.target.files[0]);
            setPdfUploaded(true);
        }
    };

    const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPhotoFile(event.target.files[0]);
            setPhotoUploaded(true);
        }
    };

    return (
        <>
            <div className="">
                <div className="mx-auto max-w-7xl py-14 sm:px-10 sm:py-16 lg:px-8">
                    <div className="relative isolate overflow-hidden bg-slate-100 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Comunique-se com os Clientes</h2>
                            <p className="mt-6 text-lg leading-8 text-gray-700">Este é o espaço ideal para compartilhar mensagens e informações com os Clientes. Estamos prontos para ajudar a transmitir sua mensagem. Aguardamos o seu contato!</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                                <button onClick={handlePDFUpload} className="rounded-md bg-gray-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">
                                    Anexar um pdf
                                    {pdfUploaded && <IoCheckmarkDoneOutline className="inline-block w-5 h-5 ml-2 text-green-500" />}
                                </button>
                                <input ref={fileInputRefPDF} type="file" accept=".pdf" className="hidden" onChange={onPDFChange} />
                                <button onClick={handlePhotoUpload} className="text-sm font-semibold leading-6 text-gray-900">
                                    Anexar uma foto <span aria-hidden="true">→</span>
                                    {photoUploaded && <IoCheckmarkDoneOutline className="inline-block w-5 h-5 ml-2 text-green-500" />}
                                </button>
                                <input ref={fileInputRefPhoto} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
                            </div>
                        </div>
                        <div className="mx-auto mt-10 max-w-md lg:mx-0 lg:flex-auto lg:py-32 lg:mt-0 lg:ml-10">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-900">Assunto</label>
                                    <div className="mt-1">
                                        <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" name="subject" id="subject" className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-900">Mensagem</label>
                                    <div className="mt-1">
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} id="message" name="message" rows={4} className="peer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
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
                                </div>
                            </form>
                        </div>
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

export { Posts };
