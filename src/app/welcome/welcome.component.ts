import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})

export class WelcomeComponent {
  userName: string = '';

  constructor(private router: Router) { }

  enterApp(): void {
    if (this.userName.trim()) {
      localStorage.setItem('userName', this.userName.trim());
      this.router.navigate(['/clients-list']);
    } else {
      alert('Por favor, digite seu nome para continuar!');
    }
  }
}