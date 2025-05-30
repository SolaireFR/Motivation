import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        DropdownModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="card">
            <p-toast></p-toast>
            
            <div class="flex justify-content-between mb-3">
                <h2>Gestion des tâches</h2>
                <div>
                    <p-button label="Nouvelle tâche" icon="pi pi-plus" (onClick)="showNewTaskDialog()"></p-button>
                </div>
            </div>

            <div class="mb-3">
                <strong>Cagnotte totale : {{totalMoney}}€</strong>
            </div>

            <p-table [value]="tasks" [tableStyle]="{'min-width': '50rem'}">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Importance</th>
                        <th>Gains par complétion</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-task>
                    <tr>
                        <td>{{task.title}}</td>
                        <td>{{task.description}}</td>
                        <td>{{task.importance}}</td>
                        <td>{{task.moneyPerCompletion}}€</td>
                        <td>
                            <p-button icon="pi pi-check" class="mr-2" (onClick)="completeTask(task)">Valider</p-button>
                            <p-button icon="pi pi-pencil" class="mr-2" (onClick)="editTask(task)">Modifier</p-button>
                            <p-button icon="pi pi-trash" severity="danger" (onClick)="deleteTask(task)">Supprimer</p-button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="taskDialog" [header]="editMode ? 'Modifier la tâche' : 'Nouvelle tâche'" [modal]="true" [style]="{width: '450px'}">
            <div class="grid formgrid p-fluid mt-3">
                <div class="field col-12">
                    <label for="title">Titre*</label>
                    <input pInputText id="title" [(ngModel)]="currentTask.title" required autofocus />
                </div>
                <div class="field col-12">
                    <label for="description">Description</label>
                    <textarea pInputTextarea id="description" [(ngModel)]="currentTask.description" rows="3"></textarea>
                </div>
                <div class="field col-12">
                    <label for="importance">Importance*</label>
                    <p-dropdown id="importance" [options]="importanceLevels" [(ngModel)]="currentTask.importance" placeholder="Sélectionner l'importance"></p-dropdown>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton pRipple label="Annuler" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
                <button pButton pRipple label="Sauvegarder" icon="pi pi-check" class="p-button-text" (click)="saveTask()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class TaskListComponent implements OnInit {
    tasks: Task[] = [];
    totalMoney: number = 0;
    taskDialog: boolean = false;
    currentTask: Partial<Task> = {};
    editMode: boolean = false;
    importanceLevels = [
        { label: 'Faible', value: 'LOW' },
        { label: 'Moyenne', value: 'MEDIUM' },
        { label: 'Haute', value: 'HIGH' }
    ];

    constructor(
        private taskService: TaskService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadTasks();
        this.taskService.getTotalMoney().subscribe(money => {
            this.totalMoney = money;
        });
    }

    loadTasks() {
        this.taskService.getTasks().subscribe(tasks => {
            this.tasks = tasks;
        });
    }

    showNewTaskDialog() {
        this.currentTask = {};
        this.editMode = false;
        this.taskDialog = true;
    }

    editTask(task: Task) {
        this.currentTask = { ...task };
        this.editMode = true;
        this.taskDialog = true;
    }

    hideDialog() {
        this.taskDialog = false;
        this.currentTask = {};
    }

    saveTask() {
        if (!this.currentTask.title || !this.currentTask.importance) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            return;
        }

        if (this.editMode) {
            this.taskService.updateTask(this.currentTask.id!, this.currentTask).subscribe(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Tâche mise à jour'
                });
                this.hideDialog();
            });
        } else {
            this.taskService.addTask(this.currentTask as { title: string; description?: string; importance: 'LOW' | 'MEDIUM' | 'HIGH' }).subscribe(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Tâche créée'
                });
                this.hideDialog();
            });
        }
    }

    deleteTask(task: Task) {
        this.taskService.deleteTask(task.id).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Tâche supprimée'
            });
        });
    }

    completeTask(task: Task) {
        this.taskService.completeTask(task.id).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Tâche complétée ! +${task.moneyPerCompletion}€`
            });
        });
    }
} 