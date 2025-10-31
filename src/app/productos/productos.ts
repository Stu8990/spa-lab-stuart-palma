import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService, Producto } from '../services/producto.service';
import { ProductoValidators } from '../validators/producto.validators';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  editando = false;
  cargando = false;
  displayedColumns: string[] = ['codigo', 'nombre', 'costo', 'precio', 'valor', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      id: [0],
      codigo: ['', [Validators.required, ProductoValidators.codigoValido()]],
      nombre: ['', [Validators.required, ProductoValidators.nombreMinimo()]],
      costo: [null, [Validators.required, ProductoValidators.costoValido()]],
      precio: [null, [Validators.required, ProductoValidators.precioEnRango()]],
      valor: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('Error al cargar productos', 'error');
      }
    });
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.mostrarMensaje('Por favor corrija los errores del formulario', 'error');
      return;
    }

    const producto = this.productoForm.value;

    if (this.editando) {
      this.productoService.actualizar(producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.cancelar();
          this.mostrarMensaje('Producto actualizado exitosamente', 'success');
        },
        error: () => {
          this.mostrarMensaje('Error al actualizar producto', 'error');
        }
      });
    } else {
      this.productoService.agregar(producto).subscribe({
        next: () => {
          this.cargarProductos();
          this.productoForm.reset({ id: 0 });
          this.mostrarMensaje('Producto agregado exitosamente', 'success');
        },
        error: () => {
          this.mostrarMensaje('Error al agregar producto', 'error');
        }
      });
    }
  }

  editar(producto: Producto): void {
    this.productoForm.patchValue(producto);
    this.editando = true;
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        next: () => {
          this.cargarProductos();
          this.mostrarMensaje('Producto eliminado exitosamente', 'success');
        },
        error: () => {
          this.mostrarMensaje('Error al eliminar producto', 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.editando = false;
    this.productoForm.reset({ id: 0 });
  }

  // Métodos helper para mostrar errores específicos
  getErrorCodigo(): string {
    const control = this.productoForm.get('codigo');
    if (control?.hasError('required')) {
      return 'El código es requerido';
    }
    if (control?.hasError('codigoInvalido')) {
      return 'El código debe iniciar con una letra seguida de números (ej: A001)';
    }
    return '';
  }

  getErrorNombre(): string {
    const control = this.productoForm.get('nombre');
    if (control?.hasError('required') || control?.hasError('nombreRequerido')) {
      return 'El nombre es requerido';
    }
    if (control?.hasError('nombreMinimo')) {
      return 'El nombre del producto debe tener mínimo 5 caracteres';
    }
    return '';
  }

  getErrorCosto(): string {
    const control = this.productoForm.get('costo');
    if (control?.hasError('required')) {
      return 'El costo es requerido';
    }
    if (control?.hasError('costoInvalido')) {
      return 'Ingrese un costo válido';
    }
    return '';
  }

  getErrorPrecio(): string {
    const control = this.productoForm.get('precio');
    if (control?.hasError('required')) {
      return 'El precio es requerido';
    }
    if (control?.hasError('precioFueraDeRango')) {
      return 'El precio está fuera de rango';
    }
    return '';
  }

  getErrorValor(): string {
    const control = this.productoForm.get('valor');
    if (control?.hasError('required')) {
      return 'El valor es requerido';
    }
    return '';
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
