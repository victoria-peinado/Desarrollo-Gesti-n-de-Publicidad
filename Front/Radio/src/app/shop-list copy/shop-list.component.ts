import { Component, OnInit,Input } from '@angular/core';
import { Trade } from 'src/app/models/trade';
import { MyDataService } from 'src/app/services/my-data.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
  animations: [
    trigger('rotateArrow', [
      state('down', style({ transform: 'rotate(0deg)' })),
      state('up', style({ transform: 'rotate(180deg)' })),
      transition('down <=> up', animate('0.2s ease-in-out')),
    ]),
  ],
})
export class ShopListComponent implements OnInit {
  @Input() cuit: string = '';

  inputfilter: string = '';
  displayedColumns: string[] = ['fantasyName', 'address', 'billingType', 'mail', 'usualPaymentForm', 'type'];
  trades: Trade[] = [];
  allTrades: Trade[] = [];
  band: boolean = true;
  mostrarNuevoComercio = false;
  continuarNuevoComercio = false;
  // lógica transición flecha y ordenamiento
  textoMarcado: boolean = false;
  click: number = 0;
  salb: boolean = false;
  entb: boolean = false;
  entro: boolean = true;

  visibleContent: { [key: string]: boolean } = {};
  sortColumnKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  rotationAngles: { [key: string]: number } = {};

  constructor(  private _tradeService: MyDataService  ) {
    //this.cuit = '11111111111';//this.sharedDataService.getCuit();
  }

  ngOnInit(): void {
    this.obtenerComercios();
  }


    obtenerComercios() {
    if (this.cuit) {
      this._tradeService.getTradesByCuit(this.cuit).subscribe({
        next: (data) => {
          this.allTrades = data.slice();
          this.trades = data;
        },
        error: (error) => {
          console.log(error);
          this.trades = [];

        },
      });
    } else {
      console.error('Cuit no proporcionado.');
    }
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
    if(this.click == 0){
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
    if(this.click ==0){
      console.log('entró');
      this.entro = true;
      this.entb = true;
    }
  }



  filterTable() {
    const filterValue = this.normalizeString(this.inputfilter.toLowerCase().trim());

    if (!filterValue) {
      this.trades = [...this.allTrades];
    } else {
      this.trades = this.allTrades.filter((trade) =>
        Object.values(trade).some(
          (value) =>
            value &&
            this.normalizeString(value.toString().toLowerCase()).includes(filterValue)
        )
      );
    }

    if (this.trades.length === 0) {
      this.trades = [{ fantasyName: 'no coincide con la búsqueda', address: '', billingType: '', mail: '', usualPaymentForm: '', type: '', billingHolderId: '' }];
    }
  }

  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  sortColumn(columnKey: string) {
    if (this.sortColumnKey === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

      if (this.sortOrder === 'asc') {
        this.trades = this.allTrades.slice();
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
      const compareFunction = (a: Trade, b: Trade, key: keyof Trade) => {
        const valueA = (a[key] || '').toString().toLowerCase();
        const valueB = (b[key] || '').toString().toLowerCase();
        return this.sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      };

      if (Object.keys(this.trades[0]).includes(this.sortColumnKey)) {
        this.trades.sort((a, b) => compareFunction(a, b, this.sortColumnKey as keyof Trade));
      }
    }
  }




  toggleCardContent(trade: Trade) {
    this.rotationAngles[trade.fantasyName] = (this.rotationAngles[trade.fantasyName] || 0) + 180;
    this.visibleContent[trade.fantasyName] = !this.visibleContent[trade.fantasyName];
  }

  isScreenSmall(): boolean {
    return window.innerWidth <= 640;
  }

}