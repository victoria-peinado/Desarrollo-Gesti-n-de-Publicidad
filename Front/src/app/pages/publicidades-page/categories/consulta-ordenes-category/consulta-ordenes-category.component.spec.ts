import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaOrdenesCategoryComponent } from './consulta-ordenes-category.component';

describe('ConsultaOrdenesCategoryComponent', () => {
  let component: ConsultaOrdenesCategoryComponent;
  let fixture: ComponentFixture<ConsultaOrdenesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultaOrdenesCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaOrdenesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
