export enum TransactionType {
  REWARD = 'REWARD',
  EXPENSE = 'EXPENSE',
}

export class Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date;
  taskId?: string;
}

export class Budget {
  total: number;
  transactions: Transaction[];
} 