import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionSpotCategoryComponent } from './edicion-spot-category.component';

describe('EdicionSpotCategoryComponent', () => {
  let component: EdicionSpotCategoryComponent;
  let fixture: ComponentFixture<EdicionSpotCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdicionSpotCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicionSpotCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
