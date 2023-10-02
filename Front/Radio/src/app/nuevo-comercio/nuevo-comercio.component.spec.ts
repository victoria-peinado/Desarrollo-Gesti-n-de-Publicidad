import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoComercioComponent } from './nuevo-comercio.component';

describe('NuevoComercioComponent', () => {
  let component: NuevoComercioComponent;
  let fixture: ComponentFixture<NuevoComercioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoComercioComponent]
    });
    fixture = TestBed.createComponent(NuevoComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
