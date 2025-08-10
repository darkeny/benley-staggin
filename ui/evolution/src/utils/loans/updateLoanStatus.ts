import axios from 'axios';

export const updateLoanStatus = async (
  loanId: string,
  newStatus: string,
  customer: { email: string; fullName: string },
  apiUrl: string,
  fetchLoans: () => void,
  setAlertText: any,
  setIsModalSuccessOpen: any,
  setIsModalOpen: any
) => {
  try {
    if (!customer || !customer.email || !customer.fullName) {
      setAlertText('Dados do cliente estão incompletos. Não foi possível atualizar o status.');
      setIsModalOpen(true);
      return;
    }

    const response = await axios.put(`${apiUrl}/ibuildLoan/${loanId}`, {
      status: newStatus,
    });

    if (response.status === 200) {
      setAlertText('Estado atualizado com sucesso!');
      setIsModalSuccessOpen(true);

      switch (newStatus) {
        case 'REFUSED':
          await axios.post(`${apiUrl}/sendLoansMailRefused`, customer);
          break;
        case 'PAID':
          await axios.post(`${apiUrl}/sendLoansMailPayd`, customer);
          break;
        case 'ACTIVE':
          await axios.post(`${apiUrl}/sendLoansMailAprove`, customer);
          break;
      }

      fetchLoans();
    }
  } catch (error) {
    console.error('Erro ao atualizar o status do empréstimo:', error);
    setAlertText('Erro ao atualizar o status do empréstimo.');
    setIsModalOpen(true);
  }
};
