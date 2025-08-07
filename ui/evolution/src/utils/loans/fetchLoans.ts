import axios from 'axios';

export const fetchLoans = async (apiUrl: string, user: any, setLoans: any) => {
  if (!user || !user.role || !user.userId) {
    console.warn('Usuário não definido. Abortando fetch.');
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}/ibuildLoan`);
    const allLoans: Loan[] = response.data;

    const filteredLoans = user.role === 'USER'
      ? allLoans.filter((loan: Loan) => loan.customerId === user.userId)
      : allLoans;

    const sortedLoans = filteredLoans.sort(
      (a: Loan, b: Loan) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setLoans(sortedLoans);
  } catch (error) {
    console.error('Error fetching loans:', error);
  }
};
