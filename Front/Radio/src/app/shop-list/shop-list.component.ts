import { Component, OnInit,Input } from '@angular/core';
import { Shop } from 'src/app/models/shop';
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
  shops: Shop[] = [];
  allshops: Shop[] = [];
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

  constructor(  private _shopService: MyDataService  ) {
    //this.cuit = '11111111111';//this.sharedDataService.getCuit();
  }

  ngOnInit(): void {
    this.obtenerComercios();
  }


    obtenerComercios() {
    if (this.cuit) {
      this._shopService.getShopsByCuit(this.cuit).subscribe({
        next: (data) => {
          this.allshops = data.slice();
          this.shops = data;
        },
        error: (error) => {
          console.log(error);
          this.shops = [];

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

  
  output() {
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

  input() {
    if(this.click ==0){
      console.log('entró');
      this.entro = true;
      this.entb = true;
    }
  }



  filterTable() {
    const filterValue = this.normalizeString(this.inputfilter.toLowerCase().trim());

    if (!filterValue) {
      this.shops = [...this.allshops];
    } else {
      this.shops = this.allshops.filter((Shop) =>
        Object.values(Shop).some(
          (value) =>
            value &&
            this.normalizeString(value.toString().toLowerCase()).includes(filterValue)
        )
      );
    }

    if (this.shops.length === 0) {
      this.shops = [{ regDate: new Date(), fantasyName: 'no coincide con la búsqueda', address: '', billingType: '', mail: '', usualPaymentForm: '', type: '', owner: '', contact: '', contracts: [''] }];
    }
  }

  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  sortColumn(columnKey: string) {
    if (this.sortColumnKey === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

      if (this.sortOrder === 'asc') {
        this.shops = this.allshops.slice();
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
      const compareFunction = (a: Shop, b: Shop, key: keyof Shop) => {
        const valueA = (a[key] || '').toString().toLowerCase();
        const valueB = (b[key] || '').toString().toLowerCase();
        return this.sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      };

      if (Object.keys(this.shops[0]).includes(this.sortColumnKey)) {
        this.shops.sort((a, b) => compareFunction(a, b, this.sortColumnKey as keyof Shop));
      }
    }
  }




  toggleCardContent(Shop: Shop) {
    this.rotationAngles[Shop.fantasyName] = (this.rotationAngles[Shop.fantasyName] || 0) + 180;
    this.visibleContent[Shop.fantasyName] = !this.visibleContent[Shop.fantasyName];
  }

  isScreenSmall(): boolean {
    return window.innerWidth <= 640;
  }

}