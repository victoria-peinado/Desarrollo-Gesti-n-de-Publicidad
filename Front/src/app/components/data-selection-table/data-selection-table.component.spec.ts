import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectionTableComponent } from './data-selection-table.component';

describe('DataSelectionTableComponent', () => {
  let component: DataSelectionTableComponent;
  let fixture: ComponentFixture<DataSelectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataSelectionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
