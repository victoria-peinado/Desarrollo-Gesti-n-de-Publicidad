import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({ selector: 'mat-label', template: '<ng-content></ng-content>' })
export class MockMatLabel {}

@Component({ selector: 'mat-error', template: '<ng-content></ng-content>' })
export class MockMatError {}


@Component({ selector: 'mat-icon', template: '<ng-content></ng-content>' })
export class MockMatIcon {}
// @Component({
//   selector: 'mat-select', // Selector igual al real
//   template: '<select [value]="value" (change)="handleChangeEvent($event)"><option *ngFor="let option of options" [value]="option">{{option}}</option></select>',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockMatSelect),
//       multi: true
//     }
//   ]
// })
// @Component({
//   selector: 'mat-select', // Selector igual al real
//   template: '<select [value]="value" (change)="onChange($event.target.value)"><option *ngFor="let option of options" [value]="option">{{option}}</option></select>',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockMatSelect),
//       multi: true
//     },
//     // No es necesario agregar un proveedor para MatFormFieldControl aquí
//   ]
// })

// @Component({
//   selector: 'mat-select', // Selector igual al real
//   template: '<select [value]="value" (change)="handleChangeEvent($event)"><option *ngFor="let option of options" [value]="option">{{option}}</option></select>',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => MockMatSelect),
//       multi: true
//     },
//     {
//       provide: MatFormFieldControl,
//       useExisting: forwardRef(() => MockMatSelect),
//     }
//   ]
// })
// export class MockMatSelect implements ControlValueAccessor, MatFormFieldControl<any> {
//   @Input() options: any[] = [];

//   value: any;
//   onChange: any = () => {};
//   onTouched: any = () => {};
//   isDisabled: boolean = false;
//   stateChanges: Subject<void> = new Subject<void>();
//   id: string = 'mock-select';
//   placeholder: string = '';
//   required: boolean = false;
//   shouldLabelFloat: boolean = true;

//   @Input() ngControl: NgControl;

//   focused: boolean = false;
//   empty: boolean = true;
//   disabled: boolean = false;
//   errorState: boolean = false;

//   writeValue(value: any): void {
//     this.value = value;
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.disabled = isDisabled;
//   }

//   onContainerClick(event: MouseEvent): void {
//     // Implementa la lógica para el click en el contenedor
//   }

//   setDescribedByIds(ids: string[]): void {
//     // Implementa la lógica para los IDs de descripción
//   }

//   ngOnDestroy(): void {
//     // Implementa la lógica para la destrucción del componente
//   }

//   handleChangeEvent(event: any): void {
//     const value = event.target?.value || '';
//     this.onChange(value);
//   }

//   constructor(
//     @Optional() @Self() public ngControl: NgControl,
//   ) {
//     if (this.ngControl) {
//       this.ngControl.valueAccessor = this;
//     }
//   }
// }