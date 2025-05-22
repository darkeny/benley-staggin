import React, { useRef, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { Alert } from "../../components/Modal/alert";
import axios from "axios";
import { SuccessAlert } from "../../components/Modal/successAlert";
import { FaSpinner } from "react-icons/fa6";
import { handleError } from "../../handleError";
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkDoneOutline } from "react-icons/io5";
const apiUrl = import.meta.env.VITE_APP_API_URL;

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        profession: "",
        email: "",
        contact: "",
        gender: "",
        marital_status: "",
        address: "",
        incomeSource: "",
        monthlyIncome: "",
        identityNumber: "",
        grantorName: "",
        grantorID: "",
        grantorContact: "",
        imageFiles: [] as File[], // Adicionando imagens ao formData
        pdfFiles: [] as File[], // Adicionando PDFs ao formData
    });

    const [showGrantorFields, setShowGrantorFields] = useState(false);
    const [selectedBank, setSelectedBank] = useState("");
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState("");
    const imageInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFormData((prev) => ({ ...prev, imageFiles: filesArray }));
            console.log("Imagens carregadas:", filesArray);
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFormData((prev) => ({ ...prev, pdfFiles: filesArray }));
            console.log("PDFs carregados:", filesArray);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "marital_status") {
            setShowGrantorFields(value === "Casado/a");

        }
    };

    const handleIncomeSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setIsFreelancer(value === "Freelancer");
        setFormData({
            ...formData,
            incomeSource: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validação dos campos obrigatórios
        const requiredFields = [
            { field: "fullName", message: "Nome completo é um campo  obrigatório." },
            { field: "identityNumber", message: "Bilhete de identidade é um campo  obrigatório." },
            { field: "birthDate", message: "Data de Nascimento é um campo  obrigatório." },
            { field: "email", message: "Email é um campo  obrigatório." },
            { field: "contact", message: "Contacto é um campo  obrigatório." },
            { field: "gender", message: "Sexo é um campo  obrigatório." },
            { field: "marital_status", message: "Estado civil é um campo  obrigatório." },
            { field: "address", message: "Endereço é um campo  obrigatório." },
            { field: "incomeSource", message: "Fonte de Renda é um campo  obrigatório." },
            { field: "profession", message: "Profissão é um campo obrigatório." },
            { field: "monthlyIncome", message: "Renda Mensal é um campo  obrigatório." },
        ];

        for (const { field, message } of requiredFields) {
            // @ts-ignore
            if (!formData[field]) {
                setAlertText(message);
                setIsModalOpen(true);
                setLoading(false);
                return;
            }
        }


        // Validação da renda mensal para funcionários
        if (formData.incomeSource === "Funcionário" && !formData.monthlyIncome) {
            setAlertText("Renda mensal é obrigatória para funcionários.");
            setIsModalOpen(true);
            setLoading(false);
            return;
        }

        // Validação dos campos do outorgante se for mostrado
        if (showGrantorFields) {
            const grantorFields = [
                { field: "grantorName", message: "Nome do outorgante é obrigatório." },
                { field: "grantorID", message: "Bilhete de identidade do outorgante é obrigatório." },
                { field: "grantorContact", message: "Contacto do outorgante é obrigatório." },
            ];

            for (const { field, message } of grantorFields) {
                // @ts-ignore
                if (!formData[field]) {
                    setAlertText(message);
                    setIsModalOpen(true);
                    setLoading(false);
                    return;
                }
            }
        }

        try {
            // Lógica de submissão do formulário
            const response = await axios.post(`${apiUrl}/ibuildCustomer`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Sucesso: exibe a mensagem de sucesso e abre o modal de sucesso
                setAlertText('Cliente cadastrado com sucesso!');
                setIsModalSuccessOpen(true);

                setTimeout(() => {
                    navigate('/signin');
                }, 3000);

                // Limpar o formulário após sucesso
                setFormData({
                    fullName: "",
                    birthDate: "",
                    profession: "",
                    email: "",
                    contact: "",
                    gender: "",
                    marital_status: "",
                    address: "",
                    incomeSource: "",
                    monthlyIncome: "",
                    identityNumber: "",
                    grantorName: "",
                    grantorID: "",
                    grantorContact: "",
                    imageFiles: [],
                    pdfFiles: [],
                });
                setSelectedBank("");
                setShowGrantorFields(false);
            } else {
                // Sucesso: exibe a mensagem de sucesso e abre o modal de sucesso
                setAlertText('Cliente cadastrado com sucesso!');
                setIsModalSuccessOpen(true);

                setTimeout(() => {
                    navigate('/signin');
                }, 3000);

                // Limpar o formulário após sucesso
                setFormData({
                    fullName: "",
                    birthDate: "",
                    profession: "",
                    email: "",
                    contact: "",
                    gender: "",
                    marital_status: "",
                    address: "",
                    incomeSource: "",
                    monthlyIncome: "",
                    identityNumber: "",
                    grantorName: "",
                    grantorID: "",
                    grantorContact: "",
                    imageFiles: [],
                    pdfFiles: [],
                });
                setSelectedBank("");
                setShowGrantorFields(false);
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            const errorMessage = handleError(error); // Tratamento de erro centralizado
            setAlertText(errorMessage)
            setIsModalOpen(true); // Abre o modal de erro   
        } finally {
            setLoading(false); // Finalize a ação de loading após sucesso ou erro
        }

    };


    const toggleGrantorFields = () => {
        setShowGrantorFields(!showGrantorFields);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    return (
        <>
            <div className="p-3">
                <Navbar />
            </div>
            <div className="hidden md:block absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
            <div className="hidden md:block absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>

            <div data-aos="zoom-in" className="flex justify-center items-center min-h-screen">
                <div className="bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-lg shadow-xl w-full max-w-screen-2xl p-8 mx-4 relative overflow-hidden before:content-[''] before:absolute before:w-48 before:h-48 before:bg-gradient-to-r before:from-gray-400 before:to-blue-500 before:opacity-20 before:rounded-full before:top-0 before:left-0 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-64 after:h-64 after:bg-gradient-to-r after:from-yellow-400 after:to-red-500 after:opacity-20 after:rounded-full after:bottom-0 after:right-0 after:translate-x-1/2 after:translate-y-1/2">
                    <h2 className="lg:text-3xl text-xl font-extrabold text-center text-gray-800 mb-6">Formulário de Inscrição do Cliente</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informação do Cliente */}
                        <div>
                            <h3 className="lg:text-xl text-md font-bold text-gray-700 mb-4">Informação do Cliente</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Nome Completo</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Insira o seu nome completo"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Bilhete de Identidade</label>
                                    <input
                                        type="text"
                                        name="identityNumber"
                                        value={formData.identityNumber}
                                        onChange={handleInputChange}
                                        placeholder="Insira o número do seu BI"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Insira o seu email"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Contacto</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        placeholder="Insira o seu contacto"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex-1 relative">
                                    <label className="block text-sm font-normal text-gray-950">Sexo</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecione o seu sexo</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Feminino</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Estado Civíl</label>
                                    <select
                                        name="marital_status"
                                        value={formData.marital_status}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full p-3 rounded-lg border bg-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecione o seu estado</option>
                                        <option value="Casado/a">Casado/a</option>
                                        <option value="Solteiro/a">Solteiro/a</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Endereço</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Insira o seu endereço"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                    <div className="flex-1 relative">
                                        <label className="block text-sm font-normal text-gray-950">Fonte de Renda</label>
                                        <select
                                            name="incomeSource"
                                            value={formData.incomeSource}
                                            onChange={handleIncomeSourceChange}
                                            className="mt-2 block w-full p-3 rounded-lg border bg-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Funcionário">Funcionário</option>
                                            <option value="Freelancer">Freelancer</option>
                                        </select>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-normal text-gray-950">Renda Mensal</label>
                                        <input
                                            type="text"
                                            name="monthlyIncome"
                                            value={formData.monthlyIncome}
                                            onChange={handleInputChange}
                                            placeholder="Insira renda mensal"
                                            className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-normal text-gray-950">Profissão</label>
                                    <input
                                        type="text"
                                        name="profession"
                                        value={formData.profession}
                                        onChange={handleInputChange}
                                        placeholder="Qual a sua profissão?"
                                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>


                                {/* Upload de Imagem */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Foto do Bilhete de Identidade
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        className="mt-2 block w-full p-3 rounded-lg border border-slate-400 text-slate-600 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {formData.imageFiles.length > 0 ? "Imagem Carregada" : "Carregar Imagem"}
                                        {formData.imageFiles.length > 0 && (
                                            <IoCheckmarkDoneOutline className="h-6 w-6 inline ml-2 text-green-500" />
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Upload de PDF */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Comprovativo de rendimentos ou Extrato Bancário (PDF)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => pdfInputRef.current?.click()}
                                        className="mt-2 block w-full p-3 rounded-lg border border-slate-400 text-slate-600 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        {formData.pdfFiles.length > 0 ? "PDF Carregado" : "Carregar PDF"}
                                        {formData.pdfFiles.length > 0 && (
                                            <IoCheckmarkDoneOutline className="h-6 w-6 inline ml-2 text-green-500" />
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={pdfInputRef}
                                        accept="application/pdf"
                                        multiple
                                        onChange={handlePdfChange}
                                        className="hidden"
                                    />
                                </div>

                            </div>
                        </div>
                        <div>
                            <label className="inline-flex items-center mt-3">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={showGrantorFields}
                                    onChange={toggleGrantorFields}
                                    disabled={formData.marital_status === "Casado/a"} // Desabilitar o checkbox se o estado civil for "Casado/a"
                                />
                                <span className="ml-2 text-gray-700">Incluir informações do outorgante</span>
                            </label>
                        </div>
                        {showGrantorFields && (
                            <div>
                                <h3 className="lg:text-xl text-md font-bold text-gray-700 mb-4">Informação do Outorgante</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-normal text-gray-950">Nome do Outorgante</label>
                                        <input
                                            type="text"
                                            name="grantorName"
                                            value={formData.grantorName}
                                            onChange={handleInputChange}
                                            placeholder="Nome completo do outorgante"
                                            className="mt-2 block w-full p-3 rounded-lg border bg-white border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-normal text-gray-950">Bilhete de Identidade do Outorgante</label>
                                        <input
                                            type="text"
                                            name="grantorID"
                                            value={formData.grantorID}
                                            onChange={handleInputChange}
                                            placeholder="Número do bilhete de identidade"
                                            className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-normal text-gray-950">Contacto do Outorgante</label>
                                        <input
                                            type="text"
                                            name="grantorContact"
                                            value={formData.grantorContact}
                                            onChange={handleInputChange}
                                            placeholder="Contacto do outorgante"
                                            className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                className="rounded-md bg-blue-500 px-10 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin h-5 w-5" />
                                        <span className="ml-2">Enviando...</span>
                                    </div>
                                ) : (
                                    'Submeter'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isModalOpen && (
                <Alert
                    isOpen={isModalOpen}
                    text={alertText}
                    onClose={handleCloseModal}
                />
            )}

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

export { SignUp };
