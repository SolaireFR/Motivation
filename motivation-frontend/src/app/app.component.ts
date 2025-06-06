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
            
            <div class="grid grid-cols-1 md:grid-cols-8 gap-4">
                <app-budget class="col-span-3" />
                <app-task-list class="col-span-5" />
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep .card {
            background: var(--surface-card);
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: var(--card-shadow);
        }
    `]
})
export class AppComponent {} 
