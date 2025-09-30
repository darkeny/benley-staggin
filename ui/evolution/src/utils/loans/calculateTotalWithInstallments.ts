export const calculateTotalWithInstallments = (amount: number, installments: number): number => {
  if (!amount || installments === 0) return 0;

  // Aplica 30% do primeiro mês
  let saldo = parseFloat((amount * 1.3).toFixed(2));
  let totalPago = 0;

  for (let i = 1; i <= installments; i++) {
    if (i < installments) {
      // parcela base dividida pelo número de parcelas restantes
      const parcelaBase = parseFloat((saldo / (installments - (i - 1))).toFixed(2));
      totalPago = parseFloat((totalPago + parcelaBase).toFixed(2));
      // aplica 30% sobre o saldo restante após pagamento da parcela
      saldo = parseFloat(((saldo - parcelaBase) * 1.3).toFixed(2));
    } else {
      // última parcela quita o saldo restante
      totalPago = parseFloat((totalPago + saldo).toFixed(2));
    }
  }

  return totalPago;
};
