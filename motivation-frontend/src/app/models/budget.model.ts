export type TransactionType = 'REWARD' | 'EXPENSE';

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: number;
    description: string;
    date: Date;
}

export interface Budget {
    total: number;
    transactions: Transaction[];
} 