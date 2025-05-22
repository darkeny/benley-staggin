const CalculationOfFines = (start: Date, end: Date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const startDate = start.getTime();  // Obter milissegundos do início
    const endDate = end.getTime();      // Obter milissegundos do fim
    const days = Math.ceil((endDate - startDate) / msPerDay);
    return days < 0 ? 0 : days;         // Retornar 0 se o valor for negativo
};

export { CalculationOfFines };
