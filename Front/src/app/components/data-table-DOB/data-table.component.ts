import { Component, Input, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'badge';
}

interface Item {
  index: number;
  id: string;
  order: string;
  spotName: string;
  fantasyName: string;
}

@Component({
  selector: 'app-data-table-dob',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponentDOB implements AfterViewInit {
  @Input() items: Item[] = [];
  @Input() columns: Column[] = [];
  noDataMessage: string = 'No se encontraron coincidencias.';

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Item>;
  filteredItems: Item[] = [];
  panelOpenState = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
    @ViewChild('mobilePaginator') mobilePaginator!: MatPaginator; // Paginador para móvil

  isMobile: boolean = window.innerWidth <= 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.key);
    this.dataSource.data = this.items;
    this.filteredItems = this.items;

        // Asigna el paginador móvil después de que los filteredItems estén disponibles
    if (this.mobilePaginator) {
      this.mobilePaginator.length = this.filteredItems.length;
    }
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;

        // Asigna el paginador móvil después de que los filteredItems estén disponibles
    if (this.mobilePaginator) {
      this.mobilePaginator.length = this.filteredItems.length;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.filteredItems = this.items.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(filterValue)
      )
    );

    if (this.mobilePaginator) {
      this.mobilePaginator.firstPage();
      this.mobilePaginator.length = this.filteredItems.length;
    }
  }
}