import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Client } from '../models/client.model';
import { Router } from '@angular/router'; // Para acessar o estado da navegação
import { HeaderComponent } from '../header/header.component'; // Se você quiser o header nesta página
import { SidebarComponent } from '../sidebar/sidebar.component'; // Se você quiser o sidebar nesta página


@Component({
  selector: 'app-clients-selected',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    HeaderComponent, // Adicione se for usar
    SidebarComponent // Adicione se for usar
  ],
  templateUrl: './clients-selected.component.html',
  styleUrl: './clients-selected.component.scss'
})
export class ClientsSelectedComponent implements OnInit {
  
  selectedClients: Client[] = [];
  userNameFromStorage: string = '';
  isSidebarOpen: boolean = false;

  constructor(private router: Router) {
    // Tenta pegar os dados passados via estado do router (se a navegação foi feita de ClientsListComponent)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['selectedClients']) {
      this.selectedClients = navigation.extras.state['selectedClients'];
      this.saveSelectedClientsToStorage(); // Salva na storage caso tenha vindo via state
    } else {
      // Se não veio pelo state (ex: refresh da página, ou acesso direto), tenta carregar do localStorage
      this.loadSelectedClientsFromStorage();
    }
  }

  ngOnInit(): void {
    this.userNameFromStorage = localStorage.getItem('userName') || 'Usuário!';
    // Garante que a lista está sincronizada ao iniciar, caso tenha alguma inconsistência
    // ou se o componente foi carregado diretamente (sem navegação via estado)
    this.loadSelectedClientsFromStorage();
  }

  toggleSidebarState(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadSelectedClientsFromStorage(): void {
    const storedSelectedClients = localStorage.getItem('selectedClients');
    if (storedSelectedClients) {
      this.selectedClients = JSON.parse(storedSelectedClients);
    }
  }

  saveSelectedClientsToStorage(): void {
    localStorage.setItem('selectedClients', JSON.stringify(this.selectedClients));
  }

  onRemoveSelection(clientToRemove: Client): void {
    // Remove o cliente da lista de selecionados
    this.selectedClients = this.selectedClients.filter(c => c.id !== clientToRemove.id);
    this.saveSelectedClientsToStorage(); // Atualiza o localStorage

    // Opcional: Se você quiser que o client-card na lista principal (ClientsListComponent)
    // reflita essa mudança imediatamente sem recarregar a página, você precisaria
    // de um Service compartilhado ou EventEmitter mais complexo. Por enquanto,
    // o localStorage garante a persistência entre as rotas. Ao voltar para
    // ClientsListComponent, ele recarregará do localStorage e sincronizará.
  }

  onClearSelectedClients(): void {
    if (confirm('Tem certeza que deseja remover todos os clientes selecionados?')) {
      this.selectedClients = []; // Limpa o array
      this.saveSelectedClientsToStorage(); // Atualiza o localStorage
      alert('Todos os clientes selecionados foram removidos.');
      // Opcional: Notificar ClientsListComponent para atualizar seus cards
    }
  }
}
