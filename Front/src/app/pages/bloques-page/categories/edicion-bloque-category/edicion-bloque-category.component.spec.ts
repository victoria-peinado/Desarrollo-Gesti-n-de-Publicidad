import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionBloqueCategoryComponent } from './edicion-bloque-category.component';

describe('EdicionBloqueCategoryComponent', () => {
  let component: EdicionBloqueCategoryComponent;
  let fixture: ComponentFixture<EdicionBloqueCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionBloqueCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionBloqueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
