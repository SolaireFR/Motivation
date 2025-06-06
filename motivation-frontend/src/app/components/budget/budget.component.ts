import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Budget } from '../../models/budget.model';
import { BudgetService } from '../../services/budget.service';
import { Icons, ButtonTexts } from '../../shared/ui-constants';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

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
        ButtonModule,
        FloatLabelModule,
    ],
    providers: [MessageService],
    templateUrl: './budget.component.html',
    styles: [`
        .budget-card {
            display: flex;
            flex-direction: column;
        }

        p-table {
            flex: 1;
            overflow: auto;
        }

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

        :host ::ng-deep .p-datatable {
            height: 100%;
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

        if (this.currentEntry.amount >= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Le montant doit être négatif pour une récompense'
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