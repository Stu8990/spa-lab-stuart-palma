import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  usuario = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  ingresar() {
    this.error = '';
    this.auth.login(this.usuario, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => this.error = err.message
    });
  }
}
