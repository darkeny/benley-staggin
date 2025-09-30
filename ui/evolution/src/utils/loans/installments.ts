// Função para gerar as parcelas de um empréstimo
export const generateInstallments = (
    loanAmount: number,
    installments: number,
    startDate: Date
  ) => {
    const installmentAmount = loanAmount / installments;
    const result = [];
  
    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
  
      result.push({
        installmentNumber: i + 1,
        dueDate,
        amount: installmentAmount,
        paid: false,
      });
    }
  
    return result;
  };
  