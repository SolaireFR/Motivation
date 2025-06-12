import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget, HistoryEntry } from '../models/budget.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private apiUrl = `${environment.apiUrl}/budget`;

    constructor(private http: HttpClient) {}

    getBudget(): Observable<Budget> {
        console.log('Fetching budget from:', this.apiUrl);
        return this.http.get<Budget>(this.apiUrl);
    }

    addHistoryEntry(title: string, amount: number): Observable<HistoryEntry> {
        return this.http.post<HistoryEntry>(`${this.apiUrl}/history`, { title, amount });
    }

    resetBudget(): Observable<Budget> {
        return this.http.post<Budget>(`${this.apiUrl}/reset`, {});
    }
} 