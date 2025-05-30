export interface TaskHistory {
    completionDate: Date;
    earnedMoney: number;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    importance: 'LOW' | 'MEDIUM' | 'HIGH';
    moneyPerCompletion: number;
    history: TaskHistory[];
    createdAt: Date;
    updatedAt: Date;
} 