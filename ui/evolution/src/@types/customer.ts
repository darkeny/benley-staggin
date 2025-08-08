export interface Customer {
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

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'REFUSED' | 'PAID';

export interface Loan {
  id: string;
  loanAmount: number;
  balanceDue: number;
  paymentTerm: number;
  paymentMethod: string;
  accountNumber: string;
  collateral: string;
  pawn: string;
  installments: number;
  status: LoanStatus; // <- agora é um status legível
  customerId: string;
  customer: {
    fullName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: string;
}
