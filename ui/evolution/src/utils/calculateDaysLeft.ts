// Função para calcular os dias restantes
const calculateDaysLeft = (startDate:Date | string | null, totalDays: number) => {
    if (!startDate) return totalDays; // Se ainda não ativou, retorna total

    const currentDate = new Date();
    const loanStartDate = new Date(startDate);

    const endDate = new Date(loanStartDate);
    endDate.setDate(endDate.getDate() + totalDays);

    const differenceInTime = endDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 0;
};

export { calculateDaysLeft }
