import { Component, computed, Input, QueryList, Signal, ViewChildren } from '@angular/core';
import { TransactionType } from '../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { MenuItem } from 'primeng/api';
import { FormTransactionComponent } from "../form-transaction/form-transaction.component";

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
    selectedTransaction: Transaction | undefined;

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
    }

    selectTransaction(transaction: Transaction | undefined): void {
        console.log('Selected transaction: ', transaction);
        this.selectedTransaction = transaction;
    }

    completeTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            return;
        }

        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        console.log('Completing transaction: ' + transaction._id + ' at ' + formattedDate);
    }

    duplicateTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            return;
        }

        console.log('Duplicating transaction: ', transaction);
        // this.transactionService.duplicateTransaction(transaction);
    }

    editTransaction(transaction: Transaction | undefined): void {
        this.selectedTransaction = transaction;
        this.editVisible = true;
    }

    deleteTransaction(transaction: Transaction | undefined): void {
        console.log('Deleting transaction: ', transaction);
        // this.transactionService.deleteTransaction(transaction);
    }
}
