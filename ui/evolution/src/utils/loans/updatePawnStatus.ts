import axios from 'axios';

export const updatePawnStatus = async (
  loanId: string,
  newStatus: string,
  apiUrl: string,
  fetchLoans: () => void,
  setAlertText: any,
  setIsModalSuccessOpen: any,
  setIsModalOpen: any
) => {
  try {
    const response = await axios.put(`${apiUrl}/ibuildLoan/pawn/${loanId}`, {
      pawn: newStatus,
    });

    if (response.status === 200) {
      setAlertText('Estado do penhor atualizado com sucesso!');
      setIsModalSuccessOpen(true);
    }

    fetchLoans();
  } catch (error) {
    console.error("Erro ao atualizar o estado do penhor", error);
    setAlertText('Erro ao atualizar o estado do penhor.');
    setIsModalOpen(true);
  }
};
