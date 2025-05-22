import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteModal } from '../Modal/deleteModal';
import { SuccessAlert } from '../Modal/successAlert';
import { calculateDaysLeft, CalculationOfFines, useFetchUserData } from '../../utils';
import { useNavigate } from "react-router-dom";
import { Alert } from '../Modal/alert';
import { FiDownload, FiLoader } from "react-icons/fi";

const Loans: React.FC = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const { user, loan } = useFetchUserData();
    const apiUrl = import.meta.env.VITE_APP_API_URL;


    useEffect(() => {
        if (user && user.role && user.userId) {
            fetchLoans();
        }
    }, [user]);

    const fetchLoans = async () => {
        if (!user || !user.role || !user.userId) {
            console.warn('Usuário não definido. Abortando fetch.');
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/ibuildLoan`);
            const allLoans: Loan[] = response.data;

            const filteredLoans = user.role === 'USER'
                ? allLoans.filter((loan: Loan) => loan.customerId === user.userId)
                : allLoans;

            const sortedLoans = filteredLoans.sort(
                (a: Loan, b: Loan) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setLoans(sortedLoans);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };




    const deleteLoan = async (id: string, loanStatus: string) => {
        if (loanStatus === 'ACTIVE') {
            setAlertText('Empréstimo ativo não pode ser excluído.');
            setIsModalOpen(true);
            return; // Impede a execução do código de exclusão se o empréstimo estiver ativo
        }

        try {
            await axios.delete(`${apiUrl}/ibuildLoan/${id}`);
            setLoans(loans.filter(loan => loan.id !== id));
        } catch (error) {
            console.error('Error deleting loan:', error);
        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };




    const updateLoanStatus = async (
        loanId: string,
        newStatus: string,
        customer: { email: string; fullName: string }

    ) => {
        try {
            if (!customer || !customer.email || !customer.fullName) {
                console.error('Dados do cliente estão incompletos:', customer);
                setAlertText('Dados do cliente estão incompletos. Não foi possível atualizar o status.');
                setIsModalOpen(true);
                return;
            }

            // Atualizar o status do empréstimo
            const response = await axios.put(`${apiUrl}/ibuildLoan/${loanId}`, {
                isActive: newStatus,
            });

            if (response.status === 200) {
                setAlertText('Estado atualizado com sucesso!');
                setIsModalSuccessOpen(true);                

                // Verificar o novo estado e enviar e-mails, se necessário
                switch (newStatus) {
                    case 'REFUSED':
                        await axios.post(`${apiUrl}/sendLoansMailRefused`, {
                            email: customer.email,
                            fullName: customer.fullName,
                        });
                        break;
                    case 'PAID':
                        await axios.post(`${apiUrl}/sendLoansMailPayd`, {
                            email: customer.email,
                            fullName: customer.fullName,
                        });
                        break;
                    case 'ACTIVE':
                        await axios.post(`${apiUrl}/sendLoansMailAprove`, {
                            email: customer.email,
                            fullName: customer.fullName,
                        });
                        break;
                    default:
                        // Nenhum e-mail será enviado para PENDING ou outros estados
                        break;
                }

                // Recarregar a lista de empréstimos
                fetchLoans();
            }
        } catch (error) {
            console.error('Erro ao atualizar o status do empréstimo:', error);
            setAlertText('Erro ao atualizar o status do empréstimo.');
            setIsModalOpen(true);
        }
    };

    const updatePawnStatus = async (loanId: string, newStatus: string) => {
        try {
            const response = await axios.put(`${apiUrl}/ibuildLoan/pawn/${loanId}`, {
                pawn: newStatus, // Atualiza o estado do penhor para 'YES' ou 'NO'
            });

            if (response.status === 200) {
                setAlertText('Estado do penhor atualizado com sucesso!');
                setIsModalSuccessOpen(true);
            }
            fetchLoans(); // Atualiza a lista após a modificação
        } catch (error) {
            console.error("Erro ao atualizar o estado do penhor", error);
            setAlertText('Erro ao atualizar o estado do penhor.');
            setIsModalOpen(true);
        }
    };

    const isPaymentTermExceeded = (createdAt: string | Date): boolean => {
        const loanCreatedAt = new Date(createdAt); // Converte o createdAt para um objeto Date
        const currentDate = new Date(); // Data atual
        const diffInTime = currentDate.getTime() - loanCreatedAt.getTime(); // Diferença em milissegundos
        const diffInDays = diffInTime / (1000 * 3600 * 24); // Converte para dias

        return diffInDays < 30; // Retorna true se o prazo de 30 dias não foi atingido
    };




    const filteredLoans = loans.filter(loan =>
        loan.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    const handleDownloadContract = async (loanId: string, fullName: string) => {
        setLoadingId(loanId);
        try {
            const { data } = await axios.get(`${apiUrl}/pdfBuilder/${loanId}`, { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([data]));
            Object.assign(document.createElement('a'), { href: url, download: `Contrato de Financiamento ${fullName}.pdf` }).click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar contrato:", error);
        } finally {
            setLoadingId(null);
        }
    };

    const handleNavigate = () => {
        navigate('/loan');
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="text-right">
                    {user.role === 'USER' && (
                        <>
                            <button onClick={handleNavigate} className="mr-8 bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 mb-2 md:py-3 px-10 rounded-lg shadow-lg text-lg transition-all duration-300">
                                Novo
                            </button>
                        </>
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
                <table className="min-w-full divide-y divide-gray-200 shadow-2xl">
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
                            {/* <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Fim</th> */}
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
                            const today = new Date();
                            const loanCreatedAt = new Date(loan.createdAt);
                            const endDate = new Date(loanCreatedAt.setDate(loanCreatedAt.getDate() + 31));
                            const multas = CalculationOfFines(endDate, today);
                            const TotalMultas = (multas / 100) * loan.balanceDue;

                            return (
                                <tr key={loan.id}>
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <td className="px-6 py-4 text-xs leading-5 text-gray-500">
                                                <span
                                                    className={`inline-flex items-center rounded-md px-4 py-2 text-xs font-medium ring-1 ring-inset
                                                ${calculateDaysLeft(String(loan.createdAt), 30) > 22
                                                            ? 'bg-green-50 text-green-700 ring-green-600/20' // Verde
                                                            : calculateDaysLeft(String(loan.createdAt), 30) > 15
                                                                ? 'bg-green-50 text-green-700 ring-green-600/20' // Verde-limão
                                                                : calculateDaysLeft(String(loan.createdAt), 30) > 8
                                                                    ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' // Amarelo
                                                                    : calculateDaysLeft(String(loan.createdAt), 30) > 0
                                                                        ? 'bg-orange-50 text-orange-700 ring-orange-600/20' // Laranja
                                                                        : 'bg-red-50 text-red-700 ring-red-600/20' // Vermelho
                                                        }`}
                                                >
                                                    {calculateDaysLeft(String(loan.createdAt), 30)} dias
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs leading-5 text-gray-500">{TotalMultas.toFixed(2)}MT</td>
                                        </>
                                    )}
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.customer.fullName}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.loanAmount.toFixed(2)}MT</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.balanceDue.toFixed(2)}MT</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.paymentMethod}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.accountNumber}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{loan.collateral}</td>
                                    <td className="text-xs text-center leading-5 text-gray-500">{loan.installments}</td>
                                    {/* <td className="px-6 py-4 text-xs leading-5 text-gray-500">
                                    {new Date(new Date(loan.createdAt).setMonth(new Date(loan.createdAt).getMonth() + 1)).toLocaleDateString('pt-BR')}
                                </td> */}
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <td className="px-6 py-4 text-center text-xs leading-5 text-gray-500">
                                                <input
                                                    type="checkbox"
                                                    checked={loan.pawn === 'YES'}
                                                    onChange={(e) => updatePawnStatus(loan.id, e.target.checked ? 'YES' : 'NO')}
                                                    disabled={isPaymentTermExceeded(loan.createdAt)} // Passa o campo "createdAt"
                                                    title={
                                                        isPaymentTermExceeded(loan.createdAt)
                                                            ? "Você não pode penhorar o usuário antes de 30 dias do empréstimo."
                                                            : ""
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-xs leading-5 text-gray-500">
                                                <select
                                                    //@ts-ignore
                                                    value={loan.isActive}
                                                    onChange={(e) =>
                                                        updateLoanStatus(loan.id, e.target.value, {
                                                            email: loan.customer.email, // Certifique-se de que esses campos existem no objeto `loan`
                                                            fullName: loan.customer.fullName,
                                                        })
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
                                                        onSubmit={() => deleteLoan(loan.id, String(loan.isActive))}
                                                        id={loan.id}
                                                    />
                                                    |
                                                    <button
                                                        onClick={() => handleDownloadContract(loan.id, loan.customer.fullName)}
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
