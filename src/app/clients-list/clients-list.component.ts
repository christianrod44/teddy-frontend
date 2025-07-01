import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { Client } from '../models/client.model';
import { ClientService } from '../services/client.service';
import { ClientApiResponse } from '../models/client-api-response.model';
import { ClientCardComponent } from '../client-card/client-card.component';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    ClientCardComponent,
    ClientFormComponent
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {

  userNameFromStorage: string = '';
  isSidebarOpen: boolean = false;

  clients: Client[] = [];
  totalClientsFound: number = 0;
  clientsPerPage: number = 16;
  currentPage: number = 0;
  totalPages: number = 1;

  isClientFormModalOpen: boolean = false;
  selectedClientForEdit?: Client;

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.userNameFromStorage = localStorage.getItem('userName') || 'Usuário!';
    this.loadClients();
  }

  toggleSidebarState(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadClients(): void {
    const apiPage = this.currentPage + 1;
    this.clientService.getClients(apiPage, this.clientsPerPage).subscribe({
      next: (response: ClientApiResponse) => {
        this.clients = response.clients;
        this.totalClientsFound = response.clients.length;
        this.totalPages = response.totalPages;
        
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        alert('Ocorreu um erro ao carregar os clientes. Verifique o console para mais detalhes.');
        this.clients = [];
        this.totalClientsFound = 0;
        this.totalPages = 1;
      }
    });
  }

  onClientsPerPageChange(): void {
    this.currentPage = 0;
    this.loadClients();
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadClients();
    }
  }

  onCreateClient(): void {
    this.selectedClientForEdit = undefined;
    this.isClientFormModalOpen = true;
  }

  onEditClient(client: Client): void {
    this.selectedClientForEdit = client;
    this.isClientFormModalOpen = true;
  }

  onClientFormClose(): void {
    this.isClientFormModalOpen = false;
    this.selectedClientForEdit = undefined;
  }

  onClientCreated(newClient: Client): void {
    alert(`Cliente '${newClient.name}' criado com sucesso!`);
    this.loadClients();
    this.onClientFormClose();
  }

  onClientUpdated(updatedClient: Client): void {
    alert(`Cliente '${updatedClient.name}' atualizado com sucesso!`);
    this.loadClients();
    this.onClientFormClose();
  }
}
