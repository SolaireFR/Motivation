export interface TaskHistory {
    completionDate: Date;
    earnedMoney: number;
}

export type TaskStatus = 'ACTIVE' | 'COMPLETED';

export interface Task {
    id: number;
    title: string;
    description?: string;
    importance: 'LOW' | 'MEDIUM' | 'HIGH';
    reward: number;
    history: TaskHistory[];
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
} 