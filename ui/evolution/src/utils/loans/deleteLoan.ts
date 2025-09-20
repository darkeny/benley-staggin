import axios from 'axios';
import { Loan } from '../../@types/customer';

export const deleteLoan = async (
  id: string,
  loanStatus: string,
  apiUrl: string,
  loans: Loan[],
  setLoans: any,
  setAlertText: any,
  setIsModalOpen: any
) => {
  if (loanStatus === 'ACTIVE') {
    setAlertText('Empréstimo ativo não pode ser excluído.');
    setIsModalOpen(true);
    return;
  }

  try {
    await axios.delete(`${apiUrl}/ibuildLoan/${id}`);
    setLoans(loans.filter(loan => loan.id !== id));
  } catch (error) {
    console.error('Error deleting loan:', error);
  }
};
