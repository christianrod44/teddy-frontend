import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  onCloseClick(): void {
    this.closeSidebar.emit();
  }

  onLinkClick(): void {
    this.closeSidebar.emit();
  }
}
