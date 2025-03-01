import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface ContractData {
  id: number;
  dateFrom: string;
  dateTo: string;
  regDate: string;
  obs: string;
}

@Component({
  selector: 'app-data-selection-table',
  templateUrl: './data-selection-table.component.html',
  styleUrl: './data-selection-table.component.scss'
})
export class DataSelectionTableComponent {

  displayedColumns: string[] = ['id', 'dateFrom', 'dateTo', 'regDate', 'obs', 'selected'];
  dataSource: MatTableDataSource<ContractData>;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  selectedRowId: number | null = null; // Almacena la fila seleccionada

  constructor() {
    const contrataciones: ContractData[] = [
      { id: 1, dateFrom: '2024-01-01', dateTo: '2024-01-15', regDate: '2024-01-10', obs: 'Contrato inicial' },
      { id: 2, dateFrom: '2024-02-01', dateTo: '2024-02-10', regDate: '2024-02-05', obs: '' },
      { id: 3, dateFrom: '2024-03-01', dateTo: '2024-03-10', regDate: '2024-03-07', obs: 'Firma electrónica' },
      { id: 4, dateFrom: '2024-04-01', dateTo: '2024-04-12', regDate: '2024-04-08', obs: 'Renovación' },
      { id: 5, dateFrom: '2024-05-01', dateTo: '2024-05-05', regDate: '2024-05-03', obs: '' },
      { id: 6, dateFrom: '2024-06-01', dateTo: '2024-06-15', regDate: '2024-06-10', obs: 'Urgente' },
      { id: 7, dateFrom: '2024-07-01', dateTo: '2024-07-10', regDate: '2024-07-05', obs: 'Contratación final' },
      { id: 8, dateFrom: '2024-08-01', dateTo: '2024-08-10', regDate: '2024-08-07', obs: '' },
      { id: 9, dateFrom: '2024-09-01', dateTo: '2024-09-15', regDate: '2024-09-10', obs: '' },
      { id: 10, dateFrom: '2024-10-01', dateTo: '2024-10-15', regDate: '2024-10-12', obs: 'Nuevo acuerdo' },
    ];

    this.dataSource = new MatTableDataSource(contrataciones);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectRow(row: ContractData) {
    this.selectedRowId = row.id;
  }
}
