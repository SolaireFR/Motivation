import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-task-history',
    standalone: true,
    imports: [CommonModule, TableModule],
    template: `
        <div class="card">
            <h3>Historique de la tâche : {{task.title}}</h3>
            <p-table [value]="task.history">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Date de complétion</th>
                        <th>Gains</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-history>
                    <tr>
                        <td>{{history.completionDate | date:'dd/MM/yyyy HH:mm'}}</td>
                        <td>{{history.earnedMoney}}€</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class TaskHistoryComponent {
    @Input() task!: Task;
} 