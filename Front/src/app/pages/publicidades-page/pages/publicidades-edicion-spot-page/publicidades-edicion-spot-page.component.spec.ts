import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicidadesEdicionSpotPageComponent } from './publicidades-edicion-spot-page.component';

describe('PublicidadesEdicionSpotPageComponent', () => {
  let component: PublicidadesEdicionSpotPageComponent;
  let fixture: ComponentFixture<PublicidadesEdicionSpotPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicidadesEdicionSpotPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicidadesEdicionSpotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
