import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ButtonComponent } from '../../shared/components/button.component';
import { Icons, ButtonTexts } from '../../shared/ui-constants';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        ToastModule,
        TagModule,
        ButtonComponent,
        ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            <p-toast></p-toast>
            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            
            <div class="flex justify-content-between mb-3">
                <h2>Gestion des tâches</h2>
                <div>
                    <app-button 
                        [icon]="icons.plus"
                        [label]="texts.add"
                        (onClick)="showNewTaskDialog()"
                    ></app-button>
                </div>
            </div>

            <p-table [value]="tasks" [tableStyle]="{'min-width': '50rem'}">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Titre</th>
                        <th>Description</th>
                        <th>Importance</th>
                        <th>Récompense</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-task>
                    <tr [ngClass]="{'completed-task': task.status === 'COMPLETED'}">
                        <td>{{task.title}}</td>
                        <td>{{task.description}}</td>
                        <td>{{task.importance}}</td>
                        <td>{{task.reward}}€</td>
                        <td>
                            <p-tag [severity]="task.status === 'COMPLETED' ? 'success' : 'info'"
                                  [value]="task.status === 'COMPLETED' ? 'Terminée' : 'Active'">
                            </p-tag>
                        </td>
                        <td class="actions-cell">
                            <ng-container *ngIf="task.status === 'ACTIVE'">
                                <app-button
                                    [icon]="icons.check"
                                    [label]="texts.validate"
                                    type="success"
                                    tooltip="Valider la tâche"
                                    (onClick)="confirmTaskCompletion(task)"
                                ></app-button>
                                <app-button
                                    [icon]="icons.edit"
                                    [label]="texts.edit"
                                    tooltip="Modifier la tâche"
                                    (onClick)="editTask(task)"
                                ></app-button>
                                <app-button
                                    [icon]="icons.trash"
                                    [label]="texts.delete"
                                    type="danger"
                                    tooltip="Supprimer la tâche"
                                    (onClick)="deleteTask(task)"
                                ></app-button>
                            </ng-container>
                            <ng-container *ngIf="task.status === 'COMPLETED'">
                                <app-button
                                    [icon]="icons.refresh"
                                    [label]="texts.reopen"
                                    type="secondary"
                                    tooltip="Réouvrir la tâche"
                                    (onClick)="reopenTask(task)"
                                ></app-button>
                            </ng-container>
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
                    <p-dropdown id="importance" [options]="importanceLevels" appendTo="body" [(ngModel)]="currentTask.importance" placeholder="Sélectionner l'importance"></p-dropdown>
                </div>
                <div class="field col-12">
                    <label for="reward">Récompense (€)*</label>
                    <p-inputNumber id="reward" [(ngModel)]="currentTask.reward" [min]="0" [showButtons]="true" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2"></p-inputNumber>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <app-button
                    [icon]="icons.cancel"
                    [label]="texts.cancel"
                    type="secondary"
                    (onClick)="hideDialog()"
                ></app-button>
                <app-button
                    [icon]="icons.save"
                    [label]="texts.save"
                    type="success"
                    (onClick)="saveTask()"
                ></app-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .completed-task {
            background-color: var(--surface-ground);
        }
        
        .completed-task td {
            opacity: 0.7;
        }

        .actions-cell {
            display: flex;
            gap: 0.5rem;
        }

        :host ::ng-deep .p-dialog-footer {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
        }
    `]
})
export class TaskListComponent implements OnInit {
    icons = Icons;
    texts = ButtonTexts;
    tasks: Task[] = [];
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
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.taskService.getTasks().subscribe(tasks => {
            this.tasks = tasks;
        });
    }

    showNewTaskDialog() {
        this.currentTask = {
            reward: 10, // Valeur par défaut pour la récompense
            importance: 'MEDIUM' // Valeur par défaut pour l'importance
        };
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
        if (!this.currentTask.title || !this.currentTask.importance || this.currentTask.reward === undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            return;
        }

        // S'assurer que la récompense est un nombre positif
        this.currentTask.reward = Math.max(0, Number(this.currentTask.reward));

        // Préparer les données communes
        const taskData = {
            title: this.currentTask.title,
            description: this.currentTask.description || '',
            importance: this.currentTask.importance,
            reward: this.currentTask.reward
        };

        if (this.editMode && this.currentTask._id) {
            // Mode édition - PATCH
            console.log('Mode édition - ID:', this.currentTask._id);
            console.log('Données de mise à jour:', taskData);

            this.taskService.updateTask(this.currentTask._id, taskData).subscribe({
                next: (updatedTask) => {
                    console.log('Tâche mise à jour avec succès:', updatedTask);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Tâche mise à jour'
                    });
                    this.loadTasks();
                    this.hideDialog();
                },
                error: (error) => {
                    console.error('Erreur lors de la mise à jour:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: `Erreur lors de la mise à jour de la tâche: ${error.message || 'Erreur inconnue'}`
                    });
                }
            });
        } else {
            // Mode création - POST
            console.log('Mode création');
            console.log('Données de création:', taskData);

            this.taskService.addTask(taskData).subscribe({
                next: (newTask) => {
                    console.log('Tâche créée avec succès:', newTask);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Tâche créée'
                    });
                    this.loadTasks();
                    this.hideDialog();
                },
                error: (error) => {
                    console.error('Erreur lors de la création:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: `Erreur lors de la création de la tâche: ${error.message || 'Erreur inconnue'}`
                    });
                }
            });
        }
    }

    deleteTask(task: Task) {
        if (!task._id) return;
        
        this.confirmationService.confirm({
            message: `Voulez-vous vraiment supprimer la tâche "${task.title}" ?`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, supprimer',
            rejectLabel: 'Non, annuler',
            accept: () => {
                this.taskService.deleteTask(task._id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Tâche supprimée'
                        });
                        this.loadTasks();
                    },
                    error: (error) => {
                        console.error('Erreur lors de la suppression:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Erreur lors de la suppression de la tâche'
                        });
                    }
                });
            }
        });
    }

    confirmTaskCompletion(task: Task) {
        if (!task._id) return;

        this.confirmationService.confirm({
            message: `Voulez-vous valider la tâche "${task.title}" ? Vous gagnerez ${task.reward}€.`,
            header: 'Confirmation de validation',
            icon: 'pi pi-check-circle',
            accept: () => {
                this.completeTask(task);
            }
        });
    }

    completeTask(task: Task) {
        if (!task._id) return;

        this.taskService.completeTask(task._id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `Tâche complétée ! +${task.reward}€`
                });
                this.loadTasks();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de la complétion de la tâche'
                });
            }
        });
    }

    reopenTask(task: Task) {
        if (!task._id) return;

        this.taskService.reopenTask(task._id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Tâche réouverte'
                });
                this.loadTasks();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors de la réouverture de la tâche'
                });
            }
        });
    }
} 