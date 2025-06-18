import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from './services/transaction.service';
import { TabsModule } from 'primeng/tabs';
import { TransactionListComponent } from "./components/transaction-list/transaction-list.component";
import { TransactionType } from './models/transaction-type.enum';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormTransactionComponent } from './components/form-transaction/form-transaction.component';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        TabsModule,
        TransactionListComponent,
        ToastModule,
        ConfirmDialogModule,
        FormTransactionComponent,
    ],
    template: `
        <div class="container mx-auto p-4 h-screen w-screen flex flex-col">
            <h1 class="text-3xl font-bold mb-4 shrink-0">
                <img src="logo-motivation-colored-min.png" alt="Logo" class="inline-block h-8 mr-2" />
                Gestionnaire de Tâches
            </h1>
            <p-tabs [(value)]="index" class="flex flex-1 overflow-auto flex-col">
                <p-tablist class="shrink-0">
                    <p-tab [value]="0">Tâches</p-tab>
                    <p-tab [value]="1">Récompenses</p-tab>
                    <p-tab [value]="2">Créer/Modifier</p-tab>
                </p-tablist>
                <p-tabpanels class="flex-1 overflow-auto">
                    <p-tabpanel [value]="0">
                        <app-transaction-list [type]="TransactionType.TASK" [(index)]="index"></app-transaction-list>
                    </p-tabpanel>
                    <p-tabpanel [value]="1">
                        <app-transaction-list [type]="TransactionType.REWARD" [(index)]="index"></app-transaction-list>
                    </p-tabpanel>
                    <p-tabpanel [value]="2">
                        <app-form-transaction [(index)]="index" />
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>

        <p-toast />
        <p-confirmdialog />
    `,
})
export class AppComponent {
    TransactionType = TransactionType;
    index: number = 0;

    constructor(
        private readonly transactionService: TransactionService,
        private readonly keyclaok: Keycloak,
    ) {
        this.transactionService.loadTransactions();

        const keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

        effect(() => {
            const keycloakEvent = keycloakSignal();
            if (keycloakEvent.type === KeycloakEventType.TokenExpired) {
                this.keyclaok.updateToken().then(() => {
                    console.log('Token refreshed successfully');
                });
            }
        });
    }

    ngOnInit(): void {
        this.keyclaok
            .loadUserInfo()
            .then((userInfo) => {
                console.log('User info:', userInfo);
            })
            .catch(() => {
                this.keyclaok.login();
            });
    }
} 
