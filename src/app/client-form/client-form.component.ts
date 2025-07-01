import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../models/client.model';
import { ClientService } from '../services/client.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  providers: [
    provideNgxMask()
  ]
})
export class ClientFormComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() clientToEdit?: Client;

  @Output() clientCreated = new EventEmitter<Client>();
  @Output() clientUpdated = new EventEmitter<Client>();
  @Output() close = new EventEmitter<void>();

  client: Omit<Client, 'id' | 'selected'> = {
    name: '',
    salary: 0,
    companyValuation: 0
  };

  isEditMode: boolean = false;
  
  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    // A inicialização do modo de edição será feita em ngOnChanges
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.clientToEdit) {
        this.isEditMode = true;
        this.client = {
          name: this.clientToEdit.name,
          salary: this.clientToEdit.salary,
          companyValuation: this.clientToEdit.companyValuation
        };
      } else {
        this.isEditMode = false;
        this.resetForm();
      }
    }
  }

  onSubmit(): void {
    const clientDataToSend = {
      name: this.client.name,
      salary: this.client.salary,
      companyValuation: this.client.companyValuation
    };

    if (this.isEditMode && this.clientToEdit) {
      const clientIdAsNumber = Number(this.clientToEdit.id);
      if (isNaN(clientIdAsNumber)) {
        console.error('Erro: ID do cliente não é um número válido para atualização.');
        alert('Não foi possível atualizar o cliente: ID inválido.');
        return;
      }

      this.clientService.updateClient(clientIdAsNumber, clientDataToSend).subscribe({
        next: (updatedClient) => {
          this.clientUpdated.emit(updatedClient);
          this.onClose();
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
          alert('Erro ao atualizar cliente: ' + (err.error.message || err.message));
        }
      });
    } else {
      this.clientService.createClient(clientDataToSend).subscribe({
        next: (newClient) => {
          this.clientCreated.emit(newClient);
          this.onClose();
        },
        error: (err) => {
          console.error('Erro ao criar cliente:', err);
          alert('Erro ao criar cliente: ' + (err.error.message || err.message));
        }
      });
    }
  }

  onClose(): void {
    this.isOpen = false;
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.client = {
      name: '',
      salary: 0,
      companyValuation: 0
    };
    this.isEditMode = false;
    this.clientToEdit = undefined;
  }
}
