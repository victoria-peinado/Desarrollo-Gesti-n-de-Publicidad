import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnDegradeComponent } from './btn-degrade.component.js';


describe('BtnDegradeComponent', () => {
  let component: BtnDegradeComponent;
  let fixture: ComponentFixture<BtnDegradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnDegradeComponent]
    });
    fixture = TestBed.createComponent(BtnDegradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
