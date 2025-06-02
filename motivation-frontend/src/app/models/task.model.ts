export enum TaskStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED'
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    reward: number;
    importance: 'LOW' | 'MEDIUM' | 'HIGH';
    status: TaskStatus;
    createdAt: Date;
    completedAt?: Date;
    updatedAt: Date;
}

export interface TaskHistory {
    completionDate: Date;
    earnedMoney: number;
} 