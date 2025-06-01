import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from '../models/task.model';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];
  private idCounter = 1;

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  createTask(title: string, description: string | undefined, reward: number): Task {
    const task: Task = {
      id: this.idCounter.toString(),
      title,
      description: description || '',
      reward,
      status: TaskStatus.ACTIVE,
      createdAt: new Date(),
    };
    this.tasks.push(task);
    this.idCounter++;
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const task = this.tasks[taskIndex];
    const updatedTask = {
      ...task,
      ...updates,
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  completeTask(id: string): Task {
    const task = this.getTaskById(id);
    if (task.status === TaskStatus.COMPLETED) {
      throw new Error('Task is already completed');
    }
    
    return this.updateTask(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  reopenTask(id: string): Task {
    const task = this.getTaskById(id);
    if (task.status === TaskStatus.ACTIVE) {
      throw new Error('Task is already active');
    }

    return this.updateTask(id, {
      status: TaskStatus.ACTIVE,
      completedAt: undefined,
    });
  }

  deleteTask(id: string): void {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
  }
} 