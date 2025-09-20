import axios from "axios";
import { Loan } from "../../@types/customer";

export const fetchUserLoans = async (apiUrl: string, user: any) => {
    if (!user || !user.userId) {
      console.warn('Usuário não definido. Abortando fetch.');
      return [];
    }
  
    try {
      const response = await axios.get(`${apiUrl}/ibuildLoan`);
      const allLoans: Loan[] = response.data;
  
      // Filtra os empréstimos do usuário logado
      const userLoans = allLoans.filter((loan: Loan) => loan.customerId === user.userId);
  
      // Ordena do mais recente para o mais antigo
      return userLoans.sort(
        (a: Loan, b: Loan) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Erro ao buscar empréstimos do usuário:', error);
      return [];
    }
  };
  