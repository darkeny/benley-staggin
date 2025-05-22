import React from 'react';
import { FaChessBishop, FaUsers, FaEnvelope } from 'react-icons/fa'; // Importando ícones do react-icons
import { GiTakeMyMoney } from "react-icons/gi";

interface BigNumberProps {
    title: string;
    subtitles: string;
    value: number;
    icon: React.ReactNode;
}

const BigNumber: React.FC<BigNumberProps> = ({ title, subtitles, value, icon }) => {
    return (
        <div className="flex flex-col justify-between w-1/4 hover:shadow-2xl p-9 bg-white transition duration-1000 ease-in-out rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2">
                {icon}
                <p className="text-lg leading-8 text-gray-600">{title}</p>
            </div>
            <p className="text-2xl font-extrabold">{value} <span className='text-sm leading-8 text-gray-500'>{subtitles}</span></p>
        </div>
    );
};

export { BigNumber };
