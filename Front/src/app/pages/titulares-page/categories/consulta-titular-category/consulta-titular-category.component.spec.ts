import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTitularCategoryComponent } from './consulta-titular-category.component';

describe('ConsultaTitularCategoryComponent', () => {
  let component: ConsultaTitularCategoryComponent;
  let fixture: ComponentFixture<ConsultaTitularCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultaTitularCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTitularCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
