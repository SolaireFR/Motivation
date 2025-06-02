import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './components/task-list/task-list.component';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Reward } from './models/reward.model';
import { Budget } from './models/budget.model';
import { ButtonComponent } from './shared/components/button.component';
import { Icons, ButtonTexts } from './shared/ui-constants';
import { BudgetService } from './services/budget.service';
import { RewardService } from './services/reward.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaskListComponent,
        DialogModule,
        InputNumberModule,
        InputTextModule,
        ConfirmDialogModule,
        ToastModule,
        ButtonComponent
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="container mx-auto p-4">
            <p-toast></p-toast>
            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            
            <h1 class="text-3xl font-bold mb-4">Gestionnaire de Tâches</h1>
            <div class="grid-container">
                <div class="money-block card">
                    <h2 class="text-2xl mb-3">Cagnotte Totale</h2>
                    <div class="total-amount mb-3" [ngClass]="{'negative': budget?.total < 0}">{{budget?.total || 0}}€</div>
                    <div class="money-actions mb-4">
                        <app-button
                            [icon]="icons.gift"
                            [label]="texts.reward"
                            type="success"
                            (onClick)="showRewardDialog()"
                        ></app-button>
                    </div>
                    <div class="rewards-history" *ngIf="rewards.length > 0">
                        <h3 class="text-lg mb-2">Historique des récompenses</h3>
                        <div class="reward-list">
                            <div class="reward-item" *ngFor="let reward of rewards">
                                <span class="reward-name">{{reward.name}}</span>
                                <span class="reward-amount">-{{reward.amount}}€</span>
                                <span class="reward-date">{{reward.date | date:'dd/MM/yyyy HH:mm'}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tasks-block">
                    <app-task-list></app-task-list>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="rewardDialog" header="Ajouter une récompense" [modal]="true" [style]="{width: '450px'}">
            <div class="grid formgrid p-fluid mt-3">
                <div class="field col-12">
                    <label for="rewardName">Nom de la récompense*</label>
                    <input pInputText id="rewardName" [(ngModel)]="newReward.name" required />
                </div>
                <div class="field col-12">
                    <label for="rewardAmount">Montant*</label>
                    <p-inputNumber id="rewardAmount" [(ngModel)]="newReward.amount" mode="currency" currency="EUR" [min]="0"></p-inputNumber>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <app-button
                    [icon]="icons.cancel"
                    [label]="texts.cancel"
                    type="secondary"
                    (onClick)="hideRewardDialog()"
                ></app-button>
                <app-button
                    [icon]="icons.save"
                    [label]="texts.save"
                    type="success"
                    (onClick)="addReward()"
                ></app-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .grid-container {
            display: grid;
            gap: 1rem;
            grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
            .grid-container {
                grid-template-columns: 300px 1fr;
            }
        }

        .money-block {
            background: var(--surface-card);
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
        }

        .total-amount {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .total-amount.negative {
            color: var(--red-500);
        }

        .tasks-block {
            min-width: 0;
        }

        .money-actions {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }

        .rewards-history {
            text-align: left;
            border-top: 1px solid var(--surface-border);
            margin-top: 1rem;
            padding-top: 1rem;
        }

        .reward-list {
            max-height: 200px;
            overflow-y: auto;
        }

        .reward-item {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 0.5rem;
            padding: 0.5rem;
            border-bottom: 1px solid var(--surface-border);
            font-size: 0.9rem;
        }

        .reward-name {
            font-weight: 500;
            grid-column: 1;
        }

        .reward-amount {
            color: var(--red-500);
            grid-column: 2;
        }

        .reward-date {
            grid-column: 1 / -1;
            font-size: 0.8rem;
            color: var(--text-color-secondary);
        }

        :host ::ng-deep .p-dialog-footer {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
        }
    `]
})
export class AppComponent implements OnInit {
    icons = Icons;
    texts = ButtonTexts;
    budget: Budget | null = null;
    rewardDialog: boolean = false;
    rewards: Reward[] = [];
    newReward: Partial<Reward> = {
        name: '',
        amount: 0
    };

    constructor(
        private budgetService: BudgetService,
        private rewardService: RewardService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.budgetService.getBudget().subscribe(budget => {
            this.budget = budget;
        });
        this.rewardService.getRewards().subscribe(rewards => {
            this.rewards = rewards;
        });
    }

    showRewardDialog() {
        this.newReward = {
            name: '',
            amount: 0
        };
        this.rewardDialog = true;
    }

    hideRewardDialog() {
        this.rewardDialog = false;
        this.newReward = {
            name: '',
            amount: 0
        };
    }

    addReward() {
        if (!this.newReward.name || !this.newReward.amount) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs'
            });
            return;
        }

        this.rewardService.addReward(this.newReward.name, this.newReward.amount).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Récompense ajoutée'
                });
                this.hideRewardDialog();
            },
            error: (error) => {
                console.error('Erreur lors de l\'ajout de la récompense:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de l\'ajout de la récompense'
                });
            }
        });
    }
} 