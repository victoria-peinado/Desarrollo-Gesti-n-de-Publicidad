import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquesPageComponent } from './bloques-page.component';

describe('BloquesPageComponent', () => {
  let component: BloquesPageComponent;
  let fixture: ComponentFixture<BloquesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloquesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloquesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
