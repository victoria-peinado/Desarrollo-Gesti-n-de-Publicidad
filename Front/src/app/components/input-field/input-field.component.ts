import { Component, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control: FormControl = new FormControl('');
  @Input() icon?: string;
  @Input() validations: any = {}; 
  @Input() mode: 'input' | 'select' | 'date' = 'input';
  @Input() options: string[] = [];
  @Input() hintLabel: string = '';
  @Input() tooltipText: string = '';
  @Input() tooltipDisabled: boolean = false;


  hidePassword: boolean = true;
  value = '';
  

  @Input() selectedOption: string = '';

  get inputType(): string {
    return this.type === 'password' && this.hidePassword ? 'password' : 'text';
  }

  get maxlength(): number | null {
    return this.validations.maxLength ? this.validations.maxLength : null;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(): string {
    if (this.control.hasError('required')) return '* Campo obligatorio.';
    if (this.control.hasError('pattern')) return 'Solo números.';
    if (this.control.hasError('minlength')) return `Mínimo ${this.validations.minLength} caracteres.`;
    if (this.control.hasError('maxlength')) return `Máximo ${this.validations.maxLength} caracteres.`;
    if (this.control.hasError('email')) return 'Formato de mail incorrecto.';
    if (this.control.hasError('fantasyNameRepeated')) return 'Nombre fantasía repetido.';
    if (this.control.hasError('invalidEmail')) return 'Formato de mail incorrecto.';
    if (this.control.hasError('dateToGreater')) return 'Debe ser menor a Fecha Hasta.';
    return '';
  }

  clearDate() {
    if (this.control.disabled) {
      return;
    }
    this.control.setValue(null);
  }
  
}
