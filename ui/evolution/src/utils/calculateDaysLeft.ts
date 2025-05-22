// Função para calcular os dias restantes
const calculateDaysLeft = (createdAt: string, totalDays: number) => {
    const currentDate = new Date();
    const loanCreatedAt = new Date(createdAt);

    // Calcula a data de vencimento do empréstimo
    const endDate = new Date(loanCreatedAt);
    endDate.setDate(endDate.getDate() + totalDays);

    // Calcula a diferença em milissegundos e converte para dias
    const differenceInTime = endDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 0;  // Retorna 0 se o prazo já tiver passado
};

export { calculateDaysLeft }