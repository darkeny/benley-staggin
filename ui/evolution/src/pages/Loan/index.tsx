import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../../components/Navbar";
import { Alert } from "../../components/Modal/alert";
import { SuccessAlert } from "../../components/Modal/successAlert";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useFetchUserData } from "../../utils";
import { useNavigate } from "react-router-dom";
import { calculateTotalWithInstallments } from "../../utils/loans/calculateTotalWithInstallments";
import {
  handleInputChange,
  handleFileChange,
  handleFileButtonClick,
  handleSubmit,
  handleCloseModal,
  FormDataType,
} from "../../utils/loanUtils";

interface LoanProps {
  simulador?: boolean;
}

const Loan: React.FC<LoanProps> = ({ simulador = false }) => {
  const navigate = useNavigate();
  const { user } = useFetchUserData(simulador);

  // se for simulador não precisa de login
  const userId = simulador ? "" : user?.userId;
  const role = simulador ? "guest" : user?.role;

  const [formData, setFormData] = useState<FormDataType>({
    loanAmount: "",
    paymentTerm: 0,
    paymentMethod: "",
    accountNumber: "",
    collateral: "",
    installments: 0,
    isPartialPayment: true,
    customerId: "",
  });

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        customerId: userId,
      }));
    }
  }, [userId]);

  const [alertText, setAlertText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loanAmountValue = parseFloat(formData.loanAmount);

  // cálculo dos encargos
  const encargos =
    formData.installments > 0
      ? calculateTotalWithInstallments(loanAmountValue, formData.installments)
      : loanAmountValue > 0
        ? loanAmountValue * 1.3
        : 0;

  // atualizar prazo automaticamente
  useEffect(() => {
    if (formData.installments > 0 || loanAmountValue > 0) {
      const prazo =
        formData.installments === 2
          ? 60
          : formData.installments === 3
            ? 90
            : loanAmountValue > 0
              ? 30
              : 0;

      setFormData((prev) => ({
        ...prev,
        paymentTerm: prazo,
      }));
    }
  }, [formData.installments, loanAmountValue]);

  const shouldShowInstallmentsField =
    loanAmountValue >= 10000 && !formData.isPartialPayment;
  const shouldShowCheckbox = loanAmountValue >= 10000;
  const shouldShowAccountNumberField = formData.paymentMethod !== "";

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = [
      { field: "loanAmount", message: "Valor do Empréstimo é obrigatório." },
      { field: "paymentMethod", message: "Forma de Pagamento é obrigatória." },
      {
        field: "accountNumber",
        message: "Número da Conta é obrigatório.",
        condition: shouldShowAccountNumberField,
      },
      { field: "collateral", message: "Garantia é obrigatória." },
    ];

    // validação dos campos obrigatórios
    for (const { field, message, condition = true } of requiredFields) {
      // @ts-ignore
      if (condition && (!formData[field] || (field === "loanAmount" && parseFloat(formData.loanAmount) <= 0))) {
        setAlertText(message);
        setIsModalOpen(true);
        setLoading(false);
        return;
      }
    }

    // validação obrigatória das imagens da garantia
    if (files.length === 0) {
      setAlertText("Anexe pelo menos uma imagem da garantia.");
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    if (simulador) {
      setAlertText("Simulação concluída com sucesso!");
      setIsModalSuccessOpen(true);
      setLoading(false);
      return;
    }

    // envio real
    handleSubmit(
      e,
      formData,
      setAlertText,
      setIsModalOpen,
      setIsModalSuccessOpen,
      setLoading,
      setFormData,
      navigate,
      files,
      role
    );
  };

  // cálculo do valor por parcela
  const valorParcela =
    formData.installments > 0 ? encargos / formData.installments : 0;
  return (
    <>
      <Navbar />

      {/* aviso modo simulador */}
      {simulador && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center font-medium">
          ⚡ Você está no <b>Modo Simulador</b>. Nenhum dado será enviado.
        </div>
      )}

      <div
        data-aos="zoom-in"
        className="flex justify-center items-center py-6"
      >
        <div className="bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-lg shadow-xl w-full max-w-screen-xl p-8 mx-4 relative overflow-hidden">
          <h2 className="lg:text-3xl text-xl font-extrabold text-center text-gray-800 mb-6">
            {simulador ? "Simulador de Crédito" : "Solicitação de crédito"}
          </h2>

          <form onSubmit={handleLoanSubmit} className="space-y-6">
            <div>
              <h3 className="lg:text-xl text-md font-bold text-gray-700 mb-4">
                Informação do Empréstimo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* valor do empréstimo */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Valor do Empréstimo
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={(e) =>
                      handleInputChange(e, setFormData, () => { })
                    }
                    placeholder="Insira o valor do empréstimo"
                    className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* encargos e prazo */}
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Encargos a liquidar (MZN)
                    </label>
                    <input
                      type="number"
                      value={isNaN(encargos) ? 0 : encargos}
                      readOnly
                      disabled
                      className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Prazo de Pagamento (dias)
                    </label>
                    <input
                      type="number"
                      value={formData.paymentTerm}
                      readOnly
                      disabled
                      className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* forma de pagamento */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Forma de Pagamento
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange(e, setFormData, () => { })}
                    className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                  >
                    <option value="" disabled>
                      Selecione o banco
                    </option>
                    <option value="Absa Bank">Absa Bank Moçambique</option>
                    <option value="Millenium Bim">Millenium Bim</option>
                    <option value="M-pesa">M-Pesa</option>
                    <option value="E-mola">E-Mola</option>
                  </select>
                </div>

                {/* número da conta + parcela mensal */}
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  {shouldShowAccountNumberField && (
                    <div className="flex-1 relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Número da Conta
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) =>
                          handleInputChange(e, setFormData, () => { })
                        }
                        placeholder="Insira o número da conta"
                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                      />
                    </div>
                  )}

                  {formData.installments > 0 && (
                    <div className="flex-2 relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Parcela Mensal (MZN)
                      </label>
                      <input
                        type="number"
                        value={valorParcela.toFixed(2)}
                        readOnly
                        disabled
                        className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* garantia */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Garantia
                  </label>
                  <input
                    type="text"
                    name="collateral"
                    value={formData.collateral}
                    onChange={(e) =>
                      handleInputChange(e, setFormData, () => { })
                    }
                    placeholder="Insira a garantia"
                    className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>

                {/* checkbox e parcelas */}
                <div className="flex flex-col gap-6 md:flex-row lg:pt-7 md:items-start">
                  {shouldShowCheckbox && (
                    <div className="relative flex items-center gap-2 md:w-1/2">
                      <input
                        type="checkbox"
                        name="isPartialPayment"
                        checked={formData.isPartialPayment}
                        onChange={(e) =>
                          handleInputChange(e, setFormData, () => { })
                        }
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                        id="isPartialPayment"
                      />
                      <label
                        htmlFor="isPartialPayment"
                        className="text-sm font-medium text-gray-700"
                      >
                        Efectuar Pagamento Integral
                      </label>
                    </div>
                  )}


                  {shouldShowInstallmentsField && (
                    <div className="flex flex-col md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Parcelas
                      </label>
                      <div className="flex gap-4">
                        {[2, 3].map((n) => (
                          <div key={n} className="flex items-center gap-2">
                            <input
                              id={`installment-${n}`}
                              type="radio"
                              name="installments"
                              value={n}
                              checked={formData.installments === n}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  installments: Number(e.target.value),
                                }))
                              }
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`installment-${n}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              {n} parcelas
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* upload garantia */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Imagens da Garantia
                  </label>
                  <button
                    type="button"
                    onClick={() => handleFileButtonClick(fileInputRef)}
                    className="mt-2 block w-full p-3 rounded-lg border border-slate-400 text-slate-600 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                  >
                    {files.length > 0
                      ? "Imagens Carregadas"
                      : "Carregar Imagens"}
                    {files.length > 0 && (
                      <IoCheckmarkDoneOutline className="h-6 w-6 inline ml-2 text-green-500" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, setFiles)}
                    className="hidden"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg transition-all ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading
                    ? "Enviando..."
                    : simulador
                      ? "Simular Solicitação"
                      : "Enviar Solicitação"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <Alert
          isOpen={isModalOpen}
          text={alertText}
          onClose={() =>
            handleCloseModal(setIsModalOpen, setIsModalSuccessOpen)
          }
        />
      )}

      {isModalSuccessOpen && (
        <SuccessAlert
          isOpen={isModalSuccessOpen}
          text={alertText}
          onClose={() =>
            handleCloseModal(setIsModalOpen, setIsModalSuccessOpen)
          }
        />
      )}
    </>
  );
};

export default Loan;
