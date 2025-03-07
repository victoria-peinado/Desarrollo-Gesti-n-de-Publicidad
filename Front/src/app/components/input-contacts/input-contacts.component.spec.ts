import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputContactsComponent } from './input-contacts.component';

describe('InputContactsComponent', () => {
  let component: InputContactsComponent;
  let fixture: ComponentFixture<InputContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
