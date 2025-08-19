import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiDownload, FiLoader, FiXCircle } from "react-icons/fi";
import { TbPointFilled } from "react-icons/tb";
import { Alert } from '../Modal/alert';
import { DeleteModal } from '../Modal/deleteModal';
import { SuccessAlert } from '../Modal/successAlert';
import { calculateDaysLeft, CalculationOfFines, useFetchUserData } from '../../utils';
import {
    fetchLoans,
    deleteLoan,
    updateLoanStatus,
    updatePawnStatus,
    isPaymentTermExceeded,
    handleDownloadContract
} from '../../utils/loans';
import { Loan } from '../../@types/customer';

const Loans: React.FC = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const { user } = useFetchUserData();
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        if (user?.role && user?.userId) {
            fetchLoans(apiUrl, user, setLoans);
        }
    }, [user]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredLoans = loans.filter(loan =>
        loan.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    const handleNavigate = () => {
        navigate('/loan');
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="text-right">
                    {user.role === 'USER' && (
                        <button
                            onClick={handleNavigate}
                            className=" bg-blue-600 hover:bg-blue-800 text-white font-bold  mb-2 md:py-3 px-8 rounded-lg shadow-lg text-lg transition-all duration-300"
                        >
                            Novo
                        </button>
                    )}
                </div>

                <div className="relative text-gray-600 my-2">
                    <input
                        type="search"
                        name="search"
                        placeholder="Pesquisar por cliente..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border-2 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
                    />
                </div>

                <div className="overflow-x-auto md:overflow-visible  md:shadow-2xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {user.role === 'ADMIN' && (
                                    <>
                                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Restante</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Multa</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Cliente</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Solicitado</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">A pagar</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Pagamento</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Conta</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Garantia</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Parcelas</th>
                                {user.role === 'USER' && (
                                    <>
                                        <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Status</th>
                                    </>
                                )}
                                {user.role === 'ADMIN' && (
                                    <>
                                        <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Penhor</th>
                                        <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Status</th>
                                        <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Acções</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLoans.map((loan: Loan) => {
                                const loanCreatedAt = loan.activatedAt;
                                const loanDuration = 30;
                                const balanceDue = loan.balanceDue;
                                const { fineAmount } = CalculationOfFines(loanCreatedAt, loanDuration, balanceDue);

                                return (
                                    <tr key={loan.id}>
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <td className="px-6 py-4 text-xs leading-5 text-gray-500">
                                                    <span className={`inline-flex items-center rounded-md px-4 py-2 text-xs font-medium ring-1 ring-inset
                                                        ${calculateDaysLeft(String(loan.activatedAt), 30) > 22
                                                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                            : calculateDaysLeft(String(loan.activatedAt), 30) > 15
                                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                                : calculateDaysLeft(String(loan.activatedAt), 30) > 8
                                                                    ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                                    : calculateDaysLeft(String(loan.activatedAt), 30) > 0
                                                                        ? 'bg-orange-50 text-orange-700 ring-orange-600/20'
                                                                        : 'bg-red-50 text-red-700 ring-red-600/20'
                                                        }`}>
                                                        {calculateDaysLeft(String(loan.activatedAt), 30)} dias
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{fineAmount.toFixed(2)}MT</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.customer.fullName}</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.loanAmount.toFixed(2)}MT</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.balanceDue.toFixed(2)}MT</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.paymentMethod}</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.accountNumber}</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.collateral}</td>
                                        <td className="text-xs text-center leading-5 text-gray-500">{loan.installments}</td>
                                        {user.role === 'USER' && (
                                            <>

                                                <td className="px-6 py-3 text-xs leading-5 text-gray-500">
                                                    <span
                                                        className={`
                                                        inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border
                                                        w-[130px] h-[36px] gap-2
                                                        transition-colors duration-200
                                                        ${loan.status === "PAID" ? "bg-green-100/50 text-green-700 border-green-200" : ""}
                                                        ${loan.status === "PENDING" ? "bg-yellow-100/50 text-yellow-700 border-yellow-200" : ""}
                                                        ${loan.status === "ACTIVE" ? "bg-emerald-100/50 text-emerald-700 border-emerald-200" : ""}
                                                        ${loan.status === "REFUSED" ? "bg-red-100/50 text-red-700 border-red-200" : ""}
                                                    `}
                                                    >
                                                        {{
                                                            PAID: <><FiCheckCircle className="w-4 h-4" /> PAGO</>,
                                                            PENDING: <><FiClock className="w-4 h-4 flex-shrink-0" /> PENDENTE</>,
                                                            ACTIVE: <><TbPointFilled className="w-4 h-4" /> ACTIVO</>,
                                                            REFUSED: <><FiXCircle className="w-4 h-4" /> RECUSADO</>,
                                                        }[loan.status] || 'Desconhecido'}
                                                    </span>
                                                </td>


                                            </>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <td className="px-6 py-4 text-center text-xs leading-5 text-gray-500">
                                                    <input
                                                        type="checkbox"
                                                        checked={loan.pawn === 'YES'}
                                                        onChange={(e) =>
                                                            updatePawnStatus(
                                                                loan.id,
                                                                e.target.checked ? 'YES' : 'NO',
                                                                apiUrl,
                                                                () => fetchLoans(apiUrl, user, setLoans),
                                                                setAlertText,
                                                                setIsModalSuccessOpen,
                                                                setIsModalOpen
                                                            )
                                                        }
                                                        disabled={isPaymentTermExceeded(loan.activatedAt)}
                                                        title={isPaymentTermExceeded(loan.activatedAt)
                                                            ? "Você não pode penhorar o usuário antes de 30 dias do empréstimo."
                                                            : ""}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-xs leading-5 text-gray-500">
                                                    <div className={`
                                                        relative inline-flex items-center justify-start rounded-lg px-2 py-2 text-sm font-medium border
                                                        w-[145px] h-[36px] gap-2 transition-colors duration-200
                                                        ${loan.status === "PAID" ? "bg-green-100/50 text-green-700 border-green-200" : ""}
                                                        ${loan.status === "PENDING" ? "bg-yellow-100/50 text-yellow-700 border-yellow-200" : ""}
                                                        ${loan.status === "ACTIVE" ? "bg-emerald-100/50 text-emerald-700 border-emerald-200" : ""}
                                                        ${loan.status === "REFUSED" ? "bg-red-100/50 text-red-700 border-red-200" : ""}
                                                    `}>

                                                        {/* Ícone fixo no lado esquerdo */}
                                                        {{
                                                            PAID: <FiCheckCircle className="w-5 h-5 flex-shrink-0" />,
                                                            PENDING: <FiClock className="w-5 h-5 flex-shrink-0" />,
                                                            ACTIVE: <TbPointFilled className="w-5 h-5 flex-shrink-0" />,
                                                            REFUSED: <FiXCircle className="w-5 h-5 flex-shrink-0" />,
                                                        }[loan.status]}

                                                        {/* Select transparente por cima */}
                                                        <select
                                                            //@ts-ignore
                                                            value={loan.status}
                                                            onChange={(e) =>
                                                                updateLoanStatus(
                                                                    loan.id,
                                                                    e.target.value,
                                                                    {
                                                                        email: loan.customer.email,
                                                                        fullName: loan.customer.fullName,
                                                                    },
                                                                    apiUrl,
                                                                    () => fetchLoans(apiUrl, user, setLoans),
                                                                    setAlertText,
                                                                    setIsModalSuccessOpen,
                                                                    setIsModalOpen
                                                                )
                                                            }
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        >
                                                            <option value="PAID">PAGO</option>
                                                            <option value="PENDING">PENDENTE</option>
                                                            <option value="ACTIVE">ACTIVO</option>
                                                            <option value="REFUSED">RECUSADO</option>
                                                        </select>

                                                        {/* Texto exibido ao lado do ícone */}
                                                        <span className="ml-2">
                                                            {{
                                                                PAID: "PAGO",
                                                                PENDING: "PENDENTE",
                                                                ACTIVE: "ACTIVO",
                                                                REFUSED: "RECUSADO",
                                                            }[loan.status]}
                                                        </span>
                                                    </div>
                                                </td>


                                                <td className="px-6 py-4 text-lg leading-5 text-gray-500 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <DeleteModal
                                                            text="Excluir"
                                                            subtitles="Tem certeza de que deseja excluir?"
                                                            onSubmit={() =>
                                                                deleteLoan(
                                                                    loan.id,
                                                                    String(loan.status),
                                                                    apiUrl,
                                                                    loans,
                                                                    setLoans,
                                                                    setAlertText,
                                                                    setIsModalOpen
                                                                )
                                                            }
                                                            id={loan.id}
                                                        />
                                                        |
                                                        <button
                                                            onClick={() =>
                                                                handleDownloadContract(
                                                                    loan.id,
                                                                    loan.customer.fullName,
                                                                    apiUrl,
                                                                    setLoadingId
                                                                )
                                                            }
                                                            className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                                                            disabled={loadingId === loan.id}
                                                        >
                                                            {loadingId === loan.id ? (
                                                                <FiLoader className="w-5 h-5 animate-spin" />
                                                            ) : (
                                                                <FiDownload className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Alert text={alertText} isOpen={isModalOpen} onClose={handleCloseModal} />

            {isModalSuccessOpen && (
                <SuccessAlert
                    isOpen={isModalSuccessOpen}
                    onClose={handleCloseModal}
                    text={alertText}
                />
            )}
        </>
    );
};

export default Loans;
