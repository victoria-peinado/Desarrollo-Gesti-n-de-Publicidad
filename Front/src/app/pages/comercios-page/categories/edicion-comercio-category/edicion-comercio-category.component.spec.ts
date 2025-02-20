import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionComercioCategoryComponent } from './edicion-comercio-category.component';

describe('EdicionComercioCategoryComponent', () => {
  let component: EdicionComercioCategoryComponent;
  let fixture: ComponentFixture<EdicionComercioCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionComercioCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionComercioCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
