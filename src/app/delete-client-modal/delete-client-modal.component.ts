import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../models/client.model';

@Component({
  selector: 'app-delete-client-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-client-modal.component.html',
  styleUrl: './delete-client-modal.component.scss'
})
export class DeleteClientModalComponent {

  @Input() isOpen: boolean = false;
  @Input() clientToDelete?: Client;

  @Output() confirmDelete = new EventEmitter<number>();
  @Output() cancelDelete = new EventEmitter<void>();

  constructor() { }

  onConfirm(): void {
    if (this.clientToDelete?.id) {
      this.confirmDelete.emit(Number(this.clientToDelete.id));
    }
  }

  onCancel(): void {
    this.cancelDelete.emit();
  }
}
