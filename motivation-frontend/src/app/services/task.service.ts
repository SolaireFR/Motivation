import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';
import { BudgetService } from './budget.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;
    private tasksSubject = new BehaviorSubject<Task[]>([]);

    constructor(
        private http: HttpClient,
        private budgetService: BudgetService
    ) {
        this.loadTasks();
    }

    private loadTasks(): void {
        this.http.get<Task[]>(this.apiUrl)
            .subscribe(tasks => this.tasksSubject.next(tasks));
    }

    getTasks(): Observable<Task[]> {
        return this.tasksSubject.asObservable();
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

    updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
        // Si la récompense est mise à jour, assurons-nous qu'elle est un nombre positif
        if (taskData.reward !== undefined) {
            taskData.reward = Math.max(0, Number(taskData.reward) || 0);
        }

        // Nettoyer les données avant l'envoi
        const cleanedData = {
            title: taskData.title,
            description: taskData.description || '',
            importance: taskData.importance,
            reward: taskData.reward
        };

        return this.http.patch<Task>(`${this.apiUrl}/${id}`, cleanedData).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSubject.value;
                const index = currentTasks.findIndex(task => task._id === id);
                if (index !== -1) {
                    currentTasks[index] = updatedTask;
                    this.tasksSubject.next([...currentTasks]);
                }
            })
        );
    }

    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const currentTasks = this.tasksSubject.value;
                this.tasksSubject.next(currentTasks.filter(task => task._id !== id));
            })
        );
    }

    completeTask(id: string): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/${id}/complete`, {}).pipe(
            switchMap(updatedTask => {
                // Mettre à jour la liste des tâches
                const currentTasks = this.tasksSubject.value;
                const index = currentTasks.findIndex(task => task._id === id);
                if (index !== -1) {
                    currentTasks[index] = updatedTask;
                    this.tasksSubject.next([...currentTasks]);
                }

                // Ajouter la récompense au budget
                return this.budgetService.addReward(
                    updatedTask.reward,
                    `Récompense pour la tâche : ${updatedTask.title}`,
                    updatedTask._id
                ).pipe(
                    map(() => updatedTask) // Retourner la tâche mise à jour
                );
            })
        );
    }

    reopenTask(id: string): Observable<Task> {
        return this.http.post<Task>(`${this.apiUrl}/${id}/reopen`, {}).pipe(
            tap(updatedTask => {
                const currentTasks = this.tasksSubject.value;
                const index = currentTasks.findIndex(task => task._id === id);
                if (index !== -1) {
                    currentTasks[index] = updatedTask;
                    this.tasksSubject.next([...currentTasks]);
                }
            })
        );
    }

    getTaskById(id: string): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }
} 