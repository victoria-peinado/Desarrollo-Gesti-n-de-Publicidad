import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaComercioCategoryComponent } from './alta-comercio-category.component';

describe('AltaComercioCategoryComponent', () => {
  let component: AltaComercioCategoryComponent;
  let fixture: ComponentFixture<AltaComercioCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltaComercioCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaComercioCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
