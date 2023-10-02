import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaComercioComponent } from './alta-comercio.component';

describe('AltaComercioComponent', () => {
  let component: AltaComercioComponent;
  let fixture: ComponentFixture<AltaComercioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AltaComercioComponent]
    });
    fixture = TestBed.createComponent(AltaComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
