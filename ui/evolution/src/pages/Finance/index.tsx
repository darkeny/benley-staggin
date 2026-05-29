import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loans from '../../components/Loans';
import { ClientFinance } from '../../components/ClientFinance';
import { useFetchUserData } from '../../utils'; 
import { WelcomeModal } from '../../components/Modal/WelcomeModal';
import { ClientLayout } from '../../components/Layout/ClientLayout';

const ClientPanel: React.FC = () => {
    const { loading, error } = useFetchUserData();
    const location = useLocation();
    const [showWelcome, setShowWelcome] = useState(location.state?.newClient || false);
    const generatedPassword = location.state?.generatedPassword || '';
    const [activeTab, setActiveTab] = useState<'finance' | 'loans'>('finance');

    const renderContent = () => {
        if (activeTab === 'loans') return <Loans />;
        return <ClientFinance />;
    };

    const getTitle = () => {
        if (activeTab === 'loans') return 'Meus Empréstimos';
        return 'Situação Financeira';
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;

    return (
        <ClientLayout activeTab={activeTab} setActiveTab={setActiveTab} title={getTitle()}>
            <WelcomeModal 
                isOpen={showWelcome} 
                onClose={() => setShowWelcome(false)} 
                generatedPassword={generatedPassword} 
            />
            {renderContent()}
        </ClientLayout>
    );
};

export default ClientPanel;
