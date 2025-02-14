import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionComercioComponent } from './actualizacion-comercio.component';

describe('ActualizacionComercioComponent', () => {
  let component: ActualizacionComercioComponent;
  let fixture: ComponentFixture<ActualizacionComercioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizacionComercioComponent]
    });
    fixture = TestBed.createComponent(ActualizacionComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
