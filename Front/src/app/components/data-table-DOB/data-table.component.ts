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
  id: string;
  order: string;
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

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

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
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filter = filterValue;

    this.filteredItems = this.items.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(filterValue)
      )
    );

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
