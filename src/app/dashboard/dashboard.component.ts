import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  user: string | null = '';
  totalClientes: number = 0;
  totalProductos: number = 0;
  valorInventario: number = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.clienteService.listar().subscribe(clientes => {
      this.totalClientes = clientes.length;
    });

    this.productoService.listar().subscribe(productos => {
      this.totalProductos = productos.length;
      this.valorInventario = productos.reduce((total, p) => total + p.valor, 0);
    });
  }

  irClientes() {
    this.router.navigate(['/clientes']);
  }

  irProductos() {
    this.router.navigate(['/productos']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
