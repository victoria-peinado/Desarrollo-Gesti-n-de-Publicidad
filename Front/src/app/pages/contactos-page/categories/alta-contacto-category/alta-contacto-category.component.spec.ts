import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaContactoCategoryComponent } from './alta-contacto-category.component';

describe('AltaContactoCategoryComponent', () => {
  let component: AltaContactoCategoryComponent;
  let fixture: ComponentFixture<AltaContactoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltaContactoCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltaContactoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
