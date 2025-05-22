import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    daysLeft: number;
    totalDays: number;
}

// Função para gerar cores gradientes com base nos dias restantes
const getGradientColor = (daysLeft: number) => {
    const percentage = daysLeft / 30; // Considera 30 como o máximo de dias
    const r = Math.floor(255 - (percentage * 255)); // Vai de verde para vermelho
    const g = Math.floor(percentage * 255);         // Verde ao começar e diminuindo até vermelho
    const b = 50;                                   // Mantemos um azul fixo para dar mais profundidade

    return `rgb(${r}, ${g}, ${b})`;
};

const PieChart: React.FC<PieChartProps> = ({ daysLeft, totalDays }) => {
    const backgroundColor = getGradientColor(daysLeft);
    
    const data = {
        datasets: [
            {
                data: [daysLeft, totalDays - daysLeft],
                backgroundColor: [backgroundColor, '#e0e0e0'], // Gradiente para tempo restante e cinza para o restante
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-40 h-40 relative">
            <Doughnut data={data} options={{ cutout: '75%' }} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">
                    {daysLeft} dias
                </span>
            </div>
        </div>
    );
};

export { PieChart };
