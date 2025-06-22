import { ChangeEvent, FormEvent, RefObject } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export interface FormDataType {
  loanAmount: string;
  paymentTerm: number;
  paymentMethod: string;
  accountNumber: string;
  collateral: string;
  installments: number;
  isPartialPayment: boolean;
  customerId: string;
}

export type SetFormData = React.Dispatch<React.SetStateAction<FormDataType>>;
export type SetError = React.Dispatch<React.SetStateAction<string>>;
export type SetAlertText = React.Dispatch<React.SetStateAction<string>>;
export type SetIsModalOpen = React.Dispatch<React.SetStateAction<boolean>>;
export type SetIsModalSuccessOpen = React.Dispatch<React.SetStateAction<boolean>>;
export type SetLoading = React.Dispatch<React.SetStateAction<boolean>>;
export type SetFiles = React.Dispatch<React.SetStateAction<File[]>>;

/**
 * Lida com alterações nos campos do formulário
 */
export const handleInputChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  setFormData: SetFormData,
  setError: SetError
) => {
  const { name, value, type, checked } = e.target as HTMLInputElement;

  if (type === "checkbox") {
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
      installments: checked ? 0 : prevState.installments,
    }));
  } else {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  setError("");
};

/**
 * Lida com o carregamento de arquivos
 */
export const handleFileChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFiles: SetFiles
) => {
  const filesList = e.target.files;
  if (filesList) {
    setFiles(Array.from(filesList));
  }
};

/**
 * Simula clique no input de arquivos oculto
 */
export const handleFileButtonClick = (
  fileInputRef: RefObject<HTMLInputElement>
) => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

/**
 * Submete os dados do formulário para o servidor, incluindo anexos
 */
export const handleSubmit = async (
  e: FormEvent,
  formData: FormDataType,
  setAlertText: SetAlertText,
  setIsModalOpen: SetIsModalOpen,
  setIsModalSuccessOpen: SetIsModalSuccessOpen,
  setLoading: SetLoading,
  setFormData: SetFormData,
  navigate: (path: string) => void,
  files: File[],
  role: string
) => {
  e.preventDefault();

  // Verificação básica
  if (
    !formData.loanAmount ||
    !formData.paymentMethod ||
    !formData.collateral ||
    !formData.accountNumber ||
    !formData.customerId ||
    files.length === 0
  ) {
    setAlertText("Todos os campos são obrigatórios.");
    setIsModalOpen(true);
    return;
  }

  // Verificação de perfil
  if (role === "ADMIN") {
    setAlertText("Administradores não têm permissão para solicitar crédito!");
    setIsModalOpen(true);
    return;
  }

  const loanAmountValue = parseFloat(formData.loanAmount);
  if (isNaN(loanAmountValue) || loanAmountValue < 1000) {
    setAlertText("O valor mínimo para solicitar o empréstimo é de 1000 MT.");
    setIsModalOpen(true);
    return;
  }

  // Atualiza campo de pagamento parcial automaticamente
  if (loanAmountValue < 10000) {
    formData.isPartialPayment = true;
  }

  setLoading(true);

  try {
    // Criação do objeto FormData
    const data = new FormData();
    data.append("loanAmount", formData.loanAmount);
    data.append("paymentTerm", formData.paymentTerm.toString());
    data.append("paymentMethod", formData.paymentMethod);
    data.append("accountNumber", formData.accountNumber);
    data.append("collateral", formData.collateral);
    data.append("installments", formData.installments.toString());
    data.append("isPartialPayment", formData.isPartialPayment.toString());
    data.append("customerId", formData.customerId);

    files.forEach((file) => {
      data.append("attachments", file);
    });

    const response = await axios.post(`${apiUrl}/ibuildLoan`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      setAlertText("Empréstimo criado com sucesso");
      setIsModalSuccessOpen(true);

      setTimeout(() => {
        navigate("/mypanel");
      }, 3000);

      setFormData({
        loanAmount: "",
        paymentTerm: 0,
        paymentMethod: "",
        accountNumber: "",
        collateral: "",
        installments: 0,
        isPartialPayment: true,
        customerId: "", // ou manter se quiser reusar
      });
    }
  } catch (error: any) {
    console.error("Erro ao enviar solicitação:", error);
    const errorMessage =
      error?.response?.data?.message || "Erro ao enviar a solicitação.";
    setAlertText(errorMessage);
    setIsModalOpen(true);
  } finally {
    setLoading(false);
  }
};

/**
 * Fecha os modais
 */
export const handleCloseModal = (
  setIsModalOpen: SetIsModalOpen,
  setIsModalSuccessOpen: SetIsModalSuccessOpen
) => {
  setIsModalOpen(false);
  setIsModalSuccessOpen(false);
};
