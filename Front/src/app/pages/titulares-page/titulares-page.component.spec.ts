import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitularesPageComponent } from './titulares-page.component';

describe('TitularesPageComponent', () => {
  let component: TitularesPageComponent;
  let fixture: ComponentFixture<TitularesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitularesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitularesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
