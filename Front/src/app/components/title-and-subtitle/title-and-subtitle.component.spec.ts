import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleAndSubtitleComponent } from './title-and-subtitle.component';

describe('TitleAndSubtitleComponent', () => {
  let component: TitleAndSubtitleComponent;
  let fixture: ComponentFixture<TitleAndSubtitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleAndSubtitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleAndSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
