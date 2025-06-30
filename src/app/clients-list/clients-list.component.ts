import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {

  userNameFromStorage: string = '';
  isSidebarOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.userNameFromStorage = localStorage.getItem('userName') || 'Usuário!';
  }

  toggleSidebarState(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log('Sidebar state toggled:', this.isSidebarOpen);
  }
}
