import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPagoCategoryComponent } from './registro-pago-category.component';

describe('RegistroPagoCategoryComponent', () => {
  let component: RegistroPagoCategoryComponent;
  let fixture: ComponentFixture<RegistroPagoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPagoCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPagoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
