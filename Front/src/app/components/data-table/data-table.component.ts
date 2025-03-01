import { Component, HostListener, Input } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Shop } from 'src/app/models/shop';
import { MatDialog } from '@angular/material/dialog';
import { MyDataService } from 'src/app/services/my-data.service';

interface ColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'badge';
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {



  @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      this.band = window.innerWidth > 640;
    }

  @Input() shops: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';

  filterText: string = '';
  sortedColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredData: any[] = [];
  band: boolean = true;
  visibleContent: { [key: string]: boolean } = {};
  rotationAngle: number = 0;
  rotationAngles: { [key: string]: number } = {};
  allShops: Shop[] = [];
  private cuit: string = '';

  ngOnInit(): void {
    this.filteredData = [...this.shops];
    console.log(this.filteredData);
  }

  constructor(public dialog: MatDialog, private _shopService: MyDataService) {}

  filterTable(): void {
    this.filteredData = this.shops.filter(row =>
      this.columns.some(col => 
        row[col.key]?.toString().toLowerCase().includes(this.filterText.toLowerCase())
      )
    );
  }

  sortColumn(column: string): void {
    if (this.sortedColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortOrder = 'asc';
    }
    this.filteredData.sort((a, b) => 
      this.sortOrder === 'asc' 
        ? (a[column] > b[column] ? 1 : -1) 
        : (a[column] < b[column] ? 1 : -1)
    );
  }

  getBadgeClass(type: string): string {
    return {
      'Empresa': 'bg-violet-400 text-violet-800',
      'PyME': 'bg-green-400 text-green-800',
      'Otro': 'bg-gray-400 text-black'
    }[type] || '';
  }

  deleteRow(row: any): void {
    console.log('Eliminar:', row);
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

  getComercios() {
    if (this.cuit) {
      this._shopService.getShopsByCuit(this.cuit).subscribe({
        next: (response: any) => {
          this.allShops = response.data.slice();
          this.shops = response.data;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    } else {
      console.error('Cuit no proporcionado.');
    }
  }
}
