import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  addIcon: string = 'img/plus.png';
  editIcon: string = 'img/edit.png';
  deleteIcon: string = 'img/trash.png';

  onAddClick(): void {
    console.log('Adicionar cliente:', this.client.name);
  }

  onEditClick(): void {
    console.log('Editar cliente:', this.client.name);
  }

  onDeleteClick(): void {
    console.log('Deletar cliente:', this.client.name);
  }
}
