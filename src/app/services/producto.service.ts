import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  costo: number;
  precio: number;
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, codigo: 'A001', nombre: 'Laptop HP', costo: 500, precio: 80, valor: 580 },
    { id: 2, codigo: 'B002', nombre: 'Mouse Logitech', costo: 15, precio: 25, valor: 40 },
    { id: 3, codigo: 'C003', nombre: 'Teclado Mecánico', costo: 40, precio: 60, valor: 100 }
  ];
  private nextId = 4;

  constructor() { }

  listar(): Observable<Producto[]> {
    return of([...this.productos]).pipe(delay(300));
  }

  agregar(producto: Producto): Observable<Producto> {
    producto.id = this.nextId++;
    this.productos.push(producto);
    return of(producto).pipe(delay(300));
  }

  actualizar(producto: Producto): Observable<Producto> {
    const index = this.productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      this.productos[index] = producto;
    }
    return of(producto).pipe(delay(300));
  }

  eliminar(id: number): Observable<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
