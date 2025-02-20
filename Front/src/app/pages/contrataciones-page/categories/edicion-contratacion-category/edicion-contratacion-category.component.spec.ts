import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionContratacionCategoryComponent } from './edicion-contratacion-category.component';

describe('EdicionContratacionCategoryComponent', () => {
  let component: EdicionContratacionCategoryComponent;
  let fixture: ComponentFixture<EdicionContratacionCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionContratacionCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionContratacionCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
