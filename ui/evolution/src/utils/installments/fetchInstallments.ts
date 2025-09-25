import { Installment } from "../../@types/customer";

const apiUrl = import.meta.env.VITE_APP_API_URL;

// Tipo para os handlers
interface InstallmentHandlers {
  setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
  setSelectedLoanId?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsInstallmentsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertText: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalSuccessOpen?: React.Dispatch<React.SetStateAction<boolean>>; // ✅ adicionado
}

// Buscar parcelas
export const fetchInstallments = async (loanId: string, handlers: InstallmentHandlers) => {
  const { setInstallments, setSelectedLoanId, setIsInstallmentsModalOpen, setAlertText, setIsModalOpen } = handlers;

  try {
    const res = await fetch(`${apiUrl}/installments/getAll/${loanId}`);
    const data = await res.json();

    if (res.ok) {
      setInstallments(data.payload.map((inst: Installment) => ({
        ...inst,
        dueDate: new Date(inst.dueDate),
      })));
      setSelectedLoanId && setSelectedLoanId(loanId);
      setIsInstallmentsModalOpen && setIsInstallmentsModalOpen(true);
    } else {
      setAlertText(data.error || 'Erro ao buscar parcelas');
      setIsModalOpen(true);
    }
  } catch (err) {
    console.error(err);
    setAlertText('Erro ao buscar parcelas');
    setIsModalOpen(true);
  }
};

// Marcar parcela como paga
export const markInstallmentAsPaid = async (
  installmentId: string,
  installments: Installment[],
  handlers: InstallmentHandlers
) => {
  const { setInstallments, setAlertText, setIsModalSuccessOpen, setIsModalOpen } = handlers;

  try {
    const res = await fetch(`${apiUrl}/installments/update/${installmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: true }),
    });
    const data = await res.json();

    if (res.ok) {
      setInstallments(prev =>
        prev.map(inst => (inst.id === installmentId ? data.payload : inst))
      );
      setAlertText('Parcela marcada como paga!');
      setIsModalSuccessOpen && setIsModalSuccessOpen(true);
    } else {
      setAlertText(data.error || 'Erro ao atualizar parcela');
      setIsModalOpen(true);
    }
  } catch (err) {
    console.error(err);
    setAlertText('Erro ao atualizar parcela');
    setIsModalOpen(true);
  }
};
