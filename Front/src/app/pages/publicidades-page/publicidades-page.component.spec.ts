import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicidadesPageComponent } from './publicidades-page.component';

describe('PublicidadesPageComponent', () => {
  let component: PublicidadesPageComponent;
  let fixture: ComponentFixture<PublicidadesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicidadesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicidadesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
