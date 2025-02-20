import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionTitularCategoryComponent } from './edicion-titular-category.component';

describe('EdicionTitularCategoryComponent', () => {
  let component: EdicionTitularCategoryComponent;
  let fixture: ComponentFixture<EdicionTitularCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionTitularCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionTitularCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
