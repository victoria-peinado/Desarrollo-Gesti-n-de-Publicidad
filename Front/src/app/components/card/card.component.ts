import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title: string = '';
  @Input() summary: string = '';
  @Input() options: string[] = [];
  @Input() imagePath: string = '';
  @Input() routerLinks: string[] = [];
}
