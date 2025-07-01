import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Client } from '../models/client.model';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss'
})
export class ClientCardComponent {

  @Input() client!: Client;
  @Output() editClient = new EventEmitter<Client>();
  @Output() deleteClient = new EventEmitter<Client>();
  @Output() toggleSelection = new EventEmitter<Client>();

  addIcon: string = 'img/plus.png';
  minusIcon: string = 'img/minus.png';
  editIcon: string = 'img/edit.png';
  deleteIcon: string = 'img/trash.png';

  onToggleSelectionClick(): void {
    this.toggleSelection.emit(this.client);
  }

  onEditClick(): void {
    this.editClient.emit(this.client);
  }

  onDeleteClick(): void {
    this.deleteClient.emit(this.client);
  }
}
