import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnGuardarCambiosComponent } from './btn-guardar-cambios.component';

describe('BtnGuardarCambiosComponent', () => {
  let component: BtnGuardarCambiosComponent;
  let fixture: ComponentFixture<BtnGuardarCambiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BtnGuardarCambiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnGuardarCambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
