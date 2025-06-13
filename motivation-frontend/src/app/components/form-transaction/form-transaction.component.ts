import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { TransactionType } from '../../models/transaction-type.enum';
import { CreateTransactionDto, UpdateTransactionDto } from '../../dtos/transaction.dto';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-form-transaction',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, SelectModule, ButtonModule, InputNumberModule, InputTextModule],
    templateUrl: './form-transaction.component.html',
})
export class FormTransactionComponent {
    @Input() index: number = 0;
    @Output() indexChange = new EventEmitter<number>();

    transactionSelected$: Signal<Transaction | undefined>;

    form: FormGroup;

    optionsType = Object.values(TransactionType).map(type => ({
        label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
        value: type
    }));
    
    constructor(
        private readonly transactionService: TransactionService,
        private readonly messageService: MessageService,
    ) {
        this.transactionSelected$ = this.transactionService.selectedTransaction$;
        this.initializeForm();
    }

    private initializeForm() {
        const transaction = this.transactionSelected$();
        if (!transaction) {
            this.form = new FormGroup({
                title: new FormControl(''),
                sum: new FormControl(0),
                type: new FormControl(TransactionType.TASK),
            });
        } else {
            this.form = new FormGroup({
                title: new FormControl(transaction.title),
                sum: new FormControl(transaction.sum),
            });
        }
    }

    submit() {
        if (this.form.valid) {
            const selectedTransaction = this.transactionSelected$();
            if (selectedTransaction) {
                const dto = new UpdateTransactionDto(this.form.value);
                this.transactionService.updateTransaction(selectedTransaction._id, dto).subscribe({
                    next: () => {
                        this.close();
                        this.messageService.add({
                            severity: 'success',
                            summary: selectedTransaction.type + ' modifiée',
                            detail: `La "${selectedTransaction.type}" a été modifiée avec succès.`,
                        });
                    },
                    error: (error) => {
                        console.error('Error updating transaction:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur lors de la modification de la ' + selectedTransaction.type,
                            detail: error.message || 'Une erreur est survenue.'
                        });
                    }
                });
            } else {
                const dto = new CreateTransactionDto(this.form.value);
                this.transactionService.createTransaction(dto).subscribe({
                    next: () => {
                        this.close();
                        this.messageService.add({
                            severity: 'success',
                            summary: dto.type + ' créée',
                            detail: `La "${dto.type}" a été créée avec succès.`,
                        });
                    },
                    error: (error) => {
                        console.error('Error creating transaction:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur lors de la création de la ' + dto.type,
                            detail: error.message || 'Une erreur est survenue.'
                        });
                    }
                });
            }
        }
    }

    close(): void {
        this.transactionService.selectedTransaction = undefined;
        this.indexChange.emit(0); // Reset to the first tab
    }

    reset(): void {
        this.form.reset();
        this.initializeForm();
    }
}
