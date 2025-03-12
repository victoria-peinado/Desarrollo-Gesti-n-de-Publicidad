import { Component, Output, EventEmitter } from '@angular/core';
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
  isNoRegular: boolean = false;
  customDates: string[] = [];
  blocksPerDay: { [key: string]: { id: number; time: string }[] } = {};
  private idCounter = 0;

  blockTimes = BLOCK_TIMES;

  @Output() regStructureChange = new EventEmitter<{ [key: string]: string[] }>();

  constructor() {
    this.initializeDays();
  }

  toggleMode() {
    if (this.isNoRegular) {
      this.blocksPerDay = {};
      this.customDates = [];
    } else {
      this.initializeDays();
    }

    this.emitRegStructure();
  }

  private initializeDays() {
    this.blocksPerDay = {};
    this.daysOfWeek.forEach(day => this.blocksPerDay[day] = []);
  }

  addCustomDate(event: any) {
    const date: Date = event.value;
    if (date) {
      const formattedDate = this.formatDate(date);
      if (!this.customDates.includes(formattedDate)) {
        this.customDates.push(formattedDate);
        this.blocksPerDay[formattedDate] = [];
        this.emitRegStructure();
      }
    }
  }

  addBlock(label: string) {
    this.blocksPerDay[label].push({ id: this.idCounter++, time: '' });
    this.emitRegStructure();
  }

  removeBlock(label: string, id: number) {
    this.blocksPerDay[label] = this.blocksPerDay[label].filter(b => b.id !== id);
    this.emitRegStructure();
  }

  updateBlock(label: string, id: number, value: string) {
    const block = this.blocksPerDay[label].find(b => b.id === id);
    if (block){ block.time = value;
    this.emitRegStructure(); }
  }

  generateRegStructure(): { [key: string]: string[] } {
    const result: { [key: string]: string[] } = {};
    const keys = this.isNoRegular ? this.customDates : this.daysOfWeek;

    for (const key of keys) {
      result[this.formatKey(key)] = this.blocksPerDay[key]
        .filter(block => block.time !== '')
        .map(block => this.timeToBlockId(block.time));
    }

    return result;
  }

  private formatKey(key: string): string {
    const map: { [key: string]: string } = {
      'Lunes': 'monday', 'Martes': 'tuesday', 'Miércoles': 'wednesday',
      'Jueves': 'thursday', 'Viernes': 'friday', 'Sábado': 'saturday', 'Domingo': 'sunday',
    };
    return this.isNoRegular ? key : map[key];
  }

  private timeToBlockId(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    return ((hour * 2) + (minute === 30 ? 1 : 0)).toString();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses en JS son 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  

  emitRegStructure() {
    const regStructure = this.generateRegStructure();
    console.log('regStructure', regStructure);
    this.regStructureChange.emit(regStructure);
  }

  
  
}
