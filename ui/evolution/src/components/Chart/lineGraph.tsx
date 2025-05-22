import React from 'react';
import { Line } from 'react-chartjs-2';

interface LineGraphProps {
    lineChartData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            fill: boolean;
            backgroundColor: string;
            borderColor: string;
            tension: number;
            pointBackgroundColor: string[]; // Alterado para um array de cores
        }[];
    };
    lineChartOptions: any;
}

const LineGraph: React.FC<LineGraphProps> = ({ lineChartData, lineChartOptions }) => {
    return (
        <div className="mt-10">
            <Line data={lineChartData} options={lineChartOptions} />
        </div>
    );
};

export { LineGraph };
