import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
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
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-form-transaction',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, SelectModule, ButtonModule, InputNumberModule, InputTextModule],
    templateUrl: './form-transaction.component.html',
})
export class FormTransactionComponent {
    private _visible: boolean = false;

    @Input()
    get visible(): boolean {
        return this._visible;
    }
    set visible(value: boolean) {
        this._visible = value;
        this.visibleChange.emit(this._visible);
    }

    @Output() visibleChange = new EventEmitter<boolean>();

    _transaction: Transaction | undefined;
    @Input()
    set transaction(value: Transaction | undefined) {
        this._transaction = value;
        this.initializeForm(value);
    }
    get transaction(): Transaction | undefined {
        return this._transaction;
    }

    form: FormGroup;

    optionsType = Object.values(TransactionType).map(type => ({
        label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
        value: type
    }));
    
    constructor(
        private readonly transactionService: TransactionService,
        private readonly messageService: MessageService,
    ) {
        this.initializeForm();
    }

    private initializeForm(transaction?: Transaction) {
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
            const selectedTransaction = this.transaction;
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
        this.transaction = undefined;
        this.visible = false;
    }

    reset(): void {
        this.initializeForm(this.transaction);
    }
}
