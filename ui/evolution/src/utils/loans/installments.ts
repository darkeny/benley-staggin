// Função para gerar as parcelas de um empréstimo
export const generateInstallments = (
  loanAmount: number,
  installments: number,
  startDate: Date
) => {
  const result = [];

  // Se não houver parcelamento ou for 1 parcela, cria uma única parcela
  if (!installments || installments <= 1) {
    result.push({
      installmentNumber: 1,
      dueDate: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 30)), // vencimento em 30 dias
      amount: loanAmount,
      paid: false,
      fineAmount: 0,
      daysDelayed: 0,
    });
    return result;
  }

  // Parcelamento normal
  const installmentAmount = loanAmount / installments;

  for (let i = 0; i < installments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);

    result.push({
      installmentNumber: i + 1,
      dueDate,
      amount: installmentAmount,
      paid: false,
      fineAmount: 0,
      daysDelayed: 0,
    });
  }

  return result;
};
