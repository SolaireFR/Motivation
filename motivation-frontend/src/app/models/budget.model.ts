export interface HistoryEntry {
    title: string;
    amount: number;
    createdAt: Date;
}

export interface Budget {
    _id: string;
    total: number;
    history: HistoryEntry[];
} 