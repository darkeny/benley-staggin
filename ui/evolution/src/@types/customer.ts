export interface Installment {
  paymentDate: string | number | Date;
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: Date;
  amount: number;
  amountPaid: number;
  fine?: number; // multa da parcela
  paid: boolean;
}

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'REFUSED' | 'PAID';

export interface AdvancePayment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

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
  installments: Installment[];
  installmentsList: Installment[];
  advancePayments?: AdvancePayment[];
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
