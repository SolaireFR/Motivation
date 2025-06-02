import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Task, TaskHistory, TaskStatus } from '../models/task.model';
import { Reward } from '../models/reward.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    private totalMoney: number = 0;
    private rewards: Reward[] = [];
    private totalMoneySubject = new BehaviorSubject<number>(0);
    private rewardsSubject = new BehaviorSubject<Reward[]>([]);

    constructor(private http: HttpClient) {
        this.loadTasks();
    }

    private loadTasks(): void {
        this.http.get<Task[]>(this.apiUrl)
            .subscribe(tasks => this.tasksSubject.next(tasks));
    }

    getTasks(): Observable<Task[]> {
        return this.tasksSubject.asObservable();
    }

    getTotalMoney(): Observable<number> {
        return this.totalMoneySubject.asObservable();
    }

    getRewards(): Observable<Reward[]> {
        return this.rewardsSubject.asObservable();
    }

    addTask(taskData: { 
        title: string; 
        description?: string; 
        importance: 'LOW' | 'MEDIUM' | 'HIGH';
        reward: number;
    }): Observable<Task> {
        // Assurons-nous que la récompense est un nombre positif
        const reward = Math.max(0, Number(taskData.reward) || 0);
        
        return this.http.post<Task>(this.apiUrl, {
            ...taskData,
            reward
        }).pipe(
            tap(newTask => {
                const currentTasks = this.tasksSubject.value;
                this.tasksSubject.next([...currentTasks, newTask]);
            })
        );
    }

    updateTask(id: number, taskData: Partial<Task>): Observable<Task> {
        // Si la récompense est mise à jour, assurons-nous qu'elle est un nombre positif
        if (taskData.reward !== undefined) {
            taskData.reward = Math.max(0, Number(taskData.reward) || 0);
        }

        return this.http.patch<Task>(`${this.apiUrl}/${id}`, taskData).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSubject.value;
                const index = currentTasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    currentTasks[index] = updatedTask;
                    this.tasksSubject.next([...currentTasks]);
                }
            })
        );
    }

    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const currentTasks = this.tasksSubject.value;
                this.tasksSubject.next(currentTasks.filter(task => task.id !== id));
            })
        );
    }

    completeTask(id: number): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/${id}/complete`, {}).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSubject.value;
                const index = currentTasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    currentTasks[index] = updatedTask;
                    this.tasksSubject.next([...currentTasks]);
                    // Mettre à jour le total d'argent lorsqu'une tâche est complétée
                    if (updatedTask.reward) {
                        this.totalMoney += updatedTask.reward;
                        this.totalMoneySubject.next(this.totalMoney);
                    }
                }
            })
        );
    }

    reopenTask(id: number): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/${id}/reopen`, {}).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSubject.value;
                const index = currentTasks.findIndex(task => task.id === id);
                if (index !== -1) {
                    currentTasks[index] = updatedTask;
                    this.tasksSubject.next([...currentTasks]);
                }
            })
        );
    }

    getTaskById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }

    setTotalMoney(amount: number): Observable<number> {
        this.totalMoney = Math.max(0, Number(amount) || 0);
        this.totalMoneySubject.next(this.totalMoney);
        return of(this.totalMoney);
    }

    resetTotalMoney(): Observable<number> {
        this.totalMoney = 0;
        this.totalMoneySubject.next(this.totalMoney);
        return of(this.totalMoney);
    }

    addReward(name: string, amount: number): Observable<Reward> {
        const reward: Reward = {
            name,
            amount: Math.max(0, Number(amount) || 0),
            date: new Date()
        };
        
        this.rewards.unshift(reward);
        this.totalMoney = Math.max(0, this.totalMoney - reward.amount);
        this.totalMoneySubject.next(this.totalMoney);
        this.rewardsSubject.next([...this.rewards]);
        return of(reward);
    }
} 