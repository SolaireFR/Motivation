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
import { Budget } from '../../models/budget.model';
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
                        (onClick)="showNewEntryDialog()"
                    ></app-button>
                </div>
            </div>

            <p-table [value]="budget?.history || []" [tableStyle]="{'min-width': '50rem'}">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date</th>
                        <th>Titre</th>
                        <th>Montant</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-entry>
                    <tr [ngClass]="{'positive-amount': entry.amount > 0, 'negative-amount': entry.amount < 0}">
                        <td>{{entry.createdAt | date:'dd/MM/yyyy HH:mm'}}</td>
                        <td>{{entry.title}}</td>
                        <td [ngClass]="{'text-success': entry.amount > 0, 'text-danger': entry.amount < 0}">
                            {{entry.amount > 0 ? '+' : ''}}{{entry.amount}}€
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="entryDialog" header="Nouvelle entrée" [modal]="true" [style]="{width: '450px'}">
            <div class="grid formgrid p-fluid mt-3">
                <div class="field col-12">
                    <label for="title">Titre*</label>
                    <input pInputText id="title" [(ngModel)]="currentEntry.title" required />
                </div>
                <div class="field col-12">
                    <label for="amount">Montant (€)*</label>
                    <p-inputNumber id="amount" [(ngModel)]="currentEntry.amount" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2"></p-inputNumber>
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
                    (onClick)="saveEntry()"
                ></app-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .positive-amount {
            background-color: var(--green-50);
        }
        
        .negative-amount {
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
    entryDialog = false;
    currentEntry: { title: string; amount: number } = {
        title: '',
        amount: 0
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

    showNewEntryDialog() {
        this.currentEntry = {
            title: '',
            amount: 0
        };
        this.entryDialog = true;
    }

    hideDialog() {
        this.entryDialog = false;
        this.currentEntry = {
            title: '',
            amount: 0
        };
    }

    saveEntry() {
        if (!this.currentEntry.title || !this.currentEntry.amount) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs'
            });
            return;
        }

        this.budgetService.addHistoryEntry(
            this.currentEntry.title,
            this.currentEntry.amount
        ).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Entrée ajoutée'
                });
                this.loadBudget();
                this.hideDialog();
            },
            error: (error) => {
                console.error('Erreur lors de l\'ajout de l\'entrée:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de l\'ajout de l\'entrée'
                });
            }
        });
    }
} 