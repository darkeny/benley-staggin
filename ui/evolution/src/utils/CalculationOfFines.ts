export const CalculationOfFines = (
    createdAt: Date | null,
    loanDuration: number,
    balanceDue: number,
    status: string
): { daysDelayed: number; fineAmount: number } => {

    // Se o empréstimo não estiver ativo, não calcula nada
    if (status !== "ACTIVE" || !createdAt) {
        return { daysDelayed: 0, fineAmount: 0 };
    }

    const currentDate = new Date();
    const loanStartDate = new Date(createdAt);

    // Data de vencimento
    const dueDate = new Date(loanStartDate);
    dueDate.setDate(dueDate.getDate() + loanDuration);

    // Calcula dias de atraso
    const delayInMs = currentDate.getTime() - dueDate.getTime();
    const delayInDays = Math.ceil(delayInMs / (1000 * 60 * 60 * 24));

    let fine = 0;

    if (delayInDays > 0 && delayInDays <= 5) {
        fine = 0.10 * balanceDue;
    } else if (delayInDays > 5) {
        fine = 0.30 * balanceDue;
    }

    return {
        daysDelayed: delayInDays > 0 ? delayInDays : 0,
        fineAmount: fine,
    };
};
