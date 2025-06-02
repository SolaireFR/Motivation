import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonComponent } from '../../shared/components/button.component';
import { BudgetService } from '../../services/budget.service';
import { Budget, Transaction } from '../../models/budget.model';
import { Icons, ButtonTexts } from '../../shared/ui-constants';

@Component({
    selector: 'app-budget',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        ToastModule,
        ButtonComponent
    ],
    providers: [MessageService],
    template: `
        <div class="card">
            <p-toast></p-toast>
            
            <div class="flex justify-content-between mb-3">
                <h2>Budget : {{budget?.total || 0}}€</h2>
                <div>
                    <app-button 
                        [icon]="icons.plus"
                        [label]="texts.add"
                        (onClick)="showNewExpenseDialog()"
                    ></app-button>
                </div>
            </div>

            <p-table [value]="budget?.transactions || []" [tableStyle]="{'min-width': '50rem'}">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Montant</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-transaction>
                    <tr [ngClass]="{'reward-transaction': transaction.type === 'REWARD', 'expense-transaction': transaction.type === 'EXPENSE'}">
                        <td>{{transaction.date | date:'dd/MM/yyyy HH:mm'}}</td>
                        <td>{{transaction.type === 'REWARD' ? 'Récompense' : 'Dépense'}}</td>
                        <td>{{transaction.description}}</td>
                        <td [ngClass]="{'text-success': transaction.type === 'REWARD', 'text-danger': transaction.type === 'EXPENSE'}">
                            {{transaction.type === 'REWARD' ? '+' : '-'}}{{transaction.amount}}€
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="expenseDialog" header="Nouvelle dépense" [modal]="true" [style]="{width: '450px'}">
            <div class="grid formgrid p-fluid mt-3">
                <div class="field col-12">
                    <label for="amount">Montant (€)*</label>
                    <p-inputNumber id="amount" [(ngModel)]="currentExpense.amount" [min]="0" [showButtons]="true" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2"></p-inputNumber>
                </div>
                <div class="field col-12">
                    <label for="description">Description*</label>
                    <input pInputText id="description" [(ngModel)]="currentExpense.description" required />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <app-button
                    [icon]="icons.cancel"
                    [label]="texts.cancel"
                    type="secondary"
                    (onClick)="hideDialog()"
                ></app-button>
                <app-button
                    [icon]="icons.save"
                    [label]="texts.save"
                    type="success"
                    (onClick)="saveExpense()"
                ></app-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .reward-transaction {
            background-color: var(--green-50);
        }
        
        .expense-transaction {
            background-color: var(--red-50);
        }

        .text-success {
            color: var(--green-500);
            font-weight: bold;
        }

        .text-danger {
            color: var(--red-500);
            font-weight: bold;
        }
    `]
})
export class BudgetComponent implements OnInit {
    icons = Icons;
    texts = ButtonTexts;
    budget: Budget | null = null;
    expenseDialog = false;
    currentExpense: { amount: number; description: string } = {
        amount: 0,
        description: ''
    };

    constructor(
        private budgetService: BudgetService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadBudget();
    }

    loadBudget() {
        this.budgetService.getBudget().subscribe(budget => {
            this.budget = budget;
        });
    }

    showNewExpenseDialog() {
        this.currentExpense = {
            amount: 0,
            description: ''
        };
        this.expenseDialog = true;
    }

    hideDialog() {
        this.expenseDialog = false;
        this.currentExpense = {
            amount: 0,
            description: ''
        };
    }

    saveExpense() {
        if (!this.currentExpense.description || this.currentExpense.amount <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs correctement'
            });
            return;
        }

        this.budgetService.addExpense(
            this.currentExpense.amount,
            this.currentExpense.description
        ).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Dépense ajoutée'
                });
                this.hideDialog();
            },
            error: (error) => {
                console.error('Erreur lors de l\'ajout de la dépense:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de l\'ajout de la dépense'
                });
            }
        });
    }
} 