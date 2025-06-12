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
// import { TaskService } from '../../services/transaction.service';
// import { Icons, ButtonTexts } from '../../shared/ui-constants';
// import { Task, TaskImportance } from '../../models/transaction.model';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

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
        SelectModule,
        ToastModule,
        TagModule,
        ButtonModule,
        ConfirmDialogModule,
        FloatLabelModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './task-list.component.html',
    styles: [`
        .task-card {
            display: flex;
            flex-direction: column;
        }

        p-table {
            flex: 1;
            overflow: auto;
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

        :host ::ng-deep .p-datatable {
            height: 100%;
        }

        @media (max-width: 768px) {
            .actions-cell {
                flex-wrap: wrap;
            }
        }
    `]
})
export class TaskListComponent {
    // icons = Icons;
    // texts = ButtonTexts;
    // tasks: Task[] = [];
    // taskDialog: boolean = false;
    // currentTask: Partial<Task> = {};
    // editMode: boolean = false;
    // importanceLevels = [
    //     { label: 'Faible', value: 'LOW' },
    //     { label: 'Moyenne', value: 'MEDIUM' },
    //     { label: 'Haute', value: 'HIGH' }
    // ];

    // TaskImportance = TaskImportance;

    // constructor(
    //     private taskService: TaskService,
    //     private messageService: MessageService,
    //     private confirmationService: ConfirmationService
    // ) {}

    // ngOnInit() {
    //     this.loadTasks();
    // }

    // loadTasks() {
    //     this.taskService.getTasks().subscribe(tasks => {
    //         this.tasks = tasks;
    //     });
    // }

    // showNewTaskDialog() {
    //     this.currentTask = {
    //         reward: 10, // Valeur par défaut pour la récompense
    //         importance: TaskImportance.MEDIUM // Valeur par défaut pour l'importance
    //     };
    //     this.editMode = false;
    //     this.taskDialog = true;
    // }

    // editTask(task: Task) {
    //     this.currentTask = { ...task };
    //     this.editMode = true;
    //     this.taskDialog = true;
    // }

    // hideDialog() {
    //     this.taskDialog = false;
    //     this.currentTask = {};
    // }

    // saveTask() {
    //     if (!this.currentTask.title || !this.currentTask.importance || this.currentTask.reward === undefined) {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Erreur',
    //             detail: 'Veuillez remplir tous les champs obligatoires'
    //         });
    //         return;
    //     }

    //     // S'assurer que la récompense est un nombre positif
    //     this.currentTask.reward = Math.max(0, Number(this.currentTask.reward));

    //     // Préparer les données communes
    //     const taskData = {
    //         title: this.currentTask.title,
    //         importance: this.currentTask.importance,
    //         reward: this.currentTask.reward
    //     };

    //     if (this.editMode && this.currentTask._id) {
    //         // Mode édition - PATCH
    //         console.log('Mode édition - ID:', this.currentTask._id);
    //         console.log('Données de mise à jour:', taskData);

    //         this.taskService.updateTask(this.currentTask._id, taskData).subscribe({
    //             next: (updatedTask) => {
    //                 console.log('Tâche mise à jour avec succès:', updatedTask);
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Succès',
    //                     detail: 'Tâche mise à jour'
    //                 });
    //                 this.loadTasks();
    //                 this.hideDialog();
    //             },
    //             error: (error) => {
    //                 console.error('Erreur lors de la mise à jour:', error);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Erreur',
    //                     detail: `Erreur lors de la mise à jour de la tâche: ${error.message || 'Erreur inconnue'}`
    //                 });
    //             }
    //         });
    //     } else {
    //         // Mode création - POST
    //         console.log('Mode création');
    //         console.log('Données de création:', taskData);

    //         this.taskService.addTask(taskData).subscribe({
    //             next: (newTask) => {
    //                 console.log('Tâche créée avec succès:', newTask);
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Succès',
    //                     detail: 'Tâche créée'
    //                 });
    //                 this.loadTasks();
    //                 this.hideDialog();
    //             },
    //             error: (error) => {
    //                 console.error('Erreur lors de la création:', error);
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Erreur',
    //                     detail: `Erreur lors de la création de la tâche: ${error.message || 'Erreur inconnue'}`
    //                 });
    //             }
    //         });
    //     }
    // }

    // deleteTask(task: Task) {
    //     if (!task._id) return;
        
    //     this.confirmationService.confirm({
    //         message: `Voulez-vous vraiment supprimer la tâche "${task.title}" ?`,
    //         header: 'Confirmation de suppression',
    //         icon: 'pi pi-exclamation-triangle',
    //         acceptLabel: this.icons.check + 'Oui, supprimer',
    //         rejectLabel: this.icons.cancel + 'Non, annuler',
    //         accept: () => {
    //             this.taskService.deleteTask(task._id!).subscribe({
    //                 next: () => {
    //                     this.messageService.add({
    //                         severity: 'success',
    //                         summary: 'Succès',
    //                         detail: 'Tâche supprimée'
    //                     });
    //                     this.loadTasks();
    //                 },
    //                 error: (error) => {
    //                     console.error('Erreur lors de la suppression:', error);
    //                     this.messageService.add({
    //                         severity: 'error',
    //                         summary: 'Erreur',
    //                         detail: 'Erreur lors de la suppression de la tâche'
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // }

    // confirmTaskCompletion(task: Task) {
    //     if (!task._id) return;

    //     this.confirmationService.confirm({
    //         message: `Voulez-vous valider la tâche "${task.title}" ? Vous gagnerez ${task.reward}€.`,
    //         header: 'Confirmation de validation',
    //         icon: 'pi pi-check-circle',
    //         acceptLabel: this.icons.check + 'Oui, valider',
    //         rejectLabel: this.icons.cancel + 'Non, annuler',
    //         accept: () => {
    //             this.completeTask(task);
    //         }
    //     });
    // }

    // completeTask(task: Task) {
    //     if (!task._id) return;

    //     this.taskService.completeTask(task._id).subscribe({
    //         next: (completedTask) => {
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Succès',
    //                 detail: `Tâche complétée ! +${task.reward}€`
    //             });
    //             this.loadTasks();
    //         },
    //         error: (error) => {
    //             console.error('Erreur lors de la complétion de la tâche:', error);
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Erreur',
    //                 detail: 'Erreur lors de la complétion de la tâche'
    //             });
    //         }
    //     });
    // }

    // reopenTask(task: Task) {
    //     if (!task._id) return;

    //     this.taskService.reopenTask(task._id).subscribe({
    //         next: () => {
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Succès',
    //                 detail: 'Tâche réouverte'
    //             });
    //             this.loadTasks();
    //         },
    //         error: (error) => {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Erreur',
    //                 detail: 'Erreur lors de la réouverture de la tâche'
    //             });
    //         }
    //     });
    // }

    // importanceChanged(event: SelectChangeEvent) {
    //     const newImportance = event.value;
    //     const newReward = newImportance === TaskImportance.HIGH ? 20 : newImportance === TaskImportance.MEDIUM ? 10 : 5;
    //     this.currentTask.reward = newReward;
    // }
} 