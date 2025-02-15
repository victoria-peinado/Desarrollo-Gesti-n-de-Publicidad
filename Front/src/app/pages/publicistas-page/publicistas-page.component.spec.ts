import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicistasPageComponent } from './publicistas-page.component';

describe('PublicistasPageComponent', () => {
  let component: PublicistasPageComponent;
  let fixture: ComponentFixture<PublicistasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicistasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicistasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
