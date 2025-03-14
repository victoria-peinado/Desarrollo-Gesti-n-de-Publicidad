import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../../models/block';
import { Price} from '../../models/price';
import { MyDataService } from 'src/app/services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { ApiResponse } from '../../models/api_response.js';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss'],
  animations: [
    trigger('rotateArrow', [
      state('down', style({ transform: 'rotate(0deg)' })),
      state('up', style({ transform: 'rotate(180deg)' })),
      transition('down <=> up', animate('0.2s ease-in-out')),
    ]),
  ],
})
export class BlockListComponent implements OnInit {
  @Input() cuit: string = '';

  inputfilter: string = '';
  elements: Price[] |any= [];
  allElements: Price[] = [];
  lastElements: Price[] |any = [];
  blocks: Block[] = [];

  //form to filter the table
  form: FormGroup;
  // lógica transición flecha y ordenamiento
  textoMarcado: boolean = false;
  click: number = 0;
  salb: boolean = false;
  entb: boolean = false;
  entro: boolean = true;
  // Objeto para controlar la visibilidad del contenido de las tarjetas y ángulos de rotación
  visibleContent: { [key: string]: boolean } = {};
  sortColumnKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  rotationAngles: { [key: string]: number } = {};

  constructor(private myDataService: MyDataService, private fb: FormBuilder) {
    this.form = this.fb.group({
      inputfilter: [
        '',
        [Validators.min(0), Validators.pattern('[0-9]*'), Validators.max(48)],
      ],
      inputMinPrice: ['', [Validators.min(0), Validators.pattern('[0-9]*')]],
      inputMaxPrice: ['', [Validators.min(0), Validators.pattern('[0-9]*')]],
      inputMinDate: [''],
      inputMaxDate: [''],
    });
  }

  ngOnInit(): void {
   
    this.getBlocks();
    this.getHistory();
    console.log('Blocks:', this.blocks)
    console.log('History:', this.allElements);
  }

