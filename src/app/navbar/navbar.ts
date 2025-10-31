import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: string | null = '';
  menuCollapsed = true;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  toggleMenu() {
    this.menuCollapsed = !this.menuCollapsed;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
