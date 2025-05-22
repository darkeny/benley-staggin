import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChessBishop, FaUsers } from 'react-icons/fa';
import { GiTakeMyMoney } from "react-icons/gi";
import { HiPencilSquare } from "react-icons/hi2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { BigNumber } from './bigNumber';
import { BarGraph } from './barGraph';
import { LineGraph } from './lineGraph';
import { useFetchUserData } from '../../utils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Chart: React.FC = () => {

    const [clients, setClients] = useState(0);
    const [loans, setLoans] = useState(0);
    const [pawn, setPawn] = useState(0);
    const [newsletter, setNewsletter] = useState(0);
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();
    const { user, loan, loading, error } = useFetchUserData();

    // Verificar se o usuário tem permissão para acessar a página
    useEffect(() => {
        if (user.role && user.role !== 'ADMIN') {
            navigate('/signin'); // Redirecionar para a página de login (ou qualquer outra) se o papel não for 'USER'
        }
    }, [user.role, navigate]);

    useEffect(() => {
        // Funções assíncronas separadas para cada requisição
        const fetchClients = async () => {
            try {
                const response = await fetch(`${apiUrl}/ibuildCustomer`);
                const result = await response.json();
                setClients(result.length);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        const fetchLoans = async () => {
            try {
                const response = await fetch(`${apiUrl}/ibuildLoan`);
                const result = await response.json();
                setLoans(result.length);
            } catch (error) {
                console.error('Erro ao buscar empréstimos:', error);
            }
        };

        const fetchPawn = async () => {
            try {
                const response = await fetch(`${apiUrl}/ibuildLoan`);
                const result = await response.json();
                const loansWithPawn = result.filter((loan: any) => loan.pawn === 'YES');
                setPawn(loansWithPawn.length);
            } catch (error) {
                console.error('Erro ao buscar empréstimos penhorados:', error);
            }
        };

        const fetchNewsletter = async () => {
            try {
                const response = await fetch(`${apiUrl}/newsletter`);
                const result = await response.json();
                setNewsletter(result.length);
            } catch (error) {
                console.error('Erro ao buscar newsletter:', error);
            }
        };

        // Chama as funções
        fetchClients();
        fetchLoans();
        fetchPawn();
        fetchNewsletter();
    }, [apiUrl]);

    // Dados para os gráficos
    const chartData = {
        labels: ['Clientes', 'Empréstimos', 'Penhorados', 'Newsletter'],
        datasets: [
            {
                label: 'Quantidade',
                data: [clients, loans, pawn, newsletter],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 80, 71, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const lineChartData = {
        labels: ['Clientes', 'Empréstimos', 'Penhorados', 'Newsletter'],
        datasets: [
            {
                label: 'Quantidade ao longo do tempo',
                data: [clients, loans, pawn, newsletter],
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
                pointBackgroundColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Estatísticas Gerais' },
        },
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Tendência de Estatísticas ao Longo do Tempo' },
        },
    };

    return (
        <>
            <div className='mx-44'>
                <div className="flex max-w-screen-2xl justify-between gap-6 py-10 mx-auto">
                    <BigNumber title="Total de Clientes" subtitles='Clientes' value={clients || 0} icon={<FaUsers className="text-blue-500" size={32} />} />
                    <BigNumber title="Total de Empréstimos" subtitles='Empréstimos' value={loans || 0} icon={<GiTakeMyMoney className="text-blue-500" size={35} />} />
                    <BigNumber title="Clientes Penhorados" subtitles='Penhorados' value={pawn} icon={<FaChessBishop className="text-blue-500" size={32} />} />
                    <BigNumber title="Newsletter" subtitles='Interessados' value={newsletter} icon={<HiPencilSquare className="text-blue-500" size={32} />} />
                </div>

                <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
                    <BarGraph chartData={chartData} chartOptions={chartOptions} />
                    <LineGraph lineChartData={lineChartData} lineChartOptions={lineChartOptions} />
                </div>
            </div>
        </>
    );
};

export { Chart };
