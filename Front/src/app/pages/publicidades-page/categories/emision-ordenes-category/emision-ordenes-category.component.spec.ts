import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmisionOrdenesCategoryComponent } from './emision-ordenes-category.component';

describe('EmisionOrdenesCategoryComponent', () => {
  let component: EmisionOrdenesCategoryComponent;
  let fixture: ComponentFixture<EmisionOrdenesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmisionOrdenesCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmisionOrdenesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
