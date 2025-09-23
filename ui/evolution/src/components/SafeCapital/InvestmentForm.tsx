import React, { useState } from 'react';

const InvestmentForm: React.FC = () => {
    const [plan, setPlan] = useState('');
    const [investmentValue, setInvestmentValue] = useState('');
    const [error, setError] = useState('');
    const [finalAmount, setFinalAmount] = useState<number | null>(null);
    const [monthlyInterest, setMonthlyInterest] = useState<number | null>(null);

    const getPlanDuration = (selectedPlan: string) => {
        switch (selectedPlan) {
            case 'Standard':
                return 3;
            case 'Essential':
                return 6;
            case 'Premium':
                return 12;
            default:
                return 0;
        }
    };

    const getPlanValueRange = (selectedPlan: string) => {
        switch (selectedPlan) {
            case 'Standard':
                return { min: 10000, max: 19999 };
            case 'Essential':
                return { min: 20000, max: 49999 };
            case 'Premium':
                return { min: 50000, max: 100000 };
            default:
                return { min: 0, max: 0 };
        }
    };

    const getProfitabilityRate = (selectedPlan: string) => {
        switch (selectedPlan) {
            case 'Standard':
                return 2; // 2% ao mês
            case 'Essential':
                return 3; // 3% ao mês
            case 'Premium':
                return 4; // 4% ao mês
            default:
                return 0;
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const { min, max } = getPlanValueRange(plan);
        const value = parseFloat(investmentValue);

        if (value < min || value > max) {
            setError(`O valor do investimento deve estar entre ${min} e ${max} meticais para o plano ${plan}.`);
            setFinalAmount(null);
            setMonthlyInterest(null);
        } else {
            setError('');
            const meses = getPlanDuration(plan);
            const taxa = getProfitabilityRate(plan);

            // Juros simples
            const jurosMensais = value * (taxa / 100);
            const acumulado = value + (jurosMensais * meses);

            setMonthlyInterest(jurosMensais);
            setFinalAmount(acumulado);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Simulador de Investimento</h2>

                <div className="mb-6">
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">Plano de Investimento</label>
                    <select
                        id="plan"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-2 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all duration-300 ease-in-out"
                        required
                    >
                        <option value="" disabled>Selecione um plano</option>
                        <option value="Standard">Standard</option>
                        <option value="Essential">Essential</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div>

                {plan && (
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">Rentabilidade: {getProfitabilityRate(plan)}% ao mês</p>
                        <p className="text-sm text-gray-600">Vigência do contracto: {getPlanDuration(plan)} meses</p>
                        <p className="text-sm text-gray-600">Valor do investimento: entre {getPlanValueRange(plan).min} e {getPlanValueRange(plan).max} meticais.</p>
                    </div>
                )}

                <div className="mb-6">
                    <label htmlFor="investmentValue" className="block text-sm font-medium text-gray-700 mb-2">Valor do Investimento Inicial</label>
                    <input
                        type="number"
                        id="investmentValue"
                        value={investmentValue}
                        onChange={(e) => setInvestmentValue(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-2 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm py-2 px-3 transition-all duration-300 ease-in-out"
                        placeholder="Digite o valor inicial"
                        required
                    />
                </div>

                {error && (
                    <p className="mb-6 text-red-600 text-sm">{error}</p>
                )}

                {finalAmount !== null && monthlyInterest !== null && !error && (
                    <div className="mb-6 bg-indigo-50 p-4 rounded-lg shadow-inner">
                        <p className="text-indigo-700 font-semibold">Resultado:</p>
                        <p className="text-gray-700 text-sm">
                            Juros recebidos por mês: <strong className="text-green-600">{monthlyInterest.toFixed(2)} Meticais</strong>
                        </p>
                        <p className="text-gray-700 text-sm">
                            Após <strong>{getPlanDuration(plan)} meses</strong>, você terá conquistado um total de::
                        </p>
                        <p className="text-green-600 font-bold text-lg pt-3">{finalAmount.toFixed(2)} Meticais</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out"
                >
                    Confirmar Investimento
                </button>
            </form>
        </div>
    );
};

export { InvestmentForm };
