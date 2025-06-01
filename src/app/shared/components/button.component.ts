import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
        <button 
            class="btn" 
            [class.btn-primary]="type === 'primary'"
            [class.btn-danger]="type === 'danger'"
            [class.btn-secondary]="type === 'secondary'"
            [class.btn-success]="type === 'success'"
            [title]="tooltip"
            (click)="onClick.emit($event)"
        >
            <span class="icon" *ngIf="icon">{{icon}}</span>
            <span class="label" *ngIf="label">{{label}}</span>
        </button>
    `,
    styles: [`
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.2s;
            color: white;
            background-color: #3B82F6;
            font-weight: 500;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn-primary {
            background-color: #3B82F6;
        }

        .btn-danger {
            background-color: #EF4444;
        }

        .btn-secondary {
            background-color: #6B7280;
        }

        .btn-success {
            background-color: #10B981;
        }

        .icon {
            font-size: 1rem;
        }

        .btn:not(:has(.label)) {
            padding: 0.5rem;
        }
    `]
})
export class ButtonComponent {
    @Input() label?: string;
    @Input() icon?: string;
    @Input() type: 'primary' | 'danger' | 'secondary' | 'success' = 'primary';
    @Input() tooltip?: string;
    @Output() onClick = new EventEmitter<MouseEvent>();
} 