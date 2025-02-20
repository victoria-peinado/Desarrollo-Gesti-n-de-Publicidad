import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaTitularCategoryComponent } from './alta-titular-category.component';

describe('AltaTitularCategoryComponent', () => {
  let component: AltaTitularCategoryComponent;
  let fixture: ComponentFixture<AltaTitularCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltaTitularCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaTitularCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
