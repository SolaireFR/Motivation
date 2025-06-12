import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from './services/transaction.service';
import { TabsModule } from 'primeng/tabs';
import { TransactionListComponent } from "./components/transaction-list/transaction-list.component";
import { TransactionType } from './models/transaction-type.enum';



@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        TabsModule,
        TransactionListComponent
    ],
    template: `
        <div class="container mx-auto p-4 h-screen w-screen flex flex-col">
            <h1 class="text-3xl font-bold mb-4 shrink-0">
                <img src="logo-motivation-colored-min.png" alt="Logo" class="inline-block h-8 mr-2" />
                Gestionnaire de Tâches
            </h1>
            <p-tabs value="0" class="flex flex-1 overflow-auto flex-col">
                <p-tablist class="shrink-0">
                    <p-tab value="0">Tâches</p-tab>
                    <p-tab value="1">Récompenses</p-tab>
                </p-tablist>
                <p-tabpanels class="flex-1 overflow-auto">
                    <p-tabpanel value="0">
                        <app-transaction-list [type]="TransactionType.TASK"></app-transaction-list>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <app-transaction-list [type]="TransactionType.REWARD"></app-transaction-list>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
})
export class AppComponent {
    TransactionType = TransactionType;

    constructor(private readonly transactionService: TransactionService) {
        this.transactionService.loadTransactions();
    }
} 
