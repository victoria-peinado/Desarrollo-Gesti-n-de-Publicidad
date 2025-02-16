import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-and-subtitle',
  templateUrl: './title-and-subtitle.component.html',
  styleUrl: './title-and-subtitle.component.scss'
})
export class TitleAndSubtitleComponent {
  @Input() title: string;
  @Input() subtitle: string;

  constructor() {
    this.title = '';
    this.subtitle = ''
  }

}
