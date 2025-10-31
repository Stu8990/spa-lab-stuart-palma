import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ProductoValidators {
  // Validador para precio en rango 10-100
  static precioEnRango(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const precio = parseFloat(control.value);
      if (precio < 10 || precio > 100) {
        return { precioFueraDeRango: true };
      }
      return null;
    };
  }

  // Validador para código de producto (letra seguida de números)
  static codigoValido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const regex = /^[A-Za-z]\d+$/;
      if (!regex.test(control.value)) {
        return { codigoInvalido: true };
      }
      return null;
    };
  }

  // Validador para nombre mínimo 5 caracteres
  static nombreMinimo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { nombreRequerido: true };
      }
      if (control.value.trim().length < 5) {
        return { nombreMinimo: true };
      }
      return null;
    };
  }

  // Validador para costo mayor a cero
  static costoValido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const costo = parseFloat(control.value);
      if (costo <= 0) {
        return { costoInvalido: true };
      }
      return null;
    };
  }
}
