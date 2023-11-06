import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenFechaComponent } from './orden-fecha.component';

describe('OrdenFechaComponent', () => {
  let component: OrdenFechaComponent;
  let fixture: ComponentFixture<OrdenFechaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenFechaComponent]
    });
    fixture = TestBed.createComponent(OrdenFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
