import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../../components/Navbar";
import { Alert } from "../../components/Modal/alert";
import { SuccessAlert } from "../../components/Modal/successAlert";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useFetchUserData } from "../../utils";
import { useNavigate } from "react-router-dom";
import {
  handleInputChange,
  handleFileChange,
  handleFileButtonClick,
  handleSubmit,
  handleCloseModal,
  FormDataType,
} from "../../utils/loanUtils";

const Loan: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useFetchUserData();
  const userId = user.userId;
  const role = user.role;

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

  // Corrigindo customerId dinamicamente após carregamento do usuário
  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        customerId: userId,
      }));
    }
  }, [userId]);

  const [error, setError] = useState("");
  const [alertText, setAlertText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loanAmountValue = parseFloat(formData.loanAmount);
    if (!isNaN(loanAmountValue)) {
      setFormData((prev) => ({
        ...prev,
        paymentTerm: loanAmountValue >= 1000 ? 30 : 0,
      }));
    }
  }, [formData.loanAmount]);

  const loanAmountValue = parseFloat(formData.loanAmount);
  const shouldShowInstallmentsField = loanAmountValue >= 10000 && !formData.isPartialPayment;
  const shouldShowCheckbox = loanAmountValue >= 10000;
  const shouldShowAccountNumberField = formData.paymentMethod !== "";

  return (
    <>
      <Navbar />
      <div className="hidden md:block absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.200),white)] opacity-20"></div>
      <div className="hidden md:block absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-left"></div>
      <div data-aos="zoom-in" className="flex justify-center items-center min-h-screen">
        <div className="bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-lg shadow-xl w-full max-w-screen-xl p-8 mx-4 relative overflow-hidden before:content-[''] before:absolute before:w-48 before:h-48 before:bg-gradient-to-r before:from-gray-400 before:to-blue-500 before:opacity-20 before:rounded-full before:top-0 before:left-0 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:w-64 after:h-64 after:bg-gradient-to-r after:from-yellow-400 after:to-red-500 after:opacity-20 after:rounded-full after:bottom-0 after:right-0 after:translate-x-1/2 after:translate-y-1/2">
          <h2 className="lg:text-3xl text-xl font-extrabold text-center text-gray-800 mb-6">
            Solicitação de crédito
          </h2>
          <form
            onSubmit={(e) =>
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
              )
            }
            className="space-y-6"
          >
            <div>
              <h3 className="lg:text-xl text-md font-bold text-gray-700 mb-4">
                Informação do Empréstimo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Valor do Empréstimo
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange(e, setFormData, setError)}
                    placeholder="Insira o valor do empréstimo"
                    className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Encargos a liquidar (MZN)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={
                        loanAmountValue < 5000
                          ? loanAmountValue * 1.5
                          : loanAmountValue * 1.3
                      }
                      readOnly
                      className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Prazo de Pagamento (dias)
                    </label>
                    <input
                      type="number"
                      name="paymentTerm"
                      value={formData.paymentTerm}
                      readOnly
                      className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Forma de Pagamento
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange(e, setFormData, setError)}
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

                {shouldShowAccountNumberField && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Número da Conta
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange(e, setFormData, setError)}
                      placeholder="Insira o número da conta"
                      className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                    />
                  </div>
                )}

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Garantia
                  </label>
                  <input
                    type="text"
                    name="collateral"
                    value={formData.collateral}
                    onChange={(e) => handleInputChange(e, setFormData, setError)}
                    placeholder="Insira a garantia"
                    className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-6 md:flex-row lg:pt-7 md:items-start">
                  {shouldShowCheckbox && (
                    <div className="relative flex items-center gap-2 md:w-1/2">
                      <input
                        type="checkbox"
                        name="isPartialPayment"
                        checked={formData.isPartialPayment}
                        onChange={(e) => handleInputChange(e, setFormData, setError)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                        id="isPartialPayment"
                      />
                      <label htmlFor="isPartialPayment" className="text-sm font-medium text-gray-700">
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
                            <label htmlFor={`installment-${n}`} className="text-sm font-medium text-gray-700">
                              {n} parcelas
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload imagens garantia */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Imagens da Garantia
                  </label>
                  <button
                    type="button"
                    onClick={() => handleFileButtonClick(fileInputRef)}
                    className="mt-2 block w-full p-3 rounded-lg border border-slate-400 text-slate-600 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-500"
                  >
                    {files.length > 0 ? "Imagens Carregadas" : "Carregar Imagens"}
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
                  className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg transition-all ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Enviando..." : "Enviar Solicitação"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <Alert isOpen={isModalOpen} text={alertText} onClose={() => handleCloseModal(setIsModalOpen, setIsModalSuccessOpen)} />
      )}

      {isModalSuccessOpen && (
        <SuccessAlert
          isOpen={isModalSuccessOpen}
          text={alertText}
          onClose={() => handleCloseModal(setIsModalOpen, setIsModalSuccessOpen)}
        />
      )}
    </>
  );
};

export default Loan;
