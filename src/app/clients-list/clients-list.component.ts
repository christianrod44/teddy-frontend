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
import { DeleteClientModalComponent } from '../delete-client-modal/delete-client-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    ClientCardComponent,
    ClientFormComponent,
    DeleteClientModalComponent
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

  isDeleteClientModalOpen: boolean = false;
  clientToDelete?: Client;

  selectedClients: Client[] = []; 
  
  constructor(private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userNameFromStorage = localStorage.getItem('userName') || 'Usuário!';
    this.loadClients();
    this.loadSelectedClientsFromStorage();
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
        this.syncSelectedClients();
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

  // NOVO: Carrega clientes selecionados do localStorage
  loadSelectedClientsFromStorage(): void {
    const storedSelectedClients = localStorage.getItem('selectedClients');
    if (storedSelectedClients) {
      this.selectedClients = JSON.parse(storedSelectedClients);
    }
  }

  // NOVO: Salva clientes selecionados no localStorage
  saveSelectedClientsToStorage(): void {
    localStorage.setItem('selectedClients', JSON.stringify(this.selectedClients));
  }

  // NOVO: Sincroniza o estado 'selected' dos clientes exibidos com a lista de selecionados
  syncSelectedClients(): void {
    this.clients.forEach(client => {
      client.selected = this.selectedClients.some(selected => selected.id === client.id);
    });
  }

  // NOVO: Lógica para adicionar/remover cliente da lista de selecionados
  onToggleClientSelection(client: Client): void {
    const index = this.selectedClients.findIndex(c => c.id === client.id);

    if (index > -1) {
      // Cliente já está selecionado, então desseleciona
      this.selectedClients.splice(index, 1);
      client.selected = false;
    } else {
      // Cliente não está selecionado, então seleciona
      this.selectedClients.push(client);
      client.selected = true;
    }
    this.saveSelectedClientsToStorage(); // Salva a lista atualizada
    // O `loadClients()` para recarregar a lista exibida não é estritamente necessário aqui,
    // pois `client.selected` é atualizado diretamente e o Angular re-renderiza o card.
    // Mas, se você tiver paginação e quiser garantir que o estado persista ao mudar de página e voltar,
    // o `syncSelectedClients` em `loadClients` cuida disso.
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
    if (!client.selected) {
      this.selectedClientForEdit = client;
      this.isClientFormModalOpen = true;
    }
  }

  onClientFormClose(): void {
    this.isClientFormModalOpen = false;
    this.selectedClientForEdit = undefined;
    this.loadClients();
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

  onDeleteClient(client: Client): void {
    if (!client.selected) {
      this.clientToDelete = client;
      this.isDeleteClientModalOpen = true;
    }
  }

  onConfirmDelete(clientId: number): void {
    if (clientId) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          alert('Cliente excluído com sucesso!');
          this.onCloseDeleteModal();
          this.selectedClients = this.selectedClients.filter(c => c.id !== clientId);
          this.saveSelectedClientsToStorage();
          this.loadClients();
        },
        error: (err) => {
          console.error('Erro ao excluir cliente:', err);
          alert('Houve um problema ao processar a resposta da exclusão, mas o cliente pode ter sido removido. Por favor, recarregue a página se a lista não atualizar.');
          this.onCloseDeleteModal();
          this.loadClients(); 
        }
      });
    }
  }

  onCloseDeleteModal(): void {
    this.isDeleteClientModalOpen = false;
    this.clientToDelete = undefined;
  }

  // NOVO: Método para navegar para a página de clientes selecionados
  goToSelectedClients(): void {
    // O Router é injetado no construtor
    // Passamos os clientes selecionados via estado do router, que é uma forma segura
    this.router.navigateByUrl('/clients-selected', { state: { selectedClients: this.selectedClients } });
  }
}
