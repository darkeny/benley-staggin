import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from '../Modal/alert';
import { FiUsers, FiShield, FiKey, FiRefreshCw, FiCheckCircle, FiX, FiPlus } from 'react-icons/fi';
import { useFetchUserData } from '../../utils';

interface Customer {
    id: string;
    fullName: string;
    email: string;
    contact: string;
    identityNumber: string;
    createdAt: string;
}

interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'MASTER';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
}

const MasterManagement: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [activeSection, setActiveSection] = useState<'customers' | 'admins'>('customers');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [loading, setLoading] = useState(true);
    
    // States for custom modals (Customers)
    const [resetPasswordConfig, setResetPasswordConfig] = useState<{ isOpen: boolean; customerId: string; customerName: string; newPass: string }>({
        isOpen: false,
        customerId: '',
        customerName: '',
        newPass: ''
    });

    // States for Admin Modals
    const [adminModal, setAdminModal] = useState<{ isOpen: boolean; mode: 'create' | 'reset' | 'status'; adminId: string; adminName: string; data: any }>({
        isOpen: false,
        mode: 'create',
        adminId: '',
        adminName: '',
        data: {}
    });

    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const { user } = useFetchUserData();

    useEffect(() => {
        fetchData();
    }, [activeSection]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeSection === 'customers') {
                const response = await axios.get(`${apiUrl}/ibuildCustomer`);
                setCustomers(response.data);
            } else {
                const response = await axios.get(`${apiUrl}/master/admins`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                setAdmins(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setAlertText("Erro ao carregar dados. Verifique suas permissões.");
            setIsAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetPasswordConfig.newPass) {
            setAlertText("Por favor, insira a nova senha.");
            setIsAlertOpen(true);
            return;
        }

        try {
            await axios.post(`${apiUrl}/master/reset-password`, {
                customerId: resetPasswordConfig.customerId,
                newPassword: resetPasswordConfig.newPass
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            
            setAlertText(`Senha de ${resetPasswordConfig.customerName} redefinida com sucesso!`);
            setIsAlertOpen(true);
            setResetPasswordConfig({ ...resetPasswordConfig, isOpen: false, newPass: '' });
        } catch (error) {
            setAlertText("Erro ao redefinir senha.");
            setIsAlertOpen(true);
        }
    };

    const handleAdminAction = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const headers = { Authorization: `Bearer ${token}` };

            if (adminModal.mode === 'create') {
                await axios.post(`${apiUrl}/master/admins`, adminModal.data, { headers });
                setAlertText("Novo administrador criado!");
            } else if (adminModal.mode === 'reset') {
                await axios.post(`${apiUrl}/master/admins/${adminModal.adminId}/reset-password`, { newPassword: adminModal.data.password }, { headers });
                setAlertText("Senha do administrador resetada!");
            } else if (adminModal.mode === 'status') {
                await axios.put(`${apiUrl}/master/admins/${adminModal.adminId}/status`, { status: adminModal.data.status }, { headers });
                setAlertText("Status do administrador atualizado!");
            }

            setIsAlertOpen(true);
            setAdminModal({ ...adminModal, isOpen: false });
            fetchData();
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "Erro ao realizar operação.";
            setAlertText(errorMsg);
            setIsAlertOpen(true);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja remover este administrador permanentemente?")) return;
        try {
            await axios.delete(`${apiUrl}/master/admins/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setAlertText("Administrador removido.");
            setIsAlertOpen(true);
            fetchData();
        } catch (error) {
            setAlertText("Erro ao remover administrador.");
            setIsAlertOpen(true);
        }
    };

    const handleUpdateRole = async (adminId: string, newRole: string) => {
        try {
            await axios.put(`${apiUrl}/master/admin-role`, {
                adminId,
                role: newRole
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            
            setAlertText("Papel do utilizador atualizado!");
            setIsAlertOpen(true);
            fetchData();
        } catch (error) {
            setAlertText("Erro ao atualizar papel.");
            setIsAlertOpen(true);
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAdmins = admins.filter(a => 
        (a.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (a.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveSection('customers')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeSection === 'customers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <FiUsers /> Gestão de Clientes
                    </button>
                    <button
                        onClick={() => setActiveSection('admins')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeSection === 'admins' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <FiShield /> Gestão de Acessos
                    </button>
                </div>

                {activeSection === 'admins' && (
                    <button
                        onClick={() => setAdminModal({ isOpen: true, mode: 'create', adminId: '', adminName: '', data: { role: 'ADMIN' } })}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
                    >
                        <FiPlus /> Novo Administrador
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {activeSection === 'customers' ? 'Clientes Cadastrados' : 'Utilizadores Administrativos'}
                        </h2>
                        <p className="text-sm text-slate-500">Gerencie contas e permissões de forma centralizada.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-4 pr-10 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <FiRefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-slate-500 animate-pulse">Carregando dados...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identificação</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {activeSection === 'customers' ? 'Contacto' : 'Status'}
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {activeSection === 'customers' ? 'Data de Cadastro' : 'Papel'}
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activeSection === 'customers' ? (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{customer.fullName}</div>
                                                <div className="text-xs text-slate-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{customer.contact}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setResetPasswordConfig({ isOpen: true, customerId: customer.id, customerName: customer.fullName, newPass: '' })}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-xs font-bold"
                                                >
                                                    <FiKey /> Reset Password
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    filteredAdmins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{admin.username}</div>
                                                <div className="text-xs text-slate-500">{admin.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setAdminModal({ isOpen: true, mode: 'status', adminId: admin.id, adminName: admin.username, data: { status: admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } })}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        admin.status === 'ACTIVE' 
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {admin.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    disabled={admin.id === user?.userId}
                                                    value={admin.role}
                                                    onChange={(e) => handleUpdateRole(admin.id, e.target.value)}
                                                    className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                                >
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="MASTER">MASTER</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => setAdminModal({ isOpen: true, mode: 'reset', adminId: admin.id, adminName: admin.username, data: {} })}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Reset Senha">
                                                        <FiKey />
                                                    </button>
                                                    <button 
                                                        disabled={admin.id === user?.userId}
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30" title="Apagar">
                                                        <FiX className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal for Admin Actions (Create/Reset/Status) */}
            {adminModal.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-zoom-in">
                        <div className={`p-6 border-b border-slate-100 ${adminModal.mode === 'reset' ? 'bg-amber-50' : 'bg-indigo-50'}`}>
                            <h3 className={`text-xl font-bold ${adminModal.mode === 'reset' ? 'text-amber-800' : 'text-indigo-800'}`}>
                                {adminModal.mode === 'create' ? 'Novo Administrador' : adminModal.mode === 'reset' ? 'Redefinir Senha Admin' : 'Alterar Status'}
                            </h3>
                            <p className="text-sm opacity-70 mt-1">
                                {adminModal.mode === 'create' ? 'Adicione um novo utilizador administrativo ao sistema.' : `Ação para utilizador: ${adminModal.adminName}`}
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {adminModal.mode === 'create' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                            value={adminModal.data.username || ''}
                                            onChange={(e) => setAdminModal({ ...adminModal, data: { ...adminModal.data, username: e.target.value } })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                            value={adminModal.data.email || ''}
                                            onChange={(e) => setAdminModal({ ...adminModal, data: { ...adminModal.data, email: e.target.value } })}
                                        />
                                    </div>
                                </>
                            )}

                            {(adminModal.mode === 'create' || adminModal.mode === 'reset') && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Senha</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                        value={adminModal.data.password || ''}
                                        onChange={(e) => setAdminModal({ ...adminModal, data: { ...adminModal.data, password: e.target.value } })}
                                    />
                                </div>
                            )}

                            {adminModal.mode === 'status' && (
                                <p className="text-slate-600 font-medium text-center py-4">
                                    Deseja alterar o status de <b>{adminModal.adminName}</b> para <span className="text-indigo-600 uppercase font-black tracking-widest">{adminModal.data.status}</span>?
                                </p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setAdminModal({ ...adminModal, isOpen: false })}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAdminAction}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal for Password Reset (Customers) */}
            {resetPasswordConfig.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-zoom-in">
                        <div className="p-6 border-b border-slate-100 bg-amber-50">
                            <h3 className="text-xl font-bold text-amber-800">Redefinir Senha do Cliente</h3>
                            <p className="text-sm text-amber-700 mt-1">Defina uma nova senha para <b>{resetPasswordConfig.customerName}</b></p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nova Senha</label>
                                <input
                                    type="password"
                                    placeholder="Digite a nova senha..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    value={resetPasswordConfig.newPass}
                                    onChange={(e) => setResetPasswordConfig({ ...resetPasswordConfig, newPass: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 mt-2 italic">* O cliente deverá ser informado da nova senha manualmente.</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setResetPasswordConfig({ ...resetPasswordConfig, isOpen: false })}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-shadow shadow-md shadow-amber-600/20"
                                >
                                    Confirmar Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Alert isOpen={isAlertOpen} text={alertText} onClose={() => setIsAlertOpen(false)} />
        </div>
    );
};

export default MasterManagement;
