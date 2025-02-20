import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionContactoCategoryComponent } from './edicion-contacto-category.component';

describe('EdicionContactoCategoryComponent', () => {
  let component: EdicionContactoCategoryComponent;
  let fixture: ComponentFixture<EdicionContactoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionContactoCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionContactoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
