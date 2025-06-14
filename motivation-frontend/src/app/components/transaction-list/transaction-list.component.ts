import { Component, computed, EventEmitter, Input, Output, QueryList, Signal, ViewChildren } from '@angular/core';
import { TransactionType } from '../../models/transaction-type.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { FormTransactionComponent } from "../form-transaction/form-transaction.component";
import { CreateTransactionDto, UpdateTransactionDto } from '../../dtos/transaction.dto';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    standalone: true,
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    imports: [CommonModule, ButtonModule, MenuModule, DividerModule],
})
export class TransactionListComponent {
    @Input() type!: TransactionType;
    @Input() index: number = 0;
    @Output() indexChange = new EventEmitter<number>();

    @ViewChildren('menuRef') menuRefs!: QueryList<any>;

    TransactionType = TransactionType;

    waitingTransactions$: Signal<Transaction[]>;
    completedTransactions$: Signal<Transaction[]>;

    selectedTransaction$: Signal<Transaction | undefined>;

    waitingTransactionItems = [
        {
            label: 'Options',
            items: [
                {
                    label: '✅ Valider',
                    command: () => this.completeTransaction(this.selectedTransaction$())
                },
                {
                    label: '✏️ Modifier',
                    command: () => this.editTransaction(this.selectedTransaction$())
                },
                {
                    label: '❌ Supprimer',
                    command: () => this.deleteTransaction(this.selectedTransaction$())
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
                    command: () => this.duplicateTransaction(this.selectedTransaction$())
                },
                {
                    label: '❌ Supprimer',
                    icon: 'pi pi-trash',
                    command: () => this.deleteTransaction(this.selectedTransaction$())
                }
            ]
        }];

    rewardFullSum$: Signal<number>; 
    
    constructor(
        private readonly transactionService: TransactionService,
        private readonly confirmService: ConfirmationService,
        private readonly messageService: MessageService,
    ) {
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
        this.selectedTransaction$ = this.transactionService.selectedTransaction$;
    }

    selectTransaction(transaction: Transaction | undefined): void {
        if (this.index !== 2) {
            this.transactionService.selectedTransaction = transaction;
        }
    }

    completeTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucune transaction n\'est sélectionnée pour la validation.',
            });
            return;
        }

        this.confirmService.confirm({
            message: `Êtes-vous sûr de vouloir valider la "${transaction.type}" ?`,
            header: 'Confirmation',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                this.acceptCompleteTransaction(transaction);
            },
            reject: () => {
                this.transactionService.selectedTransaction =  undefined;
            }
        });
    }

    private acceptCompleteTransaction(transaction: Transaction): void {
        const dto = new UpdateTransactionDto({ completedAt: new Date() });
        this.transactionService.updateTransaction(transaction._id, dto).subscribe({
            next: () => {
                this.transactionService.selectedTransaction =  undefined; // Reset selected transaction after completion
                this.messageService.add({
                    severity: 'success',
                    summary: transaction.type + ' complétée',
                    detail: `La "${transaction.type}" a été validée avec succès.`,
                });
            },
            error: (error) => {
                console.error('Error completing transaction:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: `Une erreur est survenue lors de la validation de la "${transaction.type}".`,
                });
            }
        });
    }

    duplicateTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucune transaction n\'est sélectionnée pour la duplication.',
            });
            return;
        }

        const dto = new CreateTransactionDto({
            title: transaction.title,
            sum: transaction.sum,
            type: transaction.type,
        });
        this.transactionService.createTransaction(dto).subscribe({
            next: () => {
                this.transactionService.selectedTransaction =  undefined; // Reset selected transaction after duplication
                this.messageService.add({
                    severity: 'success',
                    summary: transaction.type + ' dupliquée',
                    detail: `La "${transaction.type}" a été dupliquée avec succès.`,
                });
            },
            error: (error) => {
                console.error('Error duplicating transaction:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: `Une erreur est survenue lors de la duplication de la "${transaction.type}".`,
                });
            }
        });
    }

    editTransaction(transaction: Transaction | undefined): void {
        this.transactionService.selectedTransaction = transaction;
        this.indexChange.emit(2);
    }

    deleteTransaction(transaction: Transaction | undefined): void {
        if (!transaction) {
            console.error('Transaction is undefined');
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucune transaction n\'est sélectionnée pour la suppression.',
            });
            return;
        }

        this.confirmService.confirm({
            message: `Êtes-vous sûr de vouloir supprimer la "${transaction.type}" ?`,
            header: 'Confirmation',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                this.acceptDeleteTransaction(transaction);
            },
            reject: () => {
                this.transactionService.selectedTransaction =  undefined;
            }
        });
    }

    acceptDeleteTransaction(transaction: Transaction): void {
        this.transactionService.deleteTransaction(transaction._id).subscribe({
            next: () => {
                this.transactionService.selectedTransaction =  undefined; // Reset selected transaction after deletion
                this.messageService.add({
                    severity: 'success',
                    summary: transaction.type + ' supprimée',
                    detail: `La "${transaction.type}" a été supprimée avec succès.`,
                });
            },
            error: (error) => {
                console.error('Error deleting transaction:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: `Une erreur est survenue lors de la suppression de la "${transaction.type}".`,
                });
            }
        });
    }
}
