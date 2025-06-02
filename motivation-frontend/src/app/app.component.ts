import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from './shared/components/button.component';
import { Icons, ButtonTexts } from './shared/ui-constants';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonComponent
    ],
    template: `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Gestionnaire de Tâches</h1>
            
            <nav class="mb-4">
                <app-button 
                    [icon]="icons.tasks"
                    [label]="'Tâches'"
                    [routerLink]="['/tasks']"
                    routerLinkActive="active"
                ></app-button>
                <app-button 
                    [icon]="icons.money"
                    [label]="'Budget'"
                    [routerLink]="['/budget']"
                    routerLinkActive="active"
                ></app-button>
            </nav>

            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        nav {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        :host ::ng-deep .active {
            background-color: var(--primary-700) !important;
        }
    `]
})
export class AppComponent {
    icons = Icons;
    texts = ButtonTexts;
} 