  //get the blocks of the database
//get the blocks of the database
getBlocks() {
  this.myDataService
    .getBlocks()
    .pipe(take(1))
    .subscribe({
      next: (data: ApiResponse<Block[]>) => {
        this.blocks = data.data;
        console.log('Blockss:', this.blocks);
        this.getHistory(); // Llama a getHistory() después de cargar los bloques
      },
      error: (error: any) => {
        console.error('Error fetching blocks:', error);
      },
    } as any);
}
  //   //get the blocks of the database
  // getBlocks() {
  //   this.myDataService
  //     .getBlocks()
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (data: ApiResponse<Block[]>) => {
  //         console.log(data.data);
  //         this.blocks = data.data.sort((a, b) => {
  //           const numBlockA = parseInt(a.numBlock);
  //           const numBlockB = parseInt(b.numBlock);
  //           return numBlockA - numBlockB;
  //         });
  //       },
  //       error: (error: any) => {
  //         console.error('Error fetching blocks:', error);
  //       },
  //     } as any);
  // }
  //get the last history of the selected block
  getHistory() {
  this.myDataService
    .getHistory()
    .pipe(take(1))
    .subscribe({
      next: (response: ApiResponse<Price[]>) => {
        if (Array.isArray(response.data)) {
          this.allElements = response.data;
          console.log('Historyall:', this.allElements);
          // Filtra el historial para obtener el último para cada bloque
          console.log('Blocks:', this.blocks);
          this.lastElements = this.blocks
            .map((block) => {
              const blockHistories = this.allElements
                .filter((history) => history.block.id === block.id)
                .sort(
                  (a, b) =>
                    new Date(b.regDate).getTime() -
                    new Date(a.regDate).getTime()
                );

              return blockHistories.length > 0 ? blockHistories[0] : null;
            })
            .filter((history) => history !== null) as Price[];

            this.lastElements.forEach((element: any) => {
            const dateObject = new Date(element.regDate);
            element.formattedRegDate = dateObject.toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
          });
          this.allElements = this.lastElements;
          // Ordenar lastElements por el número de bloque
          this.lastElements.sort((a:any, b:any) => {
            const numBlockA = parseInt(a.block.numBlock);
            const numBlockB = parseInt(b.block.numBlock);
            return numBlockA - numBlockB;
          });
          console.log('History:', this.lastElements);
          // Llama a la función separada para combinar los elementos
          // this.combineElements();
        } else {
          console.error(
            'The "data" property is not an array in the response.'
          );
        }
      },
      error: (error: any) => {
        console.error('Error fetching history:', error);
      },
    } as any);
}
  
  // // Función para combinar this.blocks con this.lastElements
  // combineElements() {
  //   this.Prices = this.blocks.map((block) => {
  //     const lastHistory = this.lastElements.find(
  //       (history) => history?.idBlock === block.id
  //     );

  //     return {
  //       number: block.numBlock,
  //       startTimeBlock: block.startTime || '',
  //       value: lastHistory?.value || 0,
  //       startTime: lastHistory
  //         ? parse(
  //             lastHistory.startTime,
  //             'dd/MM/yyyy, HH:mm:ss',
  //             new Date()
  //           ).toLocaleDateString()
  //         : '',
  //       idBlock: block.id || '',
  //       id: lastHistory?.id || '',
  //     };
  //   }) as Price[];
  // }

  marcarNegrita(key: string) {
    this.click = (this.click + 1) % 3;

    if (this.click === 1) {
      this.textoMarcado = !this.textoMarcado;
    }

    if (this.click === 0) {
      this.entro = true;
      this.entb = true;
    } else {
      this.entro = false;
    }

    this.sortColumn(key);
  }

  salida() {
    if (this.click == 0) {
      this.entb = false;
      this.salb = true;

      // Restablecer posición inicial después de un tiempo suficiente para que termine la transición
      setTimeout(() => {
        this.salb = false;
      }, 200); // 300ms es la duración de la transición
    }
  }

  entrada() {
    if (this.click == 0) {
      this.entro = true;
      this.entb = true;
    }
  }

  filterTable() {
    const inputfilter = this.form.get('inputfilter')?.value;
    const inputMinPrice = this.form.get('inputMinPrice')?.value;
    const inputMaxPrice = this.form.get('inputMaxPrice')?.value;
    const inputMinDate = this.form.get('inputMinDate')?.value;
    const inputMaxDate = this.form.get('inputMaxDate')?.value;

    this.lastElements = this.allElements.filter((element) => {
      let passesFilter = true;

      // Filter by block
      if (inputfilter && element.block.numBlock !== inputfilter) {
        passesFilter = false;
      }

      // Filter by minimum price
      if (inputMinPrice && element.value < inputMinPrice) {
        passesFilter = false;
      }

      // Filter by maximum price
      if (inputMaxPrice && element.value > inputMaxPrice) {
        passesFilter = false;
      }

      // Filter by minimum date
      if (inputMinDate && new Date(element.regDate) < new Date(inputMinDate)) {
        passesFilter = false;
      }

      // Filter by maximum date
      if (inputMaxDate && new Date(element.regDate) > new Date(inputMaxDate)) {
        passesFilter = false;
      }

      return passesFilter;
    });
  }

  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  sortColumn(columnKey: string) {
    if (this.sortColumnKey === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

      if (this.sortOrder === 'asc') {
        this.elements = this.allElements.slice();
        this.sortColumnKey = '';
      }
    } else {
      this.sortOrder = 'asc';
      this.sortColumnKey = columnKey;
    }

    this.sortTable();
  }

  sortTable() {

    if (this.sortColumnKey) {
      const compareFunction = (a: Price, b: Price, key: string) => {
        const valueA = this.getPropertyValue(a, key);
        const valueB = this.getPropertyValue(b, key);
          if ( !isNaN(valueA)&& !isNaN(valueB)) {
            return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
          }

        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      };

      // Verificar si la clave de clasificación es válida para un elemento de Price
      // Si es una propiedad anidada, la función debería manejarla de manera diferente
      const isNestedKey = this.sortColumnKey.includes('.');
      if (isNestedKey) {
        this.lastElements.sort((a: any, b: any) =>
          compareFunction(a, b, this.sortColumnKey)
        );
      } else {
        if (Object.keys(this.lastElements[0]).includes(this.sortColumnKey)) {
          this.lastElements.sort((a: any, b: any) =>
            compareFunction(a, b, this.sortColumnKey as keyof Price)
          );
        }
      }
    }
  }

  getPropertyValue(obj: any, key: string): any {
    return key
      .split('.')
      .reduce((o, i) => o[i], obj)
      .toString()
      .toLowerCase();
  }


  toggleCardContent(element: Price) {
    // Ensure element.block is defined before accessing its properties
    if (element.block) {
      // Use element.block.numBlock or any other property instead of element.idBlock
      this.rotationAngles[element.block.numBlock] =
        (this.rotationAngles[element.block.numBlock] || 0) + 180;
      this.visibleContent[element.block.numBlock] =
        !this.visibleContent[element.block.numBlock];
    }
  }

  isScreenSmall(): boolean {
    return window.innerWidth <= 640;
  }
}
