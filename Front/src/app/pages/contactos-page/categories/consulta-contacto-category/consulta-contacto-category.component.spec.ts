import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaContactoCategoryComponent } from './consulta-contacto-category.component';

describe('ConsultaContactoCategoryComponent', () => {
  let component: ConsultaContactoCategoryComponent;
  let fixture: ComponentFixture<ConsultaContactoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultaContactoCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaContactoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
