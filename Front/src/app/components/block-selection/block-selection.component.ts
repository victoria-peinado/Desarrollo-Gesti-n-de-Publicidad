import { Component, Output, EventEmitter, input, effect, Input,  SimpleChange, output, signal } from '@angular/core';
import { BLOCK_TIMES } from 'src/app/constants/constants';
import { trigger, transition, style, animate } from '@angular/animations';
import { addDays, eachDayOfInterval, endOfMonth, format, parse } from 'date-fns';
import { tap } from 'rxjs';

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
  regularCampo = false
  customDates: string[] = [];



  blocksPerDay: { [key: string]: { id: number; time: string }[] } = {};

  private idCounter = 0;

  blockTimes = BLOCK_TIMES;


  month = input.required<string>()

  

  datesOfMonth: Date[] = [];
  datesOfMonthString: string[] =[]
  

  formatFunction = (date: Date) => { return format(date, 'dd') }

  @Output() datosEmitidos = new EventEmitter<boolean>()

  @Output() emmiterNoRegular = new EventEmitter<boolean>();

  @Output() regStructureChange = new EventEmitter<{ [key: string]: string[] }>();

  @Output() notRegularStructure = new EventEmitter<[string, string[]][]>(); //date en format yyyy-mm-dd y arreglo blockNum

  constructor() {
    this.initializeDays(this.daysOfWeek);


    effect(() => {
      this.diasDelMesSeleccionado()
    })
    
    //effect(() => { this.changeEmitter() })
    

  }

  sanitizarYemitir() {
    if (!this.regularCampo) {
      this.emitRegStructure()
    } else { this.emitNotRegStructure() }
    this.datosEmitidos.emit(true) 
  }

  changeEmitter(){
    //console.log('Estoy emitiendo: ', this.emmiterNoRegular )
    this.emmiterNoRegular
    .pipe(tap((valor) => console.log('Valor emitido:', valor)))
    .subscribe();
    this.emmiterNoRegular.emit(this.regularCampo)
  }


  toggleMode() {
    this.changeEmitter()
    if (this.regularCampo) {
      //this.diasDelMesSeleccionado()
      //funcion para limpiar
      this.initializeDays(this.datesOfMonthString);
      
    } else {
      this.initializeDays(this.daysOfWeek);
    }
  }

  private initializeDays(keysArray: string[]) {
    this.blocksPerDay = {};
    keysArray.forEach(day => this.blocksPerDay[day] = []);
  }

  // addCustomDate(event: any) {
  //   const date: Date = event.value;
  //   if (date) {
  //     const formattedDate = this.formatDate(date);
  //     if (!this.customDates.includes(formattedDate)) {
  //       this.customDates.push(formattedDate);
  //       this.blocksPerDay[formattedDate] = [];
  //     }
  //   }
  // }

  addBlock(label: string) {
    this.blocksPerDay[label].push({ id: this.idCounter++, time: '' });
    
  }

  removeBlock(label: string, id: number) {
    this.blocksPerDay[label] = this.blocksPerDay[label].filter(b => b.id !== id);
    
  }

  updateBlock(label: string, id: number, value: string) {
    const block = this.blocksPerDay[label].find(b => b.id === id);
    if (block) block.time = value;
  }

  generateRegStructure(): { [key: string]: string[] } {
    const result: { [key: string]: string[] } = {};
    const keys = this.regularCampo ? this.customDates : this.daysOfWeek;

    for (const key of keys) {
      result[this.formatKey(key)] = this.blocksPerDay[key]
        .filter(block => block.time !== '')
        .map(block => this.timeToBlockId(block.time));
    }

    return result;
  }

  // blocksPerDay: { [key: string]: { id: number; time: string }[] } = {}; 
  //                   stringDate:     usoInterno    paraMapearConBlockNum
  generateNotRegularStructure(){
    const notRegularStructure: [string, string[]][] = []
    const data = this.blocksPerDay
    const dateStrings = Object.keys(data)
    for (const dayString of dateStrings){
      if (data[dayString].length>0){
      const day = new Date(dayString)
      const parseDay = format(day, 'yyyy-MM-dd') //asi se va al back
      const blocksNumsOfDay = data[dayString].map((obj: { id: number, time: string }) => { return this.timeToBlockId(obj.time)}) //arreglo de bloques num que van en el dia
      notRegularStructure.push([parseDay, blocksNumsOfDay]) } 
      else {delete data[dayString]}
    }
    console.log(notRegularStructure)
    return notRegularStructure
  }

  private formatKey(key: string): string {
    const map: { [key: string]: string } = {
      'Lunes': 'monday', 'Martes': 'tuesday', 'Miércoles': 'wednesday',
      'Jueves': 'thursday', 'Viernes': 'friday', 'Sábado': 'saturday', 'Domingo': 'sunday',
    };
    return this.regularCampo ? key : map[key];
  }

    //devuelve el numBlock dada un timeStart
  private timeToBlockId(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    return ((hour * 2) + (minute === 30 ? 1 : 0)).toString();
  }

  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd')
  }

  emitNotRegStructure(){
    const notRegularStructure = this.generateNotRegularStructure()
    this.notRegularStructure.emit(notRegularStructure)

  }

  emitRegStructure() {
    const regStructure = this.generateRegStructure();
    this.regStructureChange.emit(regStructure);
  }

  diasDelMesSeleccionado() {
    let month = this.month()
    const today = new Date()
    const actualMonth = format(today, 'MM-yyyy')
    if (!this.month()) { month = actualMonth }
    if (actualMonth == month) {
      //si es del mismo mes listo desde mañana hasta el final del mes. 
      const lastDay = endOfMonth(today)
      const tomorrow = addDays(today, 1)
      this.datesOfMonth = eachDayOfInterval({ start: tomorrow, end: lastDay })
    } else {
      const firstDay = parse((month + '-01'), 'MM-yyyy-dd', new Date())
      const lastDay = endOfMonth(firstDay)
      this.datesOfMonth = eachDayOfInterval({ start: firstDay, end: lastDay })
    }
    this.datesOfMonth.forEach((day) => { this.datesOfMonthString.push(day.toString())})
    console.log(this.datesOfMonth)
  }


}

