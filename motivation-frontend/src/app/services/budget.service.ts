import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Budget, Transaction } from '../models/budget.model';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private apiUrl = `${environment.apiUrl}/budget`;
    private budgetSubject = new BehaviorSubject<Budget | null>(null);

    constructor(private http: HttpClient) {
        this.loadBudget();
    }

    private loadBudget(): void {
        this.http.get<Budget>(this.apiUrl).subscribe({
            next: (budget) => this.budgetSubject.next(budget),
            error: (error) => console.error('Erreur lors du chargement du budget:', error)
        });
    }

    getBudget(): Observable<Budget | null> {
        return this.budgetSubject.asObservable();
    }

    addReward(amount: number, description: string, taskId?: string): Observable<Transaction> {
        const transaction = {
            type: 'REWARD' as const,
            amount,
            description,
            taskId
        };

        return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction).pipe(
            tap(() => this.loadBudget())
        );
    }

    addExpense(amount: number, description: string): Observable<Transaction> {
        const transaction = {
            type: 'EXPENSE' as const,
            amount,
            description
        };

        return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction).pipe(
            tap(() => this.loadBudget())
        );
    }

    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
    }

    resetBudget(): Observable<Budget> {
        return this.http.post<Budget>(`${this.apiUrl}/reset`, {}).pipe(
            tap(budget => this.budgetSubject.next(budget))
        );
    }
} 