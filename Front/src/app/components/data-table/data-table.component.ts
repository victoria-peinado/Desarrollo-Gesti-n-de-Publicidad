import { Component, Input, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Shop } from 'src/app/models/shop';
import { LiveAnnouncer } from '@angular/cdk/a11y';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'badge';
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit {
  @Input() shops: Shop[] = [];
  @Input() columns: Column[] = [];
  noDataMessage: string = 'No se encontraron coincidencias.';

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Shop>;
  filteredShops: Shop[] = [];

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  
  isMobile: boolean = window.innerWidth <= 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  panelOpenState = false;

  constructor(private _liveAnnouncer: LiveAnnouncer) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.key);
    this.dataSource.data = this.shops;
    this.filteredShops = this.shops;
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Filtrar la tabla
    this.dataSource.filter = filterValue;

    // Filtrar también las tarjetas
    this.filteredShops = this.shops.filter(shop => 
      Object.values(shop).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(filterValue)
      )
    );

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getBadgeClass(type: string): string {
    return {
      'Empresa': 'bg-[#FFD5FF] text-[#BB01B7] py-1 px-3 rounded-lg text-xs',
      'PyME': 'bg-[#D7E3FF] text-[#005CBB] py-1 px-3 rounded-lg text-xs',
      'Minorista': 'bg-[#D6FFD4] text-[#01BB05] py-1 px-3 rounded-lg text-xs',
      'Mayorista': 'bg-[#FFEAD4] text-[#BB7200] py-1 px-3 rounded-lg text-xs',
      'Distribuidor': 'bg-[#FFD5D6] text-[#BB0003] py-1 px-3 rounded-lg text-xs',
      'Otro': 'bg-[#D6D6D6] text-[#3B3B3B] py-1 px-3 rounded-lg text-xs'
    }[type] || 'bg-gray-200 text-black py-1 px-3 rounded-lg text-xs';
  }

  announceSortChange(sortState: Sort) {
  
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
}
