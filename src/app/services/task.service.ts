import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, TaskHistory } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasks: Task[] = [];
    private totalMoney: number = 0;
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    private totalMoneySubject = new BehaviorSubject<number>(0);

    constructor() {
        // Données de test
        this.addTask({
            title: 'Exemple de tâche',
            description: 'Description de la tâche exemple',
            importance: 'MEDIUM'
        });
    }

    getTasks(): Observable<Task[]> {
        return this.tasksSubject.asObservable();
    }

    getTotalMoney(): Observable<number> {
        return this.totalMoneySubject.asObservable();
    }

    addTask(taskData: { title: string; description?: string; importance: 'LOW' | 'MEDIUM' | 'HIGH' }): Observable<Task> {
        const newTask: Task = {
            id: this.tasks.length + 1,
            ...taskData,
            moneyPerCompletion: 10,
            history: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.push(newTask);
        this.tasksSubject.next([...this.tasks]);
        return of(newTask);
    }

    updateTask(id: number, taskData: Partial<Task>): Observable<Task | undefined> {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = {
                ...this.tasks[index],
                ...taskData,
                updatedAt: new Date()
            };
            this.tasksSubject.next([...this.tasks]);
            return of(this.tasks[index]);
        }
        return of(undefined);
    }

    deleteTask(id: number): Observable<boolean> {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.tasksSubject.next([...this.tasks]);
            return of(true);
        }
        return of(false);
    }

    completeTask(id: number): Observable<Task | undefined> {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const completion: TaskHistory = {
                completionDate: new Date(),
                earnedMoney: task.moneyPerCompletion
            };
            task.history.push(completion);
            this.totalMoney += task.moneyPerCompletion;
            this.totalMoneySubject.next(this.totalMoney);
            this.tasksSubject.next([...this.tasks]);
            return of(task);
        }
        return of(undefined);
    }

    getTaskById(id: number): Observable<Task | undefined> {
        return of(this.tasks.find(task => task.id === id));
    }
} 