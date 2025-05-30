import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, TaskListComponent],
    template: `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Gestionnaire de Tâches</h1>
            <app-task-list></app-task-list>
        </div>
    `
})
export class AppComponent {} 