export interface Installment {
  paymentDate: string | number | Date;
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  fine?: number; // multa da parcela
  paid: boolean;
}

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'REFUSED' | 'PAID';

export interface Loan {
  [x: string]: any;
  id: string;
  loanAmount: number;
  balanceDue: number;
  paymentTerm: number;
  paymentMethod: string;
  accountNumber: string;
  collateral: string;
  pawn: string;
  installments: Installment[]; // agora é um array de parcelas
  status: LoanStatus; 
  activatedAt: Date;
  customerId: string;
  customer: {
    fullName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: string;
}
