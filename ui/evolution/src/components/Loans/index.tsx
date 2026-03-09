import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiDownload, FiLoader, FiXCircle, FiEye, FiTrendingUp, FiDollarSign, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { TbPointFilled } from "react-icons/tb";
import { FcSurvey } from "react-icons/fc";
import { Alert } from '../Modal/alert';
import { DeleteModal } from '../Modal/deleteModal';
import { SuccessAlert } from '../Modal/successAlert';
import { calculateDaysLeft, useFetchUserData } from '../../utils';
import {
    fetchLoans,
    deleteLoan,
    updateLoanStatus,
    updatePawnStatus,
    isPaymentTermExceeded,
    handleDownloadContract
} from '../../utils/loans';
import { Installment, Loan } from '../../@types/customer';
import { calculateTotalFines, calculateInstallmentFine as calcInstallmentFineUtil } from '../../utils/loans/installmentsFines';
import { markInstallmentAsPaid } from '../../utils/installments/fetchInstallments';
import { handleDownloadPaymentNotice } from '../../utils/loans/paymentNotice';

interface ColumnConfig {
    id: keyof Loan | 'daysLeft' | 'customerName' | 'totalFine' | 'installmentCount';
    label: string;
    visible: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    wrap?: boolean;
}

interface InsightData {
    investedAmount: number;
    expectedAmount: number;
    expectedAmountWithFines: number;
    paidAmount: number;
    paidAmountWithFines: number;
    totalContractValue: number;
    totalFinesValue: number;
    monthYear: string;
}

type FilterType = 'ALL' | 'INVESTED' | 'EXPECTED' | 'PAID' | 'TOTAL' | 'FINES';

