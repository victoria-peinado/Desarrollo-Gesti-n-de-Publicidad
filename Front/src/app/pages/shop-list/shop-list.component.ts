import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Shop } from 'src/app/models/shop';
import { MyDataService } from 'src/app/services/my-data.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { EditShopComponent } from '../edit-shop/edit-shop.component';

type allowedColumns = 'fantasyName' | 'address' | 'billingType' | 'mail' | 'usualPaymentForm' | 'type';
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.band = window.innerWidth > 640;
  }

  inputfilter: string = '';

  displayedColumns: string[] = [
    'fantasyName',
    'address',
    'billingType',
    'mail',
    'usualPaymentForm',
    'type',
  ];

  shops: Shop[] = [];
  allShops: Shop[] = [];
  column!: allowedColumns;

  band: boolean = true;
  titulo = 'Crear Comercio';
  fantasyName: string = '';
  fantasyNameInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  message: string = '';
  messageAboutShops: string = 'No hay comercios para mostrar.';

  showingNewShop = false;
  continueNewShop = false;

  visibleContent: { [key: string]: boolean } = {};

  sortColumnKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  rotationAngle: number = 0;
  rotationAngles: { [key: string]: number } = {};

  rotateIcon() {
    this.rotationAngle += 180;
  }

  constructor(  private _shopService: MyDataService, public dialog: MatDialog) {  }

  ngOnInit(): void {
    this.getComercios();
  }

  // lógica transición flecha y ordenamiento
  markedText: boolean = false;
  click: number = 0;
  salb: boolean = false;
  entb: boolean = false;
  enter: boolean = true;

  marcarNegrita(key: allowedColumns) {

    if(!(this.column === key)) {
      this.click = 0;
    }

    this.click = this.click + 1;

    if(this.click == 3) {
      this.enter = false;
      this.click = 0;
    };

    this.column = key;
    this.sortColumn(key);
    
  }
  output() {
    if (this.click == 0) {
      this.entb = false;
      this.salb = true;

      // Restablecer posición inicial después de un tiempo suficiente para que termine la transición
      setTimeout(() => {
        this.salb = false;
      }, 200); // 300ms es la duración de la transición
    }
  }

  input() {
    if (this.click == 0) {
      this.enter = true;
      this.entb = true;
    }
  }

  confirmDelete(shop: Shop): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { name: shop.fantasyName }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._shopService.deleteShop(shop).subscribe({
          next: (response: any) => {
            this.getComercios();
          },
          error: (error: any) => {
            //console.log(error); caombiar por un pomnpout de error
            console.log(error)
          },
        });
      }
    });
  }

  openEditDialog(shop: Shop) {
    const dialogRef = this.dialog.open(EditShopComponent, {
      width: '500px',
      data: shop
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getComercios();
      }
    });
  }

  noShops: boolean = false;

  filterTable() {
    const filterValue = this.normalizeString(
      this.inputfilter.toLowerCase().trim()
    );

    if (!filterValue) {
      this.shops = [...this.allShops];
    } else {
      this.shops = this.allShops.filter((Shop) =>
        Object.values(Shop).some(
          (value) =>
            value &&
            this.normalizeString(value.toString().toLowerCase()).includes(
              filterValue
            )
        )
      );
    }

    if (this.shops.length === 0) {
      this.messageAboutShops = 'No coincide con la búsqueda.';
    }
  }

  normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  sortColumn(columnKey: string) {
    if (this.sortColumnKey === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

      if (this.sortOrder === 'asc') {
        this.shops = this.allShops.slice();
        this.sortColumnKey = '';
      }
    } else {
      this.sortOrder = 'asc';
      this.sortColumnKey = columnKey; // sortColumnKey = 'fantasyName'
    }

    this.sortTable();
  }

  sortTable() {
    if (this.sortColumnKey) {
      const compareFunction = (a: Shop, b: Shop, key: keyof Shop) => {
        const valueA = (a[key] || '').toString().toLowerCase();
        const valueB = (b[key] || '').toString().toLowerCase();
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      };

      if (Object.keys(this.shops[0]).includes(this.sortColumnKey)) {
        this.shops.sort((a, b) =>
          compareFunction(a, b, this.sortColumnKey as keyof Shop)
        );
      }
    }
  }


  
  getComercios() {
    if (this.cuit) {
      this._shopService.getShopsByCuit(this.cuit).subscribe({
        next: (response: any) => {
          this.allShops = response.data.slice();
          this.shops = response.data;
          this.length = this.shops.length;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    } else {
      console.error('Cuit no proporcionado.');
    }
  }

  toggleCardContent(shop: Shop) {
    this.rotationAngles[shop.fantasyName] =
      (this.rotationAngles[shop.fantasyName] || 0) + 180;
    this.visibleContent[shop.fantasyName] =
      !this.visibleContent[shop.fantasyName];
  }

  isScreenSmall(): boolean {
    // Verificar si el tamaño de la pantalla es 'sm' o menor
    return window.innerWidth <= 640; // Ajusta según tus necesidades
  }



  pageSize: number = 5;
  currentPage: number = 0; // Página actual

  canNavigateBack(): boolean {
    return this.currentPage > 0;
  }

  canNavigateForward(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.shops.length;
  }

  navigateBack(): void {
    if (this.canNavigateBack()) {
      this.currentPage--;
    }
  }

  navigateForward(): void {
    if (this.canNavigateForward()) {
      this.currentPage++;
    }
  }

  getDisplayedShops(): Shop[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.shops.length);
    return this.shops.slice(startIndex, endIndex);
  }


  determineRowColor(index: number): string {
    const alternatingColors = ["bg-gray-100", "bg-white"];
    return alternatingColors[index % alternatingColors.length];
  }


  length: number = 0;
  pageIndex = 0;
  pageSizeOptions = [3, 5, 10, 25];
  pageSizeNumber = 5;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

}