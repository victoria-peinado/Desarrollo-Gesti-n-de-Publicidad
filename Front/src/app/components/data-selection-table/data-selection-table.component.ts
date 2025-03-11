import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnChanges,
  HostListener,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Contract } from 'src/app/models/contract';

export interface ColumnDefinition {
  key: string;
  label: string;
}

@Component({
  selector: 'app-data-selection-table',
  templateUrl: './data-selection-table.component.html',
  styleUrl: './data-selection-table.component.scss',
})
export class DataSelectionTableComponent implements AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Output() rowSelected = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  filteredContracts: Contract[] = [];

  noDataMessage: string = 'No se encontraron coincidencias.';
  panelOpenState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  selectedRowId: number | null = null;

  constructor(private _liveAnnouncer: LiveAnnouncer) {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnChanges() {
    this.dataSource.data = this.data.map((item) => ({
      ...item,
      estado: this.getEstado(item.dateFrom, item.dateTo),
    }));
    this.displayedColumns = this.columns
      .filter((col) => col.key !== 'id')
      .map((col) => col.key);
    this.displayedColumns.push('estado');
    this.displayedColumns.push('selected');
    this.filteredContracts = this.data;
  }

  isMobile: boolean = window.innerWidth <= 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    this.filteredContracts = this.data.filter((contract) =>
      Object.values(contract).some(
        (value) =>
          typeof value === 'string' && value.toLowerCase().includes(filterValue)
      )
    );

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEstado(dateFrom: string | undefined, dateTo: string | undefined): string {
    if (!dateFrom || !dateTo) return 'No iniciada';
    const today = new Date().toISOString().split('T')[0];
    
    if (dateFrom > today) {
      return 'No iniciada';
    }
  
    return dateTo < today ? 'Finalizada' : 'En curso';
  }
  

  getBadgeClass(estado: string): string {
    return {
      'Finalizada': 'bg-[#FFD5D6] text-[#BB0003] py-1 px-3 rounded-lg text-xs',
      'En curso': 'bg-[#D6FFD4] text-[#01BB05] py-1 px-3 rounded-lg text-xs',
      'No iniciada': 'bg-[#D6D6D6] text-[#3B3B3B] py-1 px-3 rounded-lg text-xs',
    }[estado] || 'bg-gray-200 text-black py-1 px-3 rounded-lg text-xs';
  }
  
  isSelectable(row: any): boolean {
    return row.estado !== 'Finalizada';
  }
  
  selectRow(row: any) {

    if (this.isSelectable(row)) {
      this.selectedRowId = row.id;
      this.rowSelected.emit(row);
    }
  }

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
