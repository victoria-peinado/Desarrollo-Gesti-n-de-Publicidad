import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSelectionComponent } from './block-selection.component';

describe('BlockSelectionComponent', () => {
  let component: BlockSelectionComponent;
  let fixture: ComponentFixture<BlockSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
