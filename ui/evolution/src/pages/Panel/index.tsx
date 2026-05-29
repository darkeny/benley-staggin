import React, { useState } from 'react';
import { useAuth } from '../../auth';
import { Chart } from '../../components/Chart';
import Clients from '../../components/Clients';
import { Posts } from '../../components/posts';
import Loans from '../../components/Loans';
import MasterManagement from '../../components/MasterManagement';
import { AdminLayout } from '../../components/Layout/AdminLayout';

const Panel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'painel' | 'clients' | 'posts' | 'loans' | 'master'>('painel');
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'clients': return <Clients />;
            case 'posts': return <Posts />;
            case 'loans': return <Loans />;
            case 'master': return <MasterManagement />;
            default: return <Chart />;
        }
    };

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} title="Benley Plataforma de Administrador">
            {renderTabContent()}
        </AdminLayout>
    );
};

export default Panel;
