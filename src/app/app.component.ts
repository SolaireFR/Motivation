import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskService } from './services/task.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaskListComponent,
        ButtonModule,
        DialogModule,
        InputNumberModule,
        ConfirmDialogModule,
        ToastModule
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
                    <div class="total-amount mb-3">{{totalMoney}}€</div>
                    <div class="money-actions">
                        <p-button icon="pi pi-pencil" (onClick)="showMoneyDialog()" class="mr-2" label="Modifier"></p-button>
                        <p-button icon="pi pi-refresh" (onClick)="confirmReset()" severity="danger" label="Réinitialiser"></p-button>
                    </div>
                </div>
                <div class="tasks-block">
                    <app-task-list></app-task-list>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="moneyDialog" header="Modifier la cagnotte" [modal]="true" [style]="{width: '450px'}">
            <div class="grid formgrid p-fluid mt-3">
                <div class="field col-12">
                    <label for="amount">Nouveau montant</label>
                    <p-inputNumber id="amount" [(ngModel)]="newAmount" [min]="0" mode="currency" currency="EUR"></p-inputNumber>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton pRipple label="Annuler" icon="pi pi-times" class="p-button-text" (click)="hideMoneyDialog()"></button>
                <button pButton pRipple label="Sauvegarder" icon="pi pi-check" class="p-button-text" (click)="updateMoney()"></button>
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

        .tasks-block {
            min-width: 0;
        }

        .money-actions {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }
    `]
})
export class AppComponent implements OnInit {
    totalMoney: number = 0;
    moneyDialog: boolean = false;
    newAmount: number = 0;

    constructor(
        private taskService: TaskService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.taskService.getTotalMoney().subscribe(money => {
            this.totalMoney = money;
        });
    }

    showMoneyDialog() {
        this.newAmount = this.totalMoney;
        this.moneyDialog = true;
    }

    hideMoneyDialog() {
        this.moneyDialog = false;
    }

    updateMoney() {
        if (this.newAmount >= 0) {
            this.taskService.setTotalMoney(this.newAmount).subscribe(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Cagnotte mise à jour'
                });
                this.hideMoneyDialog();
            });
        }
    }

    confirmReset() {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir réinitialiser la cagnotte à zéro ?',
            header: 'Confirmation de réinitialisation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.taskService.resetTotalMoney().subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Cagnotte réinitialisée à zéro'
                    });
                });
            }
        });
    }
} 