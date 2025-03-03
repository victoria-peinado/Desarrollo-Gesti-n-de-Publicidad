import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { InputFieldComponent } from './input-field.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldComponent ],
      imports: [
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatIconModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  // Prueba que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba que el label se muestre correctamente
  it('should display label', () => {
    component.label = 'Nombre';
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('mat-label'));
    expect(labelElement.nativeElement.textContent).toBe('Nombre');
  });

  // Prueba que el placeholder se muestre correctamente
  it('should display placeholder', () => {
    component.placeholder = 'Ingrese su nombre';
    fixture.detectChanges();
    expect(inputElement.nativeElement.placeholder).toBe('Ingrese su nombre');
  });

  // Prueba que el tipo de input se establezca correctamente
  it('should set input type', () => {
    component.type = 'email';
    fixture.detectChanges();
    expect(inputElement.nativeElement.type).toBe('email');
  });

  // Prueba que el icono se muestre correctamente
  it('should display icon', () => {
    component.icon = 'person';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement.nativeElement.textContent).toBe('person');
  });

  // Prueba que el modo 'select' se muestre correctamente
  it('should display select mode', () => {
    component.mode = 'select';
    component.options = ['Opción 1', 'Opción 2'];
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('mat-select'));
    expect(selectElement).toBeTruthy();
  });

  // Prueba que el modo 'date' se muestre correctamente
  it('should display date mode', () => {
    component.mode = 'date';
    fixture.detectChanges();
    const dateInputElement = fixture.debugElement.query(By.css('input[matDatepicker]'));
    expect(dateInputElement).toBeTruthy();
  });

  // Prueba que el mensaje de error se muestre correctamente
  it('should display error message', () => {
    component.control.setErrors({ required: true });
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement.nativeElement.textContent).toBe('* Campo obligatorio');
  });

  // Prueba que el botón de limpiar se muestre correctamente
  it('should display clear button', () => {
    component.type = 'text';
    component.value = 'Valor';
    fixture.detectChanges();
    const clearButtonElement = fixture.debugElement.query(By.css('mat-icon[aria-label="Clear input value"]'));
    expect(clearButtonElement).toBeTruthy();
  });

  // Prueba que el botón de visibilidad de contraseña se muestre correctamente
  it('should display password visibility toggle', () => {
    component.type = 'password';
    fixture.detectChanges();
    const visibilityButtonElement = fixture.debugElement.query(By.css('mat-icon[aria-label="Toggle password visibility"]'));
    expect(visibilityButtonElement).toBeTruthy();
  });
});