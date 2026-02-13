import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiDownload, FiLoader, FiXCircle, FiEye } from "react-icons/fi";
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
import { calculateTotalFines } from '../../utils/loans/installmentsFines';
import { markInstallmentAsPaid } from '../../utils/installments/fetchInstallments';

interface ColumnConfig {
    id: keyof Loan | 'daysLeft' | 'customerName' | 'totalFine' | 'installmentCount';
    label: string;
    visible: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    wrap?: boolean;
}

const Loans: React.FC = () => {
    const navigate = useNavigate();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
    const [installments, setInstallments] = useState<Installment[]>([]);
    const [showColumnConfig, setShowColumnConfig] = useState(false);
    const { user } = useFetchUserData();
    const apiUrl = import.meta.env.VITE_APP_API_URL;

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

    useEffect(() => {
        if (user?.role && user?.userId) {
            fetchLoans(apiUrl, user, (data: Loan[]) => {
                const normalized = data.map(loan => ({
                    ...loan,
                    installments: Array.isArray(loan.installments) ? loan.installments : [],
                }));
                setLoans(normalized);
            });
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('loanColumns', JSON.stringify(columns));
    }, [columns]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const filteredLoans = loans.filter(loan => {
        const matchesName = loan.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || loan.status === statusFilter;
        return matchesName && matchesStatus;
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalSuccessOpen(false);
    };

    const handleNavigate = () => {
        navigate('/loan');
    };

    const handleColumnToggle = (columnId: keyof Loan | 'daysLeft' | 'customerName' | 'totalFine' | 'installmentCount') => {
        setColumns(columns.map(col =>
            col.id === columnId ? { ...col, visible: !col.visible } : col
        ));
    };

    const resetColumns = () => {
        setColumns(initialColumns);
    };

    const visibleColumns = columns.filter(col => col.visible);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'MZN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const getStatusBadge = (loan: Loan) => {
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

    const getDaysLeftBadge = (loan: Loan) => {
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

    const renderCellContent = (loan: Loan, column: ColumnConfig) => {
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
                    </div>
                ) : getStatusBadge(loan);
            default:
                const value = loan[column.id as keyof Loan];
                return value || '-';
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Empréstimos</h2>
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
                            {columns.map((column) => (
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
                                    {visibleColumns.map((column) => (
                                        <th
                                            key={column.id}
                                            scope="col"
                                            className={`px-3 sm:px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${{
                                                'left': 'text-left',
                                                'center': 'text-center',
                                                'right': 'text-right'
                                            }[column.align || 'left']}`}
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
                                                <p className="text-sm sm:text-base text-gray-500 font-medium">Nenhum empréstimo encontrado</p>
                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                    {searchTerm ? 'Tente pesquisar com outros termos' : user.role === 'USER' ? 'Solicite seu primeiro empréstimo' : 'Nenhum empréstimo registrado'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLoans.map(loan => (
                                        <React.Fragment key={loan.id}>
                                            <tr className="hover:bg-gray-50">
                                                {visibleColumns.map((column) => (
                                                    <td
                                                        key={`${loan.id}-${column.id}`}
                                                        className={`px-3 sm:px-4 py-3 text-sm ${{
                                                            'left': 'text-left',
                                                            'center': 'text-center',
                                                            'right': 'text-right'
                                                        }[column.align || 'left']}`}
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
                                                                    id={loan.id}/>

                                                                <button
                                                                    onClick={() =>
                                                                        handleDownloadContract(
                                                                            loan.id,
                                                                            loan.customer.fullName,
                                                                            apiUrl,
                                                                            setLoadingId
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 disabled:opacity-50"
                                                                    disabled={loadingId === loan.id}
                                                                    title="Baixar contrato"
                                                                >
                                                                    {loadingId === loan.id ? (
                                                                        <FiLoader className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        <FiDownload className="w-4 h-4" />
                                                                    )}
                                                                </button>
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
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Data Pagamento</th>
                                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Pago</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {installments.map((inst, idx) => (
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
                                                                                            {inst.paid ?
                                                                                                <FiCheckCircle className="w-4 h-4" /> :
                                                                                                <FiXCircle className="w-4 h-4" />
                                                                                            }
                                                                                        </button>
                                                                                    ) : (
                                                                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${inst.paid
                                                                                                ? 'bg-green-100 text-green-600'
                                                                                                : 'bg-red-100 text-red-600'
                                                                                            }`}>
                                                                                            {inst.paid ?
                                                                                                <FiCheckCircle className="w-4 h-4" /> :
                                                                                                <FiXCircle className="w-4 h-4" />
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
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
                                        {columns.length - visibleColumns.length} coluna{columns.length - visibleColumns.length !== 1 ? 's' : ''} oculta{columns.length - visibleColumns.length !== 1 ? 's' : ''}
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