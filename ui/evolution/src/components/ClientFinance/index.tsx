import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { PiPiggyBankFill } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { PieChart } from '../Chart/PieGraph';
import { calculateDaysLeft, useFetchUserData } from '../../utils';
import { fetchUserLoans } from '../../utils/loans/fetchUserLoans';
import { Installment, Loan } from '../../@types/customer';
import { calculateTotalFines } from '../../utils/loans/installmentsFines';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const ClientFinance: React.FC = () => {
    const { user, loading, error } = useFetchUserData();
    const [loans, setLoans] = useState<Loan[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role && user.role !== 'USER') {
            navigate('/signin');
        }
    }, [user.role, navigate]);

    useEffect(() => {
        if (user?.userId) {
            fetchUserLoans(apiUrl, user).then(setLoans);
        }
    }, [user]);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    // 🔹 Pega empréstimo ativo ou o primeiro da lista
    const relevantLoan: Loan | undefined = loans.find(l => l.status === "ACTIVE") || loans[0];

    // 🔹 Se não existir empréstimo, variáveis ficam seguras
    const loanActivatedAt = relevantLoan?.activatedAt ? new Date(relevantLoan.activatedAt) : null;
    const loanDuration = relevantLoan?.paymentTerm || 1;
    const balanceDue = relevantLoan?.balanceDue || 0;

    // --- MULTAS E PARCELAS ---
    const installments: Installment[] = (relevantLoan?.installmentsList || []).map((inst: Installment) => ({
        ...inst,
        dueDate: new Date(inst.dueDate),
        paid: inst.paid ?? false,
    }));

    const { totalFine, totalDaysDelayed } = calculateTotalFines(installments);

    // Total a pagar = saldo + multas
    const totalToPay = balanceDue + totalFine;

    // --- TEMPO RESTANTE ---
    const daysLeft = loanActivatedAt
        ? calculateDaysLeft(loanActivatedAt, loanDuration)
        : 0;

    // Exemplo de poupança
    const savings = {
        amount: 50000,
        status: 'PENDING'
    };

    return (
        <div className="flex flex-col px-4 md:p-10 md:bg-gray-100 rounded-lg shadow-lg">
            {/* Perfil e Financeiro */}
            <div className="lg:flex md:pt-0 lg:space-x-6">
                {/* Perfil */}
                <div className="lg:w-1/3 mb-4 md:my-0 w-full flex flex-col justify-center items-center bg-white md:p-4 p-1 rounded-lg shadow-md">
                    {user.photo ? (
                        <img src={user.photo} alt="User Profile" className="w-32 h-32 rounded-full mb-4" />
                    ) : (
                        <FaUserAlt className="w-28 h-28 text-gray-400" />
                    )}
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500">{user.profession}</p>
                </div>

                {/* Informações Financeiras */}
                <div className="lg:w-2/3 pt-3 pb-5 w-full bg-white px-3 md:p-6 rounded-lg shadow-md">
                    <h3 className="md:text-xl text-lg font-semibold mb-4 text-gray-700">Status Financeiro</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Saldo Solicitado */}
                        <div className="p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-blue-50 border-blue-800 text-blue-700">
                            <div className="flex items-center">
                                <GiReceiveMoney className="text-blue-600 mb-4" size={40} />
                                <div className="ml-4">
                                    <h4 className="md:text-lg font-bold text-gray-700">Saldo Solicitado</h4>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                {relevantLoan?.loanAmount ? `${relevantLoan.loanAmount} MT` : "Sem saldo"}
                            </h2>
                        </div>

                        {/* Empréstimo */}
                        <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${relevantLoan?.status === "ACTIVE"
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : relevantLoan?.status === "REFUSED"
                                ? 'bg-red-50 border-red-400 text-red-700'
                                : 'bg-gray-50 border-gray-300 text-gray-700'
                            } border`}>
                            <div className="flex items-center mb-4">
                                <GiTakeMyMoney className={`${relevantLoan?.status === "ACTIVE"
                                    ? 'text-green-600'
                                    : relevantLoan?.status === "REFUSED"
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                                    }`} size={40} />
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-700">Empréstimo</h4>
                                    <p className="text-sm font-semibold">
                                        {relevantLoan?.status || 'Sem status'}
                                    </p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold">
                                {relevantLoan?.status === "ACTIVE" && balanceDue > 0
                                    ? `${balanceDue} MT`
                                    : 'Sem saldo'}
                            </h2>
                        </div>

                        {/* Poupança */}
                        <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${savings.status === "ACTIVE"
                            ? 'bg-orange-50 border-yellow-700 text-yellow-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700'
                            } border`}>
                            <div className="flex items-center mb-4">
                                <PiPiggyBankFill className={`${savings.status === "ACTIVE" ? 'text-yellow-600' : 'text-gray-500'
                                    }`} size={40} />
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-700">Poupança</h4>
                                    <p className="text-sm font-semibold">{savings.status}</p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold">
                                {savings.status === "ACTIVE" && savings.amount > 0
                                    ? `${savings.amount} MT`
                                    : 'Sem saldo'}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos e Datas */}
            <div className="lg:flex pb-6 lg:space-x-6">
                <div className="lg:w-1/3 w-full flex flex-col items-center bg-white p-5 mt-5 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Tempo Restante</h3>
                    <PieChart daysLeft={daysLeft} totalDays={loanDuration} />
                </div>

                <div className="lg:w-2/3 w-full bg-white md:p-6 p-3 mt-5 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Datas Financeiras</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Data Início */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h4 className="text-lg font-bold text-gray-700">Data de Início</h4>
                            <p className="text-gray-500">
                                {loanActivatedAt
                                    ? loanActivatedAt.toLocaleDateString('pt-BR')
                                    : "Sem datas ainda"}
                            </p>
                        </div>

                        {/* Data Fim */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h4 className="text-lg font-bold text-gray-700">Fim</h4>
                            <p className="text-gray-500">
                                {loanActivatedAt
                                    ? new Date(loanActivatedAt.getTime() + (loanDuration + 1) * 86400000).toLocaleDateString('pt-BR')
                                    : "Sem datas ainda"}
                            </p>
                        </div>

                        {/* Multas */}
                        <div className={`p-6 ${totalDaysDelayed > 0 ? 'bg-red-50 border-red-700 text-red-700' : 'bg-white border border-gray-200'} rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}>
                            <h4 className="text-lg font-bold text-gray-700">Total de Multas</h4>
                            <p className="text-gray-500">
                                {totalDaysDelayed > 0
                                    ? `${totalDaysDelayed} dia(s) - ${totalFine.toFixed(2)} MT`
                                    : "Sem multas"}
                            </p>
                        </div>

                        {/* Juros */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h4 className="text-lg font-bold text-gray-700">Taxa de Juros</h4>
                            <p className="text-gray-500">
                                {!relevantLoan?.loanAmount ? 'Sem valor' :
                                    relevantLoan.loanAmount < 1000 ? '0% do valor' :
                                        relevantLoan.loanAmount < 5000 ? '50% do valor' : '30% do valor'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ClientFinance };
