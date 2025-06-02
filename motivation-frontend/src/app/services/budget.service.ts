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
    private budgetSubject = new BehaviorSubject<Budget>({ total: 0, transactions: [] });

    constructor(private http: HttpClient) {
        this.loadBudget();
    }

    private loadBudget(): void {
        this.http.get<Budget>(this.apiUrl)
            .subscribe(budget => this.budgetSubject.next(budget));
    }

    getBudget(): Observable<Budget> {
        return this.budgetSubject.asObservable();
    }

    addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Observable<Transaction> {
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