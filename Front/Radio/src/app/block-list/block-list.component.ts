import { Component, OnInit, Input } from '@angular/core';
import { Block } from '../models/block';
import { blockPriceHistory } from '../models/block-price-history';
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

interface CombinedElement {
  idBlock:string,
  number:string,
  startTimeBlock:String,
  precio: number;
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
  elements: blockPriceHistory[] = [];
  allElements: blockPriceHistory[] = [];
  lastElements: blockPriceHistory[] = [];
  blocks: Block[] = [];
  combinedElements: CombinedElement[] = [];

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

  constructor(private myDataService: MyDataService) {}

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
        next: (response: ApiResponse<blockPriceHistory[]>) => {
          if (Array.isArray(response.data)) {
            this.allElements = response.data;

            // Filtra el historial para obtener el último para cada bloque
            this.lastElements = this.blocks
              .map((block) => {
                const blockHistories = this.allElements
                  .filter((history) => history.idBlock === block._id)
                  .sort((a, b) => {
                    const dateA = parse(
                      a.startTime,
                      'dd/MM/yyyy, HH:mm:ss',
                      new Date()
                    );
                    const dateB = parse(
                      b.startTime,
                      'dd/MM/yyyy, HH:mm:ss',
                      new Date()
                    );
                    return dateB.getTime() - dateA.getTime();
                  });

                return blockHistories.length > 0 ? blockHistories[0] : null;
              })
              .filter((history) => history !== null) as blockPriceHistory[];

            // Llama a la función separada para combinar los elementos
            this.combineElements();
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

  // Función para combinar this.blocks con this.lastElements
  combineElements() {
    this.combinedElements = this.blocks.map((block) => {
      const lastHistory = this.lastElements.find(
        (history) => history?.idBlock === block._id
      );

      return {
        number: block.numBlock,
        startTimeBlock: block.startTime || '',
        precio: lastHistory?.precio || 0,
        startTime: lastHistory
          ? parse(
              lastHistory.startTime,
              'dd/MM/yyyy, HH:mm:ss',
              new Date()
            ).toLocaleDateString()
          : '',
        idBlock: block._id || '',
        id: lastHistory?._id || '',
      };
    }) as CombinedElement[];
  }

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
    const filterValue = this.normalizeString(
      this.inputfilter.toLowerCase().trim()
    );

    if (!filterValue) {
      this.elements = [...this.allElements];
    } else {
      this.elements = this.allElements.filter((element) =>
        Object.values(element).some(
          (value) =>
            value &&
            this.normalizeString(value.toString().toLowerCase()).includes(
              filterValue
            )
        )
      );
    }

    if (this.elements.length === 0) {
      this.elements = [
        {
          idBlock: 'no coincide con la búsqueda',
          startTime: '',
          precio: 0,
        },
      ];
    }
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

  toggleCardContent(element: CombinedElement) {
    this.rotationAngles[element.idBlock] =
      (this.rotationAngles[element.idBlock] || 0) + 180;
    this.visibleContent[element.idBlock] =
      !this.visibleContent[element.idBlock];
    console.log(this.visibleContent[element.idBlock]);
  }

  isScreenSmall(): boolean {
    return window.innerWidth <= 640;
  }
}
