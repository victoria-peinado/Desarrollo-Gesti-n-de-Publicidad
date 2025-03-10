import { AfterViewInit, Component, Input, Output, ViewChild, EventEmitter, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface ColumnDefinition {
  key: string;
  label: string;
}

@Component({
  selector: 'app-data-selection-table',
  templateUrl: './data-selection-table.component.html',
  styleUrl: './data-selection-table.component.scss'
})
export class DataSelectionTableComponent implements AfterViewInit, OnChanges {

  @Input() data: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Output() rowSelected = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  selectedRowId: number | null = null;

  constructor() {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnChanges() {
    this.dataSource.data = this.data.map(item => ({
      ...item,
      estado: this.getEstado(item.dateTo) // Calcula el estado al cargar los datos
    }));
    this.displayedColumns = this.columns.filter(col => col.key !== 'id').map(col => col.key);
    this.displayedColumns.push('estado'); // Agrega columna Estado
    this.displayedColumns.push('selected'); // Agrega columna de selección
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEstado(dateTo: string | null): string {
    if (!dateTo) return 'Sin fecha fin';
    const today = new Date().toISOString().split('T')[0];
    return dateTo < today ? 'Finalizada' : 'En curso';
  }

  getBadgeClass(estado: string): string {
    return {
      'Finalizada': 'bg-[#FFD5D6] text-[#BB0003] py-1 px-3 rounded-lg text-xs',
      'En curso': 'bg-[#D6FFD4] text-[#01BB05] py-1 px-3 rounded-lg text-xs',
      'Sin fecha fin': 'bg-[#D7E3FF] text-[#005CBB] py-1 px-3 rounded-lg text-xs'
    }[estado] || 'bg-gray-200 text-black py-1 px-3 rounded-lg text-xs';
  }

  isSelectable(row: any): boolean {
    return row.estado === 'En curso' || row.estado === 'Sin fecha fin';
  }

  selectRow(row: any) {
    if (this.isSelectable(row)) {
      this.selectedRowId = row.id;
      console.log('Row selected:', row);
      this.rowSelected.emit(row);
    }
  }
}
