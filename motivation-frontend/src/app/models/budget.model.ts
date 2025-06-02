export interface Transaction {
    _id: string;
    amount: number;
    type: 'REWARD' | 'EXPENSE';
    description: string;
    taskId?: string;
    date: Date;
}

export interface Budget {
    _id: string;
    total: number;
    transactions: Transaction[];
    createdAt: Date;
    updatedAt: Date;
} 