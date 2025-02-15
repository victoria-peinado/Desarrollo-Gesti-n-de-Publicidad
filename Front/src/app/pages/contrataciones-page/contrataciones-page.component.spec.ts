import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratacionesPageComponent } from './contrataciones-page.component';

describe('ContratacionesPageComponent', () => {
  let component: ContratacionesPageComponent;
  let fixture: ComponentFixture<ContratacionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratacionesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratacionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
