// utils/loan/installmentsFines.ts

export interface Installment {
  id?: string;
  installmentNumber?: number;
  dueDate: string | Date;
  amount: number;
  paid?: boolean;
  fineAmount?: number;
  daysDelayed?: number;
}

/**
 * Calcula a multa de uma parcela individual
 * - 10% se atraso de 1 a 5 dias
 * - 30% se atraso maior que 5 dias
 */
export const calculateInstallmentFine = (
  installment: Installment
): { fineAmount: number; daysDelayed: number } => {
  if (installment.paid) return { fineAmount: 0, daysDelayed: 0 };

  const today = new Date();
  const dueDate = new Date(installment.dueDate);

  if (isNaN(dueDate.getTime())) {
    console.warn("Data inválida na parcela:", installment);
    return { fineAmount: 0, daysDelayed: 0 };
  }

  // Calcula dias de atraso
  const delayInMs = today.getTime() - dueDate.getTime();
  const delayInDays = Math.max(Math.ceil(delayInMs / (1000 * 60 * 60 * 24)), 0);

  // Calcula a multa
  let fine = 0;
  if (delayInDays > 0 && delayInDays <= 5) fine = parseFloat((installment.amount * 0.1).toFixed(2));
  else if (delayInDays > 5) fine = parseFloat((installment.amount * 0.3).toFixed(2));

  return {
    fineAmount: fine,
    daysDelayed: delayInDays,
  };
};

/**
 * Calcula a multa total de todas as parcelas
 * Caso não existam parcelas, considera "parcela única" usando o valor total e a data de ativação do empréstimo
 */
export const calculateTotalFines = (
  installments: Installment[] = [],
  fallbackAmount?: number,
  fallbackDueDate?: Date | string
) => {
  let totalFine = 0;
  let totalDaysDelayed = 0;

  // Se não houver parcelas, cria uma "parcela única"
  const effectiveInstallments =
    installments.length > 0
      ? installments
      : fallbackAmount && fallbackDueDate
      ? [{ amount: fallbackAmount, dueDate: fallbackDueDate, paid: false }]
      : [];

  const updatedInstallments = effectiveInstallments.map(inst => {
    const { fineAmount, daysDelayed } = calculateInstallmentFine(inst);
    inst.fineAmount = fineAmount;
    inst.daysDelayed = daysDelayed;

    totalFine += fineAmount;
    totalDaysDelayed += daysDelayed;

    return inst;
  });

  return {
    totalFine: parseFloat(totalFine.toFixed(2)),
    totalDaysDelayed,
    installments: updatedInstallments,
  };
};
