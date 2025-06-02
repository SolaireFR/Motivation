import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Reward } from '../models/reward.model';
import { BudgetService } from './budget.service';

@Injectable({
    providedIn: 'root'
})
export class RewardService {
    private rewards = new BehaviorSubject<Reward[]>([]);

    constructor(private budgetService: BudgetService) {}

    getRewards(): Observable<Reward[]> {
        return this.rewards.asObservable();
    }

    addReward(name: string, amount: number): Observable<any> {
        const reward: Reward = {
            name,
            amount: Math.max(0, Number(amount) || 0),
            date: new Date()
        };

        // Ajouter la récompense à l'historique local
        const currentRewards = this.rewards.value;
        this.rewards.next([reward, ...currentRewards]);

        // Ajouter une dépense dans le budget
        return this.budgetService.addExpense(amount, `Récompense : ${name}`);
    }

    clearRewards(): void {
        this.rewards.next([]);
    }
} 