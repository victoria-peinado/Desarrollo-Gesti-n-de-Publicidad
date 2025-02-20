import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPublicitarioCategoryComponent } from './listado-publicitario-category.component';

describe('ListadoPublicitarioCategoryComponent', () => {
  let component: ListadoPublicitarioCategoryComponent;
  let fixture: ComponentFixture<ListadoPublicitarioCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoPublicitarioCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoPublicitarioCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
