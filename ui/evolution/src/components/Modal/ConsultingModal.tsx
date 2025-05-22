import React, { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaChalkboardUser } from "react-icons/fa6";
import { Alert } from './alert';
import { SuccessAlert } from './successAlert';

interface ModalProps {
    text: string;
    subtitles: string;
}

const ConsultingModal: React.FC<ModalProps> = ({
    text,
    subtitles,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
    });


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission (e.g., send data to backend or API)
        handleCloseModal();
    };

    return (
        <>
            {isOpen && (
                <div
                    id="consulting-modal"
                    aria-hidden="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <div className="sm:flex sm:items-center">
                            <div className="mx-auto flex flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                <FaChalkboardUser className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="p-3 text-center sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Informe aqui os seus dados</h3>
                            </div>
                        </div>
                        <div className="my-2">
                            <p className="text-sm text-gray-500">{subtitles}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Nome Completo"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Telefone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <div className="relative">
                                <AiOutlineCalendar className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={handleCloseModal}
                                    type="button"
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Marcar Consulta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

export { ConsultingModal };
