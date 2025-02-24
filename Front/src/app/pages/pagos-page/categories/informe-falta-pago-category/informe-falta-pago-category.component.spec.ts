import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeFaltaPagoCategoryComponent } from './informe-falta-pago-category.component';

describe('InformeFaltaPagoCategoryComponent', () => {
  let component: InformeFaltaPagoCategoryComponent;
  let fixture: ComponentFixture<InformeFaltaPagoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformeFaltaPagoCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeFaltaPagoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
