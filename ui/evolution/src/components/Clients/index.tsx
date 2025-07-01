import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DeleteModal } from '../Modal/deleteModal';
import { Alert } from '../Modal/alert';
import { handleError } from '../../handleError';

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
    isActive?: 'PAID' | 'PENDING' | 'ACTIVE' | 'REFUSED';
}

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${apiUrl}/ibuildCustomer`);
            const userCustomers = response.data;
            const sortedCustomers = userCustomers.sort(
                (a: Customer, b: Customer) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setCustomers(sortedCustomers);
        } catch (error) {
            console.error('Error fetching Customers:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const deleteCustomer = async (id: string) => {
        try {
            await axios.delete(`${apiUrl}/ibuildCustomer/${id}`);
            setCustomers(customers.filter(customer => customer.id !== id));
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
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="container mx-auto">
                <div className="relative text-gray-600 mb-4">
                    <input
                        type="search"
                        name="search"
                        placeholder="Pesquisar por nome..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border-2 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
                    />
                </div>

                {/* Rolagem vertical e horizontal com sombra e bordas arredondadas */}
                <div className="max-h-[460px] overflow-y-auto overflow-x-auto shadow-2xl rounded-md custom-scroll">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="sticky top-0 z-10 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500"></th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Nome</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">D.Nascimento</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Profissão</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Actividade</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Renda</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Estado Civil</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Endereço</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Contacto</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">E-mail</th>
                                <th className="px-6 py-3 text-left font-medium text-xs leading-5 text-gray-500">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id}>
                                    <td className="text-center px-5 text-lg text-gray-500">
                                        <div className={`w-2 h-2 rounded-full ${
                                            customer.loan?.isActive === 'ACTIVE' ? 'bg-green-500' :
                                            customer.loan?.isActive === 'PENDING' ? 'bg-yellow-500' :
                                            customer.loan?.isActive === 'PAID' ? 'bg-green-500' :
                                            customer.loan?.isActive === 'REFUSED' ? 'bg-red-500' :
                                            'bg-gray-500'
                                        }`} />
                                    </td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.fullName}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{new Date(customer.dateOfBirth).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.profession}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.incomeSource}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.monthlyIncome.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.marital_status}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.address}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.contact}</td>
                                    <td className="px-6 py-4 text-xs leading-5 text-gray-500">{customer.email}</td>
                                    <td className="px-6 py-4 text-lg leading-5 text-gray-500">
                                        <DeleteModal
                                            text="Eliminar"
                                            subtitles="Tem certeza de que deseja excluir?"
                                            onSubmit={() => deleteCustomer(customer.id)}
                                            id={customer.id}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Alert text={alertText} isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default Customers;
