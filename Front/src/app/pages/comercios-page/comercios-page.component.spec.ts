import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComerciosPageComponent } from './comercios-page.component';

describe('ComerciosPageComponent', () => {
  let component: ComerciosPageComponent;
  let fixture: ComponentFixture<ComerciosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComerciosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComerciosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
