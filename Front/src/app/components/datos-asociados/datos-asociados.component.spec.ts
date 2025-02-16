import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAsociadosComponent } from './datos-asociados.component';

describe('DatosAsociadosComponent', () => {
  let component: DatosAsociadosComponent;
  let fixture: ComponentFixture<DatosAsociadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosAsociadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
