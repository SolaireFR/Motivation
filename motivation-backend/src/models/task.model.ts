export enum TaskStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export class Task {
  id: string;
  title: string;
  reward: number;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
} 