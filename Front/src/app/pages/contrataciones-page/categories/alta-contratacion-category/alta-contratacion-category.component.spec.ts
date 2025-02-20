import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaContratacionCategoryComponent } from './alta-contratacion-category.component';

describe('AltaContratacionCategoryComponent', () => {
  let component: AltaContratacionCategoryComponent;
  let fixture: ComponentFixture<AltaContratacionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltaContratacionCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaContratacionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
