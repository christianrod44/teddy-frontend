import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Input() userName: string = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.userName) {
      this.userName = localStorage.getItem('userName') || 'Usuário!';
    }

  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
