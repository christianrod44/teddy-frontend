import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Client } from '../models/client.model';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-clients-selected',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './clients-selected.component.html',
  styleUrl: './clients-selected.component.scss'
})
export class ClientsSelectedComponent implements OnInit {
  
  selectedClients: Client[] = [];
  userNameFromStorage: string = '';
  isSidebarOpen: boolean = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['selectedClients']) {
      this.selectedClients = navigation.extras.state['selectedClients'];
      this.saveSelectedClientsToStorage();
    } else {
      this.loadSelectedClientsFromStorage();
    }
  }

  ngOnInit(): void {
    this.userNameFromStorage = localStorage.getItem('userName') || 'Usuário!';
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
    this.selectedClients = this.selectedClients.filter(c => c.id !== clientToRemove.id);
    this.saveSelectedClientsToStorage();
  }

  onClearSelectedClients(): void {
    if (confirm('Tem certeza que deseja remover todos os clientes selecionados?')) {
      this.selectedClients = [];
      this.saveSelectedClientsToStorage();
      alert('Todos os clientes selecionados foram removidos.');
    }
  }
}
