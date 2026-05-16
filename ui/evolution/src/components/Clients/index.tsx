import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteModal } from '../Modal/deleteModal';
import { Alert } from '../Modal/alert';

interface Customer {
    loan: any;
    id: string;
    fullName: string;
    dateOfBirth: string;
    profession: string;
    email: string;
    contact: string;
    gender: string;
    marital_status: string;
    address: string;
    incomeSource: string;
    monthlyIncome: number;
    identityNumber: string;
    createdAt: string;
    hasActiveLoan: boolean;
    status?: 'PAID' | 'PENDING' | 'ACTIVE' | 'REFUSED';
}

interface ColumnConfig {
    id: keyof Customer | 'statusBadge';
    label: string;
    visible: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    wrap?: boolean;
}

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [loading, setLoading] = useState(true);
    const [showColumnConfig, setShowColumnConfig] = useState(false);
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const initialColumns: ColumnConfig[] = [
        {
            id: 'statusBadge',
            label: 'Status',
            visible: true,
            width: '60px',
            align: 'center',
            wrap: false
        },
        {
            id: 'fullName',
            label: 'Nome',
            visible: true,
            width: '180px',
            align: 'left',
            wrap: false
        },
        {
            id: 'dateOfBirth',
            label: 'Nascimento',
            visible: typeof window !== 'undefined' && window.innerWidth > 768,
            width: '110px',
            align: 'center',
            wrap: false
        },
        {
            id: 'profession',
            label: 'Profissão',
            visible: typeof window !== 'undefined' && window.innerWidth > 1024,
            width: '150px',
            align: 'left',
            wrap: true
        },
        {
            id: 'incomeSource',
            label: 'Actividade',
            visible: typeof window !== 'undefined' && window.innerWidth > 1024,
            width: '150px',
            align: 'left',
            wrap: true
        },
        {
            id: 'monthlyIncome',
            label: 'Renda',
            visible: true,
            width: '120px',
            align: 'right',
            wrap: false
        },
        {
            id: 'marital_status',
            label: 'Estado Civil',
            visible: typeof window !== 'undefined' && window.innerWidth > 1024,
            width: '120px',
            align: 'center',
            wrap: false
        },
        {
            id: 'address',
            label: 'Endereço',
            visible: false,
            width: '220px',
            align: 'left',
            wrap: true
        },
        {
            id: 'contact',
            label: 'Contacto',
            visible: true,
            width: '120px',
            align: 'center',
            wrap: false
        },
        {
            id: 'email',
            label: 'E-mail',
            visible: typeof window !== 'undefined' && window.innerWidth > 768,
            width: '200px',
            align: 'left',
            wrap: false
        },
    ];

    const [columns, setColumns] = useState<ColumnConfig[]>(() => {
        const saved = localStorage.getItem('customerColumns');
        return saved ? JSON.parse(saved) : initialColumns;
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        localStorage.setItem('customerColumns', JSON.stringify(columns));
    }, [columns]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/ibuildCustomer`);
            const userCustomers = response.data;
            const sortedCustomers = userCustomers.sort(
                (a: Customer, b: Customer) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setCustomers(sortedCustomers);
        } catch (error) {
            console.error('Error fetching Customers:', error);
            setAlertText("Erro ao carregar clientes. Tente novamente.");
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const deleteCustomer = async (id: string) => {
        try {
            await axios.delete(`${apiUrl}/ibuildCustomer/${id}`);
            setCustomers(customers.filter(customer => customer.id !== id));
            setAlertText("Cliente excluído com sucesso!");
            setIsModalOpen(true);
        } catch (error) {
            setAlertText("Cliente possui um empréstimo ativo e não pode ser excluído.");
            setIsModalOpen(true);
            console.error('Error deleting customer:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.identityNumber.includes(searchTerm) ||
        customer.profession.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (customer: Customer) => {
        const loans = Array.isArray(customer.loan) ? customer.loan : [];

        if (loans.some(l => l.status === 'ACTIVE')) {
            return 'bg-green-500';
        }
        if (loans.some(l => l.status === 'REFUSED')) {
            return 'bg-red-500';
        }
        if (loans.length > 0) {
            return 'bg-yellow-500';
        }
        return 'bg-gray-500';
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return '-';
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'MZN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleColumnToggle = (columnId: string) => {
        setColumns(columns.map(col =>
            col.id === columnId ? { ...col, visible: !col.visible } : col
        ));
    };

    const resetColumns = () => {
        setColumns(initialColumns);
    };

    const visibleColumns = columns.filter(col => col.visible);

    const renderCellContent = (customer: Customer, column: ColumnConfig) => {
        switch (column.id) {
            case 'statusBadge':
                return (
                    <div className="flex justify-center">
                        <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(customer)}`}
                            title={(() => {
                                const loans = Array.isArray(customer.loan) ? customer.loan : [];
                                if (loans.some(l => l.status === 'ACTIVE')) return 'Empréstimo Ativo';
                                if (loans.some(l => l.status === 'REFUSED')) return 'Empréstimo Recusado';
                                if (loans.length > 0) return 'Tem Empréstimos';
                                return 'Sem Empréstimos';
                            })()}
                        />
                    </div>
                );
            case 'dateOfBirth':
                return (
                    <div className={`${column.wrap ? 'whitespace-normal' : 'whitespace-nowrap'}`}>
                        {formatDate(customer.dateOfBirth)}
                    </div>
                );
            case 'monthlyIncome':
                return (
                    <div className={`font-medium ${column.wrap ? 'whitespace-normal' : 'whitespace-nowrap'}`}>
                        {formatCurrency(customer.monthlyIncome)}
                    </div>
                );
            case 'address':
                return (
                    <div className={column.wrap ? 'whitespace-normal break-words' : 'whitespace-nowrap'}>
                        {customer.address}
                    </div>
                );
            case 'email':
                return (
                    <div className={column.wrap ? 'whitespace-normal break-all' : 'whitespace-nowrap'}>
                        {customer.email}
                    </div>
                );
            default:
                const value = customer[column.id as keyof Customer];
                return (
                    <div className={column.wrap ? 'whitespace-normal' : 'whitespace-nowrap'}>
                        {value || '-'}
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Clientes</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {filteredCustomers.length} cliente{filteredCustomers.length !== 1 ? 's' : ''} encontrado{filteredCustomers.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <div className="relative w-full sm:w-48 flex-1 sm:flex-none">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    name="search"
                                    placeholder="Pesquisar..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-9 pr-3 py-2 text-sm w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

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
                                        onChange={() => handleColumnToggle(column.id)}
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
                                    <th className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right w-24">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length + 1} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm sm:text-base text-gray-500 font-medium">Nenhum cliente encontrado</p>
                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                    {searchTerm ? 'Tente pesquisar com outros termos' : 'Cadastre seu primeiro cliente'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            {visibleColumns.map((column) => (
                                                <td
                                                    key={`${customer.id}-${column.id}`}
                                                    className={`px-3 sm:px-4 py-3 text-sm text-gray-900 ${{
                                                        'left': 'text-left',
                                                        'center': 'text-center',
                                                        'right': 'text-right'
                                                    }[column.align || 'left']}`}
                                                >
                                                    {renderCellContent(customer, column)}
                                                </td>
                                            ))}
                                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            // Adicionar funcionalidade de visualização
                                                        }}
                                                        className="text-gray-600 hover:text-gray-900 p-1 sm:p-1.5 rounded hover:bg-gray-100"
                                                        title="Visualizar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // Adicionar funcionalidade de edição
                                                        }}
                                                        className="text-gray-600 hover:text-gray-900 p-1 sm:p-1.5 rounded hover:bg-gray-100"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <DeleteModal
                                                        text=""
                                                        subtitles="Tem certeza de que deseja excluir este cliente?"
                                                        onSubmit={() => deleteCustomer(customer.id)}
                                                        id={customer.id}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                {filteredCustomers.length > 0 && (
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    <span className="font-medium">{filteredCustomers.length}</span> de{' '}
                                    <span className="font-medium">{customers.length}</span> clientes
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
                                <button
                                    onClick={fetchCustomers}
                                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
                                >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Atualizar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Alert text={alertText} isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default Customers;