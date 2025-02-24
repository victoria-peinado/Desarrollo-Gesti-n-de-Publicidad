import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsuncionPageComponent } from './asuncion-page.component';

describe('AsuncionPageComponent', () => {
  let component: AsuncionPageComponent;
  let fixture: ComponentFixture<AsuncionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsuncionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsuncionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
