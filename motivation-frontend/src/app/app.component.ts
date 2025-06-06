import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';
import { BudgetComponent } from './components/budget/budget.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        TaskListComponent,
        BudgetComponent,
    ],
    template: `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Gestionnaire de Tâches</h1>
            
            <div class="grid-container">
                <app-budget></app-budget>
                <app-task-list></app-task-list>
            </div>
        </div>
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

        :host ::ng-deep .card {
            background: var(--surface-card);
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: var(--card-shadow);
        }
    `]
})
export class AppComponent {} 