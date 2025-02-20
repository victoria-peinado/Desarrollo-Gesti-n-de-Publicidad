import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComerciosCategoryComponent } from './listado-comercios-category.component';

describe('ListadoComerciosCategoryComponent', () => {
  let component: ListadoComerciosCategoryComponent;
  let fixture: ComponentFixture<ListadoComerciosCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListadoComerciosCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoComerciosCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
