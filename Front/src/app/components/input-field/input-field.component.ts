import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  @Input() mode: 'input' | 'select' = 'input';
  @Input() options: string[] = [];

  hidePassword: boolean = true;
  value: string = '';

  @Input() selectedOption: string = '';

  get inputType(): string {
    return this.type === 'password' && this.hidePassword ? 'password' : 'text';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(): string {
    if (this.control.hasError('required')) return '* Campo obligatorio';
    if (this.control.hasError('pattern')) return 'Solo números';
    if (this.control.hasError('minlength')) return `Mínimo ${this.validations.minLength} caracteres`;
    if (this.control.hasError('maxlength')) return `Máximo ${this.validations.maxLength} caracteres`;
    return '';
  }

}
