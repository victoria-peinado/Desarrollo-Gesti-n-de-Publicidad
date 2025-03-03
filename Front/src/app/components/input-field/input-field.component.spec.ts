import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputFieldComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormControl(''); // Se inicializa un FormControl vacío
    fixture.detectChanges(); // Se actualiza el componente
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); 
  });

  it('should render label correctly', () => {
    component.label = 'Nombre';
    fixture.detectChanges(); // Se detectan cambios para reflejar la actualización en la plantilla
    const labelElement = fixture.debugElement.query(By.css('mat-label'));
    expect(labelElement.nativeElement.textContent).toContain('Nombre'); // Verifica que el label se renderiza correctamente
  });

  it('should toggle password visibility', () => {
    component.type = 'password';
    fixture.detectChanges();
    const toggleButton = fixture.debugElement.query(By.css('mat-icon[aria-label="Toggle password visibility"]'));
    expect(toggleButton).toBeTruthy(); // Verifica que el botón de visibilidad de contraseña existe
    
    toggleButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.hidePassword).toBeFalsy(); // Verifica que la visibilidad de la contraseña se haya cambiado
  });

  it('should display an error message when the field is required and empty', () => {
    component.control.setErrors({ required: true });
    component.control.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement.nativeElement.textContent).toContain('* Campo obligatorio'); // Verifica que el mensaje de error aparece
  });

  it('should render select options', () => {
    component.mode = 'select';
    component.options = ['Opción 1', 'Opción 2'];
    fixture.detectChanges();
    const selectElement = fixture.debugElement.query(By.css('mat-select'));
    expect(selectElement).toBeTruthy(); // Verifica que se renderiza el campo de selección
  });
});
