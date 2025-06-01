import { Injectable } from '@nestjs/common';
import { Budget, Transaction, TransactionType } from '../models/budget.model';

@Injectable()
export class BudgetService {
  private budget: Budget = {
    total: 0,
    transactions: [],
  };
  private idCounter = 1;

  getBudget(): Budget {
    return this.budget;
  }

  getTransactions(): Transaction[] {
    return this.budget.transactions;
  }

  addReward(amount: number, description: string, taskId?: string): Transaction {
    const transaction: Transaction = {
      id: this.idCounter.toString(),
      amount,
      type: TransactionType.REWARD,
      description,
      date: new Date(),
      taskId,
    };

    this.budget.transactions.push(transaction);
    this.budget.total += amount;
    this.idCounter++;

    return transaction;
  }

  addExpense(amount: number, description: string): Transaction {
    const transaction: Transaction = {
      id: this.idCounter.toString(),
      amount,
      type: TransactionType.EXPENSE,
      description,
      date: new Date(),
    };

    this.budget.transactions.push(transaction);
    this.budget.total -= amount;
    this.idCounter++;

    return transaction;
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.budget.transactions.find(t => t.id === id);
  }

  getTotal(): number {
    return this.budget.total;
  }
} 