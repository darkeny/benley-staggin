interface Customer {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  email: string;
  contact: string;
  gender: string;
  address: string;
  incomeSource: string;
  monthlyIncome: number;
  identityNumber: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Loan {
  balanceDue: any;
  id: string;
  loanAmount: number;
  paymentTerm: number; // em meses
  paymentMethod: string;
  accountNumber: string;
  collateral: string;
  pawn: string
  installments: number ;
  isActive: boolean; // para indicar se o empréstimo está ativo
  customerId: string; // ID do cliente associado
  customer: Customer; // dados do cliente
  createdAt: Date;
  updatedAt: Date;
}