const Loans: React.FC = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
    const [installments, setInstallments] = useState<Installment[]>([]);
    const [showColumnConfig, setShowColumnConfig] = useState(false);
    const { user } = useFetchUserData();
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    // Estados para loading independente dos botões de download
    const [loadingStates, setLoadingStates] = useState<{
        contract: string | null;
        paymentNotice: string | null;
    }>({
        contract: null,
        paymentNotice: null
    });

    // Estados para o mini dashboard
    const [selectedPeriod, setSelectedPeriod] = useState<string>('current');
    const [customMonth, setCustomMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [insights, setInsights] = useState<InsightData>({
        investedAmount: 0,
        expectedAmount: 0,
        expectedAmountWithFines: 0,
        paidAmount: 0,
        paidAmountWithFines: 0,
        totalContractValue: 0,
        totalFinesValue: 0,
        monthYear: ''
    });

    // Configuração inicial das colunas
    const initialColumns: ColumnConfig[] = [
        {
            id: 'daysLeft',
            label: 'Dias Restantes',
            visible: true,
            width: '120px',
            align: 'center',
            wrap: false
        },
        {
            id: 'totalFine',
            label: 'Multa Total',
            visible: true,
            width: '120px',
            align: 'right',
            wrap: false
        },
        {
            id: 'customerName',
            label: 'Cliente',
            visible: true,
            width: '180px',
            align: 'left',
            wrap: false
        },
        {
            id: 'loanAmount',
            label: 'Solicitado',
            visible: true,
            width: '120px',
            align: 'right',
            wrap: false
        },
        {
            id: 'balanceDue',
            label: 'A Pagar',
            visible: true,
            width: '120px',
            align: 'right',
            wrap: false
        },
        {
            id: 'paymentMethod',
            label: 'Método Pag.',
            visible: true,
            width: '130px',
            align: 'center',
            wrap: false
        },
        {
            id: 'accountNumber',
            label: 'Conta',
            visible: true,
            width: '140px',
            align: 'center',
            wrap: false
        },
        {
            id: 'collateral',
            label: 'Garantia',
            visible: true,
            width: '150px',
            align: 'left',
            wrap: true
        },
        {
            id: 'installmentCount',
            label: 'Parcelas',
            visible: true,
            width: '100px',
            align: 'center',
            wrap: false
        },
        {
            id: 'status',
            label: 'Status',
            visible: true,
            width: '140px',
            align: 'center',
            wrap: false
        },
    ];

    const [columns, setColumns] = useState<ColumnConfig[]>(() => {
        const saved = localStorage.getItem('loanColumns');
        return saved ? JSON.parse(saved) : initialColumns;
    });

    // Função para obter o período alvo baseado na seleção
    const getTargetPeriod = (): { targetMonth: number; targetYear: number } => {
        const now = new Date();
        let targetMonth = now.getMonth();
        let targetYear = now.getFullYear();

        if (selectedPeriod === 'previous') {
            targetMonth = now.getMonth() - 1;
            targetYear = now.getFullYear();
            if (targetMonth < 0) {
                targetMonth = 11;
                targetYear -= 1;
            }
        } else if (selectedPeriod === 'custom' && customMonth) {
            const [year, month] = customMonth.split('-').map(Number);
            targetYear = year;
            targetMonth = month - 1;
        }

        return { targetMonth, targetYear };
    };

    // Função para calcular os insights baseado no período selecionado
    const calculateInsights = (loansData: Loan[], period: string, customDate: string): void => {
        let investedAmount = 0;
        let expectedAmount = 0;
        let expectedAmountWithFines = 0;
        let paidAmount = 0;
        let paidAmountWithFines = 0;
        let totalContractValue = 0;
        let totalFinesValue = 0;
        let monthYear = '';

        const now = new Date();
        let targetMonth = now.getMonth();
        let targetYear = now.getFullYear();

        if (period === 'previous') {
            targetMonth = now.getMonth() - 1;
            targetYear = now.getFullYear();
            if (targetMonth < 0) {
                targetMonth = 11;
                targetYear -= 1;
            }
        } else if (period === 'custom' && customDate) {
            const [year, month] = customDate.split('-').map(Number);
            targetYear = year;
            targetMonth = month - 1;
        }

        monthYear = new Date(targetYear, targetMonth).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });

        loansData.forEach((loan: Loan) => {
            // Valor investido: apenas empréstimos ACTIVOS criados no período selecionado
            if (loan.status === 'ACTIVE') {
                const loanDate = new Date(loan.createdAt);
                if (loanDate.getMonth() === targetMonth && loanDate.getFullYear() === targetYear) {
                    investedAmount += loan.loanAmount;
                }

                // Valor total dos contratos ativos (soma de todos os empréstimos ativos)
                totalContractValue += loan.balanceDue;
            }

            // Verificar empréstimos com status PAID no período selecionado
            if (loan.status === 'PAID') {
                const paidDate = loan.updatedAt ? new Date(loan.updatedAt) : null;

                if (paidDate && paidDate.getMonth() === targetMonth && paidDate.getFullYear() === targetYear) {
                    // Calcular multas para todas as parcelas deste empréstimo pago
                    let totalFineForLoan = 0;

                    if (loan.installmentsList && loan.installmentsList.length > 0) {
                        loan.installmentsList.forEach((installment: Installment) => {
                            if (installment.paid && installment.paymentDate) {
                                const { fineAmount } = calcInstallmentFineUtil({
                                    ...installment,
                                    dueDate: new Date(installment.dueDate),
                                    paid: true
                                });
                                totalFineForLoan += fineAmount;
                            }
                        });
                    }

                    paidAmount += loan.balanceDue;
                    paidAmountWithFines += loan.balanceDue + totalFineForLoan;
                    totalFinesValue += totalFineForLoan;
                }
            }

            // Análise de parcelas (para valores esperados e parcelas pagas de empréstimos ativos)
            if (loan.installmentsList && loan.installmentsList.length > 0) {
                loan.installmentsList.forEach((installment: Installment) => {
                    const dueDate = new Date(installment.dueDate);

                    // Calcular multa para parcelas pagas de empréstimos ACTIVOS
                    if (installment.paid && installment.paymentDate) {
                        const paymentDate = new Date(installment.paymentDate);

                        const { fineAmount } = calcInstallmentFineUtil({
                            ...installment,
                            dueDate: new Date(installment.dueDate),
                            paid: true
                        });

                        // Se o pagamento da parcela foi no período selecionado E o empréstimo ainda está ACTIVO
                        if (paymentDate.getMonth() === targetMonth && paymentDate.getFullYear() === targetYear && loan.status !== 'PAID') {
                            paidAmount += installment.amount;
                            paidAmountWithFines += installment.amount + fineAmount;
                            totalFinesValue += fineAmount;
                        }
                    }

                    // Verificar parcelas com vencimento no período (não pagas)
                    if (dueDate.getMonth() === targetMonth && dueDate.getFullYear() === targetYear) {
                        if (!installment.paid && loan.status === 'ACTIVE') {
                            expectedAmount += installment.amount;

                            const { fineAmount } = calcInstallmentFineUtil({
                                ...installment,
                                dueDate: new Date(installment.dueDate),
                                paid: false
                            });

                            expectedAmountWithFines += installment.amount + fineAmount;
                        }
                    }
                });
            }
        });

        setInsights({
            investedAmount,
            expectedAmount,
            expectedAmountWithFines,
            paidAmount,
            paidAmountWithFines,
            totalContractValue,
            totalFinesValue,
            monthYear: monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
        });
    };

    useEffect(() => {
        if (user?.role && user?.userId) {
            fetchLoans(apiUrl, user, (data: Loan[]) => {
                const normalized = data.map((loan: Loan) => ({
                    ...loan,
                    installments: Array.isArray(loan.installments) ? loan.installments : [],
                }));
                setLoans(normalized);
                calculateInsights(normalized, selectedPeriod, customMonth);
            });
        }
    }, [user]);

    // Recalcular insights quando o período mudar
    useEffect(() => {
        if (loans.length > 0) {
            calculateInsights(loans, selectedPeriod, customMonth);
            setActiveFilter('ALL'); // Resetar filtro quando mudar o período
        }
    }, [selectedPeriod, customMonth]);

    useEffect(() => {
        localStorage.setItem('loanColumns', JSON.stringify(columns));
    }, [columns]);

    // Funções para download com loading independente
    const handleDownloadPaymentNoticeClick = async (loanId: string, customerName: string) => {
        setLoadingStates(prev => ({ ...prev, paymentNotice: loanId }));
        try {
            await handleDownloadPaymentNotice(loanId, customerName, apiUrl, () => {});
        } finally {
            setLoadingStates(prev => ({ ...prev, paymentNotice: null }));
        }
    };

    const handleDownloadContractClick = async (loanId: string, customerName: string) => {
        setLoadingStates(prev => ({ ...prev, contract: loanId }));
        try {
            await handleDownloadContract(loanId, customerName, apiUrl, () => {});
        } finally {
            setLoadingStates(prev => ({ ...prev, contract: null }));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setStatusFilter(e.target.value);
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedPeriod(e.target.value);
    };

    const handleCustomMonthChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCustomMonth(e.target.value);
    };

    const handleCardClick = (filterType: FilterType): void => {
        setActiveFilter(activeFilter === filterType ? 'ALL' : filterType);
    };

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    const handleNavigate = (): void => {
        navigate('/loan');
    };

    const handleColumnToggle = (columnId: keyof Loan | 'daysLeft' | 'customerName' | 'totalFine' | 'installmentCount'): void => {
        setColumns(columns.map(col =>
            col.id === columnId ? { ...col, visible: !col.visible } : col
        ));
    };

    const resetColumns = (): void => {
        setColumns(initialColumns);
    };

    // Função para filtrar empréstimos baseado no card clicado
    const getFilteredLoansByCard = (): Loan[] => {
        const { targetMonth, targetYear } = getTargetPeriod();

        switch (activeFilter) {
            case 'INVESTED':
                // Empréstimos ACTIVOS criados no período
                return loans.filter((loan: Loan) => {
                    if (loan.status !== 'ACTIVE') return false;
                    const loanDate = new Date(loan.createdAt);
                    return loanDate.getMonth() === targetMonth && loanDate.getFullYear() === targetYear;
                });

            case 'EXPECTED':
                // Empréstimos com parcelas a vencer no período
                return loans.filter((loan: Loan) => {
                    if (loan.status !== 'ACTIVE' || !loan.installmentsList) return false;
                    return loan.installmentsList.some((installment: Installment) => {
                        const dueDate = new Date(installment.dueDate);
                        return !installment.paid &&
                            dueDate.getMonth() === targetMonth &&
                            dueDate.getFullYear() === targetYear;
                    });
                });

            case 'PAID':
                // Empréstimos com pagamentos no período (parcelas pagas ou empréstimos concluídos)
                return loans.filter((loan: Loan) => {
                    // Empréstimos concluídos no período
                    if (loan.status === 'PAID') {
                        const paidDate = loan.updatedAt ? new Date(loan.updatedAt) : null;
                        if (paidDate && paidDate.getMonth() === targetMonth && paidDate.getFullYear() === targetYear) {
                            return true;
                        }
                    }

                    // Parcelas pagas de empréstimos ativos no período
                    if (loan.installmentsList) {
                        return loan.installmentsList.some((installment: Installment) => {
                            if (!installment.paid || !installment.paymentDate) return false;
                            const paymentDate = new Date(installment.paymentDate);
                            return paymentDate.getMonth() === targetMonth &&
                                paymentDate.getFullYear() === targetYear;
                        });
                    }

                    return false;
                });

            case 'FINES':
                // Empréstimos que geraram multas no período
                return loans.filter((loan: Loan) => {
                    if (!loan.installmentsList) return false;

                    // Multas de parcelas pagas no período
                    const hasPaidFines = loan.installmentsList.some((installment: Installment) => {
                        if (!installment.paid || !installment.paymentDate) return false;
                        const paymentDate = new Date(installment.paymentDate);
                        const { fineAmount } = calcInstallmentFineUtil({
                            ...installment,
                            dueDate: new Date(installment.dueDate),
                            paid: true
                        });
                        return fineAmount > 0 &&
                            paymentDate.getMonth() === targetMonth &&
                            paymentDate.getFullYear() === targetYear;
                    });

                    // Multas estimadas de parcelas não pagas no período
                    const hasExpectedFines = loan.installmentsList.some((installment: Installment) => {
                        const dueDate = new Date(installment.dueDate);
                        if (!installment.paid && dueDate.getMonth() === targetMonth && dueDate.getFullYear() === targetYear) {
                            const { fineAmount } = calcInstallmentFineUtil({
                                ...installment,
                                dueDate: new Date(installment.dueDate),
                                paid: false
                            });
                            return fineAmount > 0;
                        }
                        return false;
                    });

                    return hasPaidFines || hasExpectedFines;
                });

            case 'TOTAL':
                // Todos os empréstimos ativos
                return loans.filter((loan: Loan) => loan.status === 'ACTIVE');

            default:
                return loans;
        }
    };

    // Aplicar todos os filtros (período, card, busca e status)
    const filteredLoans = loans.filter((loan: Loan) => {
        const matchesName = loan.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || loan.status === statusFilter;

        // Aplicar filtro do card se não for 'ALL'
        const cardFilteredLoans = getFilteredLoansByCard();
        const matchesCardFilter = activeFilter === 'ALL' || cardFilteredLoans.some((l: Loan) => l.id === loan.id);

        return matchesName && matchesStatus && matchesCardFilter;
    });

    const visibleColumns = columns.filter(col => col.visible);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'MZN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const getStatusBadge = (loan: Loan): JSX.Element => {
        const statusConfig = {
            PAID: { bg: 'bg-green-100/50', text: 'text-green-700', border: 'border-green-200', icon: <FiCheckCircle className="w-4 h-4" /> },
            PENDING: { bg: 'bg-yellow-100/50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <FiClock className="w-4 h-4" /> },
            ACTIVE: { bg: 'bg-emerald-100/50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <TbPointFilled className="w-4 h-4" /> },
            REFUSED: { bg: 'bg-red-100/50', text: 'text-red-700', border: 'border-red-200', icon: <FiXCircle className="w-4 h-4" /> },
        };

        const config = statusConfig[loan.status as keyof typeof statusConfig] || statusConfig.PENDING;

        return (
            <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
                {config.icon}
                <span className="ml-1.5">
                    {{
                        PAID: "PAGO",
                        PENDING: "PENDENTE",
                        ACTIVE: "ACTIVO",
                        REFUSED: "RECUSADO",
                    }[loan.status] || loan.status}
                </span>
            </span>
        );
    };

    const getDaysLeftBadge = (loan: Loan): JSX.Element => {
        const daysLeft = calculateDaysLeft(String(loan.activatedAt), loan.paymentTerm);

        let className = 'inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ring-1 ring-inset ';

        if (daysLeft > 22) {
            className += 'bg-green-50 text-green-700 ring-green-600/20';
        } else if (daysLeft > 15) {
            className += 'bg-green-50 text-green-700 ring-green-600/20';
        } else if (daysLeft > 8) {
            className += 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
        } else if (daysLeft > 0) {
            className += 'bg-orange-50 text-orange-700 ring-orange-600/20';
        } else {
            className += 'bg-red-50 text-red-700 ring-red-600/20';
        }

        return (
            <span className={className}>
                {daysLeft} dias
            </span>
        );
    };

    const renderCellContent = (loan: Loan, column: ColumnConfig): React.ReactNode => {
        const loanInstallments: Installment[] = (loan.installmentsList || []).map((inst: Installment) => ({
            ...inst,
            dueDate: new Date(inst.dueDate),
            paid: inst.paid ?? false
        }));
        const { totalFine } = calculateTotalFines(loanInstallments);

        switch (column.id) {
            case 'daysLeft':
                return getDaysLeftBadge(loan);
            case 'totalFine':
                return formatCurrency(totalFine);
            case 'customerName':
                return (
                    <div className="font-medium text-gray-900">
                        {loan.customer.fullName}
                    </div>
                );
            case 'loanAmount':
                return formatCurrency(loan.loanAmount);
            case 'balanceDue':
                return formatCurrency(loan.balanceDue);
            case 'paymentMethod':
                return loan.paymentMethod;
            case 'accountNumber':
                return (
                    <div className="font-mono text-sm">
                        {loan.accountNumber}
                    </div>
                );
            case 'collateral':
                return loan.collateral;
            case 'installmentCount':
                const count = loan.installmentsList.length;
                return count === 0 ? "Nenhuma" : count === 1 ? "1 mês" : `${count} meses`;
            case 'status':
                return user.role === 'ADMIN' ? (
                    <div className="relative inline-flex items-center">
                        {getStatusBadge(loan)}
                        <select
                            value={loan.status}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
                    </div>
                ) : getStatusBadge(loan);
            default:
                const value = loan[column.id as keyof Loan];
                return value || '-';
        }
    };

    // Função para determinar a classe do card baseado no filtro ativo
    const getCardClassName = (filterType: FilterType): string => {
        const baseClass = "bg-white rounded-lg border p-4 shadow-sm transition-all cursor-pointer hover:shadow-md";
        return activeFilter === filterType
            ? `${baseClass} border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50`
            : `${baseClass} border-gray-200 hover:border-indigo-300`;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Mini Dashboard - Insights - APENAS PARA ADMINISTRADORES */}
                {user?.role === 'ADMIN' && (
                    <div className="px-4 sm:px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-base font-semibold text-gray-900">Insights Financeiros</h3>
                                {activeFilter !== 'ALL' && (
                                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                        Filtro ativo
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4 text-gray-500" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={handlePeriodChange}
                                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        <option value="current">Mês Atual</option>
                                        <option value="previous">Mês Anterior</option>
                                        <option value="custom">Personalizado</option>
                                    </select>
                                </div>

                                {selectedPeriod === 'custom' && (
                                    <input
                                        type="month"
                                        value={customMonth}
                                        onChange={handleCustomMonthChange}
                                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card - Valor Investido */}
                            <div
                                className={getCardClassName('INVESTED')}
                                onClick={() => handleCardClick('INVESTED')}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                            <FiDollarSign className="w-4 h-4 text-green-600" />
                                            Valor Investido
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(insights.investedAmount)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {activeFilter === 'INVESTED' ? 'Filtrando...' : 'Clique para filtrar'}
                                        </p>
                                    </div>
                                    <div className="bg-green-100 rounded-full p-2">
                                        <FiTrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Card - Valor Esperado (com e sem multa) */}
                            <div
                                className={getCardClassName('EXPECTED')}
                                onClick={() => handleCardClick('EXPECTED')}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                            <FiCalendar className="w-4 h-4 text-blue-600" />
                                            Valor Esperado
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(insights.expectedAmountWithFines)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                Sem multa: {formatCurrency(insights.expectedAmount)}
                                            </span>
                                            {insights.expectedAmountWithFines > insights.expectedAmount && (
                                                <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                                    +{formatCurrency(insights.expectedAmountWithFines - insights.expectedAmount)} multas
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {activeFilter === 'EXPECTED' ? 'Filtrando...' : 'Clique para filtrar'}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 rounded-full p-2">
                                        <FiDollarSign className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Card - Valor Pago (com e sem multa) */}
                            <div
                                className={getCardClassName('PAID')}
                                onClick={() => handleCardClick('PAID')}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                                            Valor Pago
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(insights.paidAmountWithFines)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                Sem multa: {formatCurrency(insights.paidAmount)}
                                            </span>
                                            {insights.paidAmountWithFines > insights.paidAmount && (
                                                <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                                    +{formatCurrency(insights.paidAmountWithFines - insights.paidAmount)} multas
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {activeFilter === 'PAID' ? 'Filtrando...' : 'Clique para filtrar'}
                                        </p>
                                    </div>
                                    <div className="bg-emerald-100 rounded-full p-2">
                                        <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Card - Resumo Total */}
                            <div
                                className={getCardClassName('TOTAL')}
                                onClick={() => handleCardClick('TOTAL')}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                                            <FiAlertCircle className="w-4 h-4 text-purple-600" />
                                            Resumo Total
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            Contratos: {formatCurrency(insights.totalContractValue)}
                                        </p>
                                        <div
                                            className="flex items-center gap-2 mt-1 cursor-pointer hover:opacity-70"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                handleCardClick('FINES');
                                            }}
                                        >
                                            <span className="text-xs text-gray-500">
                                                Multas totais:
                                            </span>
                                            <span className="text-xs font-medium text-orange-600">
                                                {formatCurrency(insights.totalFinesValue)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {activeFilter === 'TOTAL' ? 'Filtrando...' : 'Clique para filtrar contratos'}
                                        </p>
                                    </div>
                                    <div className="bg-purple-100 rounded-full p-2">
                                        <FiTrendingUp className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Indicador de performance e filtro ativo */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">Investido</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-600">Esperado</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-gray-600">Pago</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-gray-600">Multas</span>
                                </div>
                            </div>

                            {activeFilter !== 'ALL' && (
                                <button
                                    onClick={() => setActiveFilter('ALL')}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Limpar filtro
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Lista de Empréstimos - {insights.monthYear}
                                {activeFilter !== 'ALL' && (
                                    <span className="ml-2 text-sm font-normal text-indigo-600">
                                        (Filtrado por {activeFilter === 'INVESTED' ? 'Valor Investido' :
                                            activeFilter === 'EXPECTED' ? 'Valor Esperado' :
                                                activeFilter === 'PAID' ? 'Valor Pago' :
                                                    activeFilter === 'TOTAL' ? 'Contratos Ativos' :
                                                        activeFilter === 'FINES' ? 'Multas' : ''})
                                    </span>
                                )}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {filteredLoans.length} empréstimo{filteredLoans.length !== 1 ? 's' : ''} encontrado{filteredLoans.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {user.role === 'USER' && (
                                <button
                                    onClick={handleNavigate}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <span>Novo Empréstimo</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtros e Configurações */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="search"
                                name="search"
                                placeholder="Pesquisar por cliente..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-9 pr-3 py-2 text-sm w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={handleStatusChange}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="ALL">Todos</option>
                                <option value="ACTIVE">Activos</option>
                                <option value="PENDING">Pendentes</option>
                                <option value="PAID">Pagos</option>
                                <option value="REFUSED">Recusados</option>
                            </select>

                            <button
                                onClick={() => setShowColumnConfig(!showColumnConfig)}
                                className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Colunas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Configuração de Colunas */}
                {showColumnConfig && (
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-900">Colunas Visíveis</h3>
                            <button
                                onClick={resetColumns}
                                className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                Padrão
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {columns.map((column: ColumnConfig) => (
                                <label
                                    key={column.id}
                                    className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={column.visible}
                                        onChange={() => handleColumnToggle(column.id as keyof Loan | 'daysLeft' | 'customerName' | 'totalFine' | 'installmentCount')}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-xs sm:text-sm text-gray-700">
                                        {column.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {visibleColumns.map((column: ColumnConfig) => (
                                        <th
                                            key={column.id}
                                            scope="col"
                                            className={`px-3 sm:px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${{
                                                left: 'text-left',
                                                center: 'text-center',
                                                right: 'text-right'
                                            }[column.align || 'left']
                                                }`}
                                            style={{ width: column.width }}
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                    <th className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center w-24">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length + 1} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm sm:text-base text-gray-500 font-medium">
                                                    Nenhum empréstimo encontrado
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                    {searchTerm ? 'Tente pesquisar com outros termos' :
                                                        activeFilter !== 'ALL' ? 'Não há empréstimos para este filtro no período selecionado' :
                                                            'Selecione um período para visualizar empréstimos'}
                                                </p>
                                                {activeFilter !== 'ALL' && (
                                                    <button
                                                        onClick={() => setActiveFilter('ALL')}
                                                        className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                    >
                                                        Limpar filtro
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLoans.map((loan: Loan) => (
                                        <React.Fragment key={loan.id}>
                                            <tr className="hover:bg-gray-50">
                                                {visibleColumns.map((column: ColumnConfig) => (
                                                    <td
                                                        key={`${loan.id}-${column.id}`}
                                                        className={`px-3 sm:px-4 py-3 text-sm ${{
                                                            left: 'text-left',
                                                            center: 'text-center',
                                                            right: 'text-right'
                                                        }[column.align || 'left']
                                                            }`}
                                                    >
                                                        <div className={column.wrap ? 'whitespace-normal' : 'whitespace-nowrap'}>
                                                            {renderCellContent(loan, column)}
                                                        </div>
                                                    </td>
                                                ))}
                                                <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                if (expandedLoanId === loan.id) {
                                                                    setExpandedLoanId(null);
                                                                } else {
                                                                    setExpandedLoanId(loan.id);
                                                                    setInstallments(loan.installmentsList || []);
                                                                }
                                                            }}
                                                            className="text-gray-600 hover:text-gray-900 p-1.5 rounded hover:bg-gray-100"
                                                            title="Ver parcelas"
                                                        >
                                                            <FiEye className="w-4 h-4" />
                                                        </button>

                                                        {user.role === 'ADMIN' && (
                                                            <>
                                                                {/* Botão Payment Notice - Verde */}
                                                                <button
                                                                    onClick={() => handleDownloadPaymentNoticeClick(loan.id, loan.customer.fullName)}
                                                                    className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded hover:bg-emerald-50 disabled:opacity-50"
                                                                    disabled={loadingStates.paymentNotice === loan.id}
                                                                    title="Baixar notificação de pagamento"
                                                                >
                                                                    {loadingStates.paymentNotice === loan.id ? (
                                                                        <FiLoader className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                    )}
                                                                </button>

                                                                {/* Botão Contract - Azul */}
                                                                <button
                                                                    onClick={() => handleDownloadContractClick(loan.id, loan.customer.fullName)}
                                                                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 disabled:opacity-50"
                                                                    disabled={loadingStates.contract === loan.id}
                                                                    title="Baixar contrato"
                                                                >
                                                                    {loadingStates.contract === loan.id ? (
                                                                        <FiLoader className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <FiDownload className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                                
                                                                <DeleteModal
                                                                    text=""
                                                                    subtitles="Tem certeza de que deseja excluir este empréstimo?"
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
                                                                    id={loan.id} />
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Tabela suspensa de parcelas */}
                                            {expandedLoanId === loan.id && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan={visibleColumns.length + 1} className="p-4">
                                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h4 className="text-sm font-semibold text-gray-900">
                                                                    Parcelas - {loan.customer.fullName}
                                                                </h4>
                                                                <span className="text-xs text-gray-500">
                                                                    {loan.installmentsList.length} parcela{loan.installmentsList.length !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>

                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-100">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Parcela</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Data Vencimento</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Valor</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Multa</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Data Pagamento</th>
                                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Pago</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {installments.map((inst: Installment, idx: number) => {
                                                                            const { fineAmount } = calcInstallmentFineUtil({
                                                                                ...inst,
                                                                                dueDate: new Date(inst.dueDate),
                                                                                paid: inst.paid
                                                                            });
                                                                            return (
                                                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                                    <td className="px-4 py-2 text-sm text-gray-600">
                                                                                        {{
                                                                                            1: 'Primeira',
                                                                                            2: 'Segunda',
                                                                                            3: 'Terceira',
                                                                                        }[inst.installmentNumber] || `${inst.installmentNumber}ª`}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-gray-600">
                                                                                        {inst.dueDate instanceof Date
                                                                                            ? inst.dueDate.toLocaleDateString('pt-BR')
                                                                                            : new Date(inst.dueDate).toLocaleDateString('pt-BR')}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-gray-600 font-medium">
                                                                                        {formatCurrency(inst.amount)}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm">
                                                                                        {fineAmount > 0 ? (
                                                                                            <span className="text-orange-600 font-medium">
                                                                                                {formatCurrency(fineAmount)}
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="text-gray-400">-</span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-gray-600">
                                                                                        {inst.paymentDate ? new Date(inst.paymentDate).toLocaleDateString('pt-BR') : '-'}
                                                                                    </td>
                                                                                    <td className="px-4 py-2 text-sm text-center">
                                                                                        {user.role === 'ADMIN' ? (
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    markInstallmentAsPaid(inst.id, installments, {
                                                                                                        setInstallments,
                                                                                                        setAlertText,
                                                                                                        setIsModalSuccessOpen,
                                                                                                        setIsModalOpen,
                                                                                                    })
                                                                                                }
                                                                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full hover:opacity-70 ${inst.paid
                                                                                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                                                    }`}
                                                                                                title={inst.paid ? 'Marcar como não pago' : 'Marcar como pago'}
                                                                                            >
                                                                                                {inst.paid ? (
                                                                                                    <FiCheckCircle className="w-4 h-4" />
                                                                                                ) : (
                                                                                                    <FiXCircle className="w-4 h-4" />
                                                                                                )}
                                                                                            </button>
                                                                                        ) : (
                                                                                            <span
                                                                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${inst.paid
                                                                                                    ? 'bg-green-100 text-green-600'
                                                                                                    : 'bg-red-100 text-red-600'
                                                                                                    }`}
                                                                                            >
                                                                                                {inst.paid ? (
                                                                                                    <FiCheckCircle className="w-4 h-4" />
                                                                                                ) : (
                                                                                                    <FiXCircle className="w-4 h-4" />
                                                                                                )}
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                {filteredLoans.length > 0 && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    <span className="font-medium">{filteredLoans.length}</span> de{' '}
                                    <span className="font-medium">{loans.length}</span> empréstimos
                                </p>
                                {visibleColumns.length < columns.length && (
                                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                        {columns.length - visibleColumns.length} coluna
                                        {columns.length - visibleColumns.length !== 1 ? 's' : ''} oculta
                                        {columns.length - visibleColumns.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowColumnConfig(!showColumnConfig)}
                                    className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded whitespace-nowrap"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    Colunas ({visibleColumns.length}/{columns.length})
                                </button>
                                {activeFilter !== 'ALL' && (
                                    <button
                                        onClick={() => setActiveFilter('ALL')}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Limpar filtro
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Alert text={alertText} isOpen={isModalOpen} onClose={handleCloseModal} />
            {isModalSuccessOpen && <SuccessAlert isOpen={isModalSuccessOpen} onClose={handleCloseModal} text={alertText} />}
        </>
    );
};

export default Loans;