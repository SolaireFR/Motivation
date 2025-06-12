import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { Transaction } from '../models/transaction.model';
import { environment } from '../../environments/environment';
import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transaction.dto';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private readonly apiUrl = `${environment.apiUrl}/transactions`;
    private readonly _transactions$: WritableSignal<Transaction[]> = signal([]);

    constructor(private readonly http: HttpClient) {}

    get transactions$(): Signal<Transaction[]> {
        return computed(() => this._transactions$());
    }

    loadTransactions(): void {
        this.http.get<Transaction[]>(this.apiUrl)
            .subscribe(transactions => this._transactions$.set(transactions));
    }

    createTransaction(dto: CreateTransactionDto): Observable<Transaction> {
        return this.http.post<Transaction>(this.apiUrl, dto).pipe(
            tap(newTransaction => {
                const current = this._transactions$();
                this._transactions$.set([...current, newTransaction]);
            })
        );
    }

    updateTransaction(id: string, dto: UpdateTransactionDto): Observable<Transaction> {
        return this.http.patch<Transaction>(`${this.apiUrl}/${id}`, dto).pipe(
            tap(updatedTransaction => {
                const current = this._transactions$();
                const index = current.findIndex(t => t._id === id);
                if (index !== -1) {
                    const updated = [...current];
                    updated[index] = updatedTransaction;
                    this._transactions$.set(updated);
                }
            })
        );
    }

    deleteTransaction(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                const current = this._transactions$();
                this._transactions$.set(current.filter(t => t._id !== id));
            })
        );
    }
} 
