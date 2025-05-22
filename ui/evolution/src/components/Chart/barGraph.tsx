import React from 'react';
import { Bar } from 'react-chartjs-2';

interface BarGraphProps {
    chartData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    };
    chartOptions: any;
}

const BarGraph: React.FC<BarGraphProps> = ({ chartData, chartOptions }) => {
    return (
        <div className="w-full mt-10">
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export { BarGraph };
