import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { PiPiggyBankFill } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { PieChart } from '../Chart/PieGraph';
import { calculateDaysLeft, CalculationOfFines, useFetchUserData } from '../../utils';

const ClientFinance: React.FC = () => {
    const { user, loan, loading, error } = useFetchUserData();
    const navigate = useNavigate();

    // Verificar se o usuário tem permissão para acessar a página
    useEffect(() => {
        if (user.role && user.role !== 'USER') {
            navigate('/signin'); // Redirecionar para a página de login (ou qualquer outra) se o papel não for 'USER'
        }
    }, [user.role, navigate]);

    const today = new Date();
    const loanCreatedAt = new Date(loan.createdAt);
    const endDate = new Date(loanCreatedAt.setDate(loanCreatedAt.getDate() + 31));
    const multas = CalculationOfFines(endDate, today);
    const daysLeft = calculateDaysLeft(loan.createdAt, loan.totalDays);
    const TotalMultas = (multas / 100) * loan.balanceDue;

    const savings = {
        amount: 50000,
        status: 'PENDING'
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col px-4 md:p-10 md:bg-gray-100 rounded-lg shadow-lg">
            {/* Seção do Perfil do Usuário e Informações Financeiras */}
            <div className="lg:flex md:pt-0 lg:space-x-6">
                {/* Seção do Perfil do Usuário */}
                <div className="lg:w-1/3 mb-4 md:my-0 w-full flex flex-col justify-center items-center bg-white md:p-4 p-1 rounded-lg shadow-md">
                    {user.photo ? (
                        <img src={user.photo} alt="User Profile" className="w-32 h-32 rounded-full mb-4" />
                    ) : (
                        <FaUserAlt className="w-28 h-28 text-gray-400" />
                    )}
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500">{user.profession}</p>
                </div>

                {/* Seção de Informações Financeiras */}
                <div className="lg:w-2/3 pt-3 pb-5 w-full bg-white px-3 md:p-6 rounded-lg shadow-md">
                    <h3 className="md:text-xl text-lg font-semibold mb-4 text-gray-700">Status Financeiro</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Cartão Solicitação */}
                        <div className="p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-blue-50 border-blue-800 text-blue-700">
                            <div className="flex items-center">
                                <GiReceiveMoney className="text-blue-600 mb-4" size={40} />
                                <div className="ml-4">
                                    <h4 className="md:text-lg font-bold text-gray-700">Saldo Solicitado</h4>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                {loan.amountDue <= 0 ? "Sem saldo" : `${loan.amountDue} MT`}
                            </h2>
                        </div>

                        {/* Cartão Empréstimo */}
                        <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${loan.status === "ACTIVE"
                            ? 'bg-green-50 border-green-300 text-green-700':loan.status === "REFUSED"? 'bg-red-50 border-red-400 text-red-700': 'bg-gray-50 border-gray-300 text-gray-700'} border`}>
                            <div className="flex items-center mb-4">
                                <GiTakeMyMoney className={`${loan.status === "ACTIVE" ? 'text-green-600':loan.status === "REFUSED" ? 'text-red-600' : 'text-gray-500'}`} size={40} />
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-700">Empréstimo</h4>
                                    <p className="text-sm font-semibold">
                                        {loan.status}
                                    </p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold">
                                {loan.status === "ACTIVE" && loan.balanceDue > 0 ? `${loan.balanceDue} MT` : 'Sem saldo'}
                            </h2>
                        </div>

                        {/* Cartão Poupança */}
                        <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${savings.status === "ACTIVE" ? 'bg-orange-50 border-yellow-700 text-yellow-700' : 'bg-gray-50 border-gray-300 text-gray-700'} border`}>
                            <div className="flex items-center mb-4">
                                <PiPiggyBankFill className={`${savings.status === "ACTIVE" ? 'text-yellow-600' : 'text-gray-500'}`} size={40} />
                                <div className="ml-4">
                                    <h4 className="text-lg font-bold text-gray-700">Poupança</h4>
                                    <p className="text-sm font-semibold">
                                        {savings.status}
                                    </p>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold">
                                {savings.status === "ACTIVE" && savings.amount > 0 ? `${savings.amount} MT` : 'Sem saldo'}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:flex pb-6 lg:space-x-6">
                {/* Nova Seção para o Gráfico de Pizza */}
                <div className="lg:w-1/3 w-full flex flex-col items-center bg-white p-5 mt-5 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Tempo Restante</h3>
                    <PieChart daysLeft={daysLeft} totalDays={loan.totalDays} />
                </div>

                <div className="lg:w-2/3 w-full bg-white md:p-6 p-3 mt-5 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Datas Financeiras</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h4 className="text-lg font-bold text-gray-700">Data de Início</h4>
                            <p className="text-gray-500">
                                {loan.createdAt && !isNaN(new Date(loan.createdAt).getTime())
                                    ? new Date(loan.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                    })
                                    : "Sem datas ainda"}
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h4 className="text-lg font-bold text-gray-700">Fim</h4>
                            <p className="text-gray-500">
                                {endDate && !isNaN(new Date(endDate).getTime())
                                    ? new Date(endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                    : "Sem datas ainda"}
                            </p>
                        </div>
                        <div className={`p-6 ${multas && !isNaN(multas) && multas >= 0 ? 'bg-red-50 border-red-700 text-red-700' : 'bg-white border border-gray-200'} rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}>
                            <h4 className="text-lg font-bold text-gray-700">Total de Multas</h4>
                            <p className="text-gray-500">
                                {multas && !isNaN(multas) && multas >= 0
                                    ? `${multas} dia/s / ${TotalMultas.toFixed(2)}MT`
                                    : "Sem multas"}
                            </p>
                        </div>
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <h4 className="text-lg font-bold text-gray-700">Taxa de Juros</h4>
                            <p className="text-gray-500">30% do Valor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ClientFinance };
