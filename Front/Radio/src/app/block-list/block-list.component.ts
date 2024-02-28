import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../models/block';
import { Price} from '../models/price';
import { MyDataService } from 'src/app/services/my-data.service';
import { take, tap } from 'rxjs/operators';
import { ApiResponse } from '../models/api_response.js';
import { parse } from 'date-fns';
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
interface CombinedElement {
  idBlock:string,
  number:string,
  startTimeBlock:String,
  value: number;
  startTime: string;
  id:string
}

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
  elements: Price[] = [];
  allElements: Price[] = [];
  lastElements: Price[] = [];
  blocks: Block[] = [];
  combinedElements: CombinedElement[] = [];
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
  }

  //get the blocks of the database
  getBlocks() {
    this.myDataService
      .getBlocks()
      .pipe(take(1))
      .subscribe({
        next: (data: ApiResponse<Block[]>) => {
          this.blocks = data.data;
        },
        error: (error: any) => {
          console.error('Error fetching blocks:', error);
        },
      } as any);
  }
  //get the last history of the selected block
  getHistory() {
    this.myDataService
      .getHistory()
      .pipe(take(1))
      .subscribe({
        next: (response: ApiResponse<Price[]>) => {
          console.log(response);
          if (Array.isArray(response.data)) {
            this.allElements = response.data;

            // Filtra el historial para obtener el último para cada bloque
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
            this.allElements = this.lastElements;
            // Ordenar lastElements por el número de bloque
            this.lastElements.sort((a, b) => {
              const numBlockA = parseInt(a.block.numBlock);
              const numBlockB = parseInt(b.block.numBlock);
              return numBlockA - numBlockB;
            });

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
  //   this.combinedElements = this.blocks.map((block) => {
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
  //   }) as CombinedElement[];
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
      console.log('salió');
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
      console.log('entró');
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
      console.log(element.regDate);
      console.log(inputMinDate);
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
      const compareFunction = (
        a: CombinedElement,
        b: CombinedElement,
        key: keyof CombinedElement
      ) => {
        const valueA = (a[key] || '').toString().toLowerCase();
        const valueB = (b[key] || '').toString().toLowerCase();
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      };

      if (Object.keys(this.combinedElements[0]).includes(this.sortColumnKey)) {
        this.combinedElements.sort((a, b) =>
          compareFunction(a, b, this.sortColumnKey as keyof CombinedElement)
        );
      }
    }
  }

  toggleCardContent(element: Price) {
    // Ensure element.block is defined before accessing its properties
    if (element.block) {
      // Use element.block.numBlock or any other property instead of element.idBlock
      this.rotationAngles[element.block.numBlock] =
        (this.rotationAngles[element.block.numBlock] || 0) + 180;
      this.visibleContent[element.block.numBlock] =
        !this.visibleContent[element.block.numBlock];
      console.log(this.visibleContent[element.block.numBlock]);
    }
  }

  isScreenSmall(): boolean {
    return window.innerWidth <= 640;
  }
}
