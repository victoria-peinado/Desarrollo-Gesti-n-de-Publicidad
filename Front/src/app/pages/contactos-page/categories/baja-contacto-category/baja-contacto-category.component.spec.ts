import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaContactoCategoryComponent } from './baja-contacto-category.component';

describe('BajaContactoCategoryComponent', () => {
  let component: BajaContactoCategoryComponent;
  let fixture: ComponentFixture<BajaContactoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BajaContactoCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaContactoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
