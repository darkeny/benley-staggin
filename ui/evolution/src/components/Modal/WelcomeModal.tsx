import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCopy, FiInfo } from 'react-icons/fi';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    generatedPassword: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, generatedPassword }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApplyLoan = () => {
        onClose();
        navigate('/loan');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5" /> Registo Concluído
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors p-1"
                    >
                        <span className="sr-only">Fechar</span>
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6 text-sm text-center">
                        Bem-vindo à Benley. A sua conta foi ativada.
                        Utilize a palavra-passe abaixo para acessos futuros.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center mb-6 relative">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">A Sua Palavra-passe</span>
                        <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider break-all text-center">
                            {generatedPassword}
                        </div>
                        
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Copiar Senha"
                        >
                            <FiCopy className="w-4 h-4" />
                            {copied && <span className="text-xs text-blue-600 font-medium">Copiado!</span>}
                        </button>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg mb-6 leading-relaxed">
                        <FiInfo className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>Fizemos o envio de uma cópia para o seu e-mail por precaução.</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleApplyLoan}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Solicitar Meu Primeiro Empréstimo
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-xl transition-all"
                        >
                            Explorar o meu painel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
