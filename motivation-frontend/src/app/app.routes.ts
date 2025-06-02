import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { BudgetComponent } from './components/budget/budget.component';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent },
    { path: 'budget', component: BudgetComponent }
];
