// Função para calcular quantos dias faltam até terminar o empréstimo
export const calculateDaysLeft = (
    startDate: Date | string | null,
    totalDays: number
  ): number => {
    if (!startDate) return totalDays; // Se ainda não ativou, retorna o total
  
    const currentDate = new Date();
    const loanStartDate = new Date(startDate);
  
    // data final = início + totalDays
    const endDate = new Date(loanStartDate);
    endDate.setDate(endDate.getDate() + totalDays);
  
    const differenceInTime = endDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
    return differenceInDays >= 0 ? differenceInDays : 0;
  };
  