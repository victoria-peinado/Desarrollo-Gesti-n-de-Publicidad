import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosPageComponent } from './contactos-page.component';

describe('ContactosPageComponent', () => {
  let component: ContactosPageComponent;
  let fixture: ComponentFixture<ContactosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
