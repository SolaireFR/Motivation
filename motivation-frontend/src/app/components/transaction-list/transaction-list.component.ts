import { Component, computed, Input, QueryList, Signal, ViewChildren } from '@angular/core';
import { TransactionType } from '../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { FormTransactionComponent } from "../form-transaction/form-transaction.component";
import { CreateTransactionDto, UpdateTransactionDto } from '../../dtos/transaction.dto';

@Component({
    standalone: true,
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    imports: [CommonModule, ButtonModule, MenuModule, DividerModule, FormTransactionComponent],
})
export class TransactionListComponent {
    @Input() type!: TransactionType;

    @ViewChildren('menuRef') menuRefs!: QueryList<any>;

    TransactionType = TransactionType;

    waitingTransactions$: Signal<Transaction[]>;
    completedTransactions$: Signal<Transaction[]>;

    editVisible: boolean = false;
    _selectedTransaction: Transaction | undefined;

    set selectedTransaction(value: Transaction | undefined) {
        if (value !== undefined || this.editVisible === false) {
            this._selectedTransaction = value;
        }
    }

    get selectedTransaction(): Transaction | undefined {
        return this._selectedTransaction;
    }

    waitingTransactionItems = [
        {
            label: 'Options',
            items: [
                {
                    label: '✅ Valider',
                    command: () => this.completeTransaction(this.selectedTransaction)
                },
                {
                    label: '✏️ Modifier',
                    command: () => this.editTransaction(this.selectedTransaction)
                },
                {
                    label: '❌ Supprimer',
                    command: () => this.deleteTransaction(this.selectedTransaction)
                }
            ]
        }
    ];

    completedTransactionItems = [
        {
            label: 'Actions',
            items: [
                {
                    label: '🔄 Dupliquer',
                    icon: 'pi pi-copy',
                    command: () => this.duplicateTransaction(this.selectedTransaction)
                },
                {
                    label: '❌ Supprimer',
                    icon: 'pi pi-trash',
                    command: () => this.deleteTransaction(this.selectedTransaction)
                }
            ]
        }];

    rewardFullSum$: Signal<number>; 
    
    constructor(private readonly transactionService: TransactionService) {
        this.waitingTransactions$ = computed(() => {
            return this.transactionService.transactions$()
                .filter(transaction => transaction.type === this.type && transaction.completedAt === null)
        });
        this.completedTransactions$ = computed(() => {
            return this.transactionService.transactions$()
                .filter(transaction => transaction.type === this.type && transaction.completedAt != null)
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
        });
        this.rewardFullSum$ = computed(() => {
            const loses = this.transactionService.transactions$()
                .filter(transaction => transaction.type === TransactionType.REWARD && transaction.completedAt !== null)
                .reduce((sum, transaction) => sum + transaction.sum, 0);
            const gains = this.transactionService.transactions$()
                .filter(transaction => transaction.type === TransactionType.TASK && transaction.completedAt !== null)
                .reduce((sum, transaction) => sum + transaction.sum, 0);

            return gains + loses;
        });
    }

    selectTransaction(transaction: Transaction | undefined): void {
        this.selectedTransaction = transaction;
    }

    completeTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            return;
        }

        const dto = new UpdateTransactionDto({ completedAt: new Date() });
        this.transactionService.updateTransaction(transaction._id, dto).subscribe({
            next: () => {
                this.selectedTransaction = undefined; // Reset selected transaction after completion
            },
            error: (error) => {
                console.error('Error completing transaction:', error);
            }
        });

    }

    duplicateTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            return;
        }

        const dto = new CreateTransactionDto({
            title: transaction.title,
            sum: transaction.sum,
            type: transaction.type,
        });
        this.transactionService.createTransaction(dto).subscribe({
            next: () => {
                this.selectedTransaction = undefined; // Reset selected transaction after duplication
            },
            error: (error) => {
                console.error('Error duplicating transaction:', error);
            }
        });
    }

    editTransaction(transaction: Transaction | undefined): void {
        this.selectedTransaction = transaction;
        this.editVisible = true;
    }

    deleteTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            return;
        }

        this.transactionService.deleteTransaction(transaction._id).subscribe({
            next: () => {
                this.selectedTransaction = undefined; // Reset selected transaction after deletion
            },
            error: (error) => {
                console.error('Error deleting transaction:', error);
            }
        });
    }
}
