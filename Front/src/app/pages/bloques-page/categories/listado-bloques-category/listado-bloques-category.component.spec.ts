import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoBloquesCategoryComponent } from './listado-bloques-category.component';

describe('ListadoBloquesCategoryComponent', () => {
  let component: ListadoBloquesCategoryComponent;
  let fixture: ComponentFixture<ListadoBloquesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoBloquesCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoBloquesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
