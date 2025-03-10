import { Component } from '@angular/core';
import { BLOCK_TIMES } from 'src/app/constants/constants';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-block-selection',
  templateUrl: './block-selection.component.html',
  styleUrls: ['./block-selection.component.scss'],
  animations: [
    trigger('blockAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ]),
    ])
  ],
})
export class BlockSelectionComponent {
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  blocksPerDay: { [key: string]: { id: number; time: string }[] } = {};
  private idCounter = 0;

  blockTimes = BLOCK_TIMES;

  constructor() {
    this.daysOfWeek.forEach(day => {
      this.blocksPerDay[day] = [];
    });
  }

  addBlock(day: string) {
    this.blocksPerDay[day].push({ id: this.idCounter++, time: '' });
  }

  updateBlock(day: string, id: number, value: string) {
    const block = this.blocksPerDay[day].find(b => b.id === id);
    if (block) {
      block.time = value;
    }
  }

  removeBlock(day: string, id: number) {
    this.blocksPerDay[day] = this.blocksPerDay[day].filter(b => b.id !== id);
  }

  showBlocks() {
    console.log('Bloques por día:', this.blocksPerDay);
  }
  
}
