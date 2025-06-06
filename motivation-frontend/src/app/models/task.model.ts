export enum TaskStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED'
}

export enum TaskImportance {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface Task {
    _id: string;
    title: string;
    reward: number;
    importance: TaskImportance;
    status: TaskStatus;
    createdAt: Date;
    completedAt?: Date;
    updatedAt: Date;
}

export interface TaskHistory {
    completionDate: Date;
    earnedMoney: number;
} 