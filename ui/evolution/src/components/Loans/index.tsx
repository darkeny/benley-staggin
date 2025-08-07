import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiDownload, FiLoader } from "react-icons/fi";
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
                                        <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Multa</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Cliente</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Solicitado</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">A pagar</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Pagamento</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Conta</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Garantia</th>
                                <th className="px-6 py-3 text-center font-medium text-xs leading-5 text-gray-500">Parcelas</th>
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
                                const loanCreatedAt = loan.createdAt;
                                const loanDuration = 30;
                                const balanceDue = loan.balanceDue;
                                const { fineAmount } = CalculationOfFines(loanCreatedAt, loanDuration, balanceDue);

                                return (
                                    <tr key={loan.id}>
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <td className="px-6 py-4 text-xs leading-5 text-gray-500">
                                                    <span className={`inline-flex items-center rounded-md px-4 py-2 text-xs font-medium ring-1 ring-inset
                                                        ${calculateDaysLeft(String(loan.createdAt), 30) > 22
                                                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                            : calculateDaysLeft(String(loan.createdAt), 30) > 15
                                                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                                : calculateDaysLeft(String(loan.createdAt), 30) > 8
                                                                    ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                                    : calculateDaysLeft(String(loan.createdAt), 30) > 0
                                                                        ? 'bg-orange-50 text-orange-700 ring-orange-600/20'
                                                                        : 'bg-red-50 text-red-700 ring-red-600/20'
                                                        }`}>
                                                        {calculateDaysLeft(String(loan.createdAt), 30)} dias
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs leading-5 text-gray-500">{fineAmount.toFixed(2)}MT</td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.customer.fullName}</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.loanAmount.toFixed(2)}MT</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.balanceDue.toFixed(2)}MT</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.paymentMethod}</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.accountNumber}</td>
                                        <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.collateral}</td>
                                        <td className="text-xs text-center leading-5 text-gray-500">{loan.installments}</td>
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
                                                        disabled={isPaymentTermExceeded(loan.createdAt)}
                                                        title={isPaymentTermExceeded(loan.createdAt)
                                                            ? "Você não pode penhorar o usuário antes de 30 dias do empréstimo."
                                                            : ""}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-xs leading-5 text-gray-500">
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
                                                        className="rounded p-1 bg-white outline-none"
                                                    >
                                                        <option value="PAID">PAGO</option>
                                                        <option value="PENDING">PENDENTE</option>
                                                        <option value="ACTIVE">ACTIVO</option>
                                                        <option value="REFUSED">RECUSADO</option>
                                                    </select>
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
