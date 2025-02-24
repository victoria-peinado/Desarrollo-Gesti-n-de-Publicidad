import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenBLoqueComponent } from './orden-bloque.component';

describe('OrdenBLoqueComponent', () => {
  let component: OrdenBLoqueComponent;
  let fixture: ComponentFixture<OrdenBLoqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenBLoqueComponent]
    });
    fixture = TestBed.createComponent(OrdenBLoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
