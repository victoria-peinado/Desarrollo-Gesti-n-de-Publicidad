import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaTitularCategoryComponent } from './baja-titular-category.component';

describe('BajaTitularCategoryComponent', () => {
  let component: BajaTitularCategoryComponent;
  let fixture: ComponentFixture<BajaTitularCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BajaTitularCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaTitularCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
