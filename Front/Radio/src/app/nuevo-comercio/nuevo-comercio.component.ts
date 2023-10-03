import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss']
})
export class NuevoComercioComponent implements AfterViewInit {
  cuit: string = '11-11111111-1';
  razonSocial: string = "Juan Perez";
  condicionFinal: string = "Responsable inscripto";
  
  displayedColumns: string[] = ['name', 'address', 'billingType', 'email', 'wayToPay', 'type'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  name: string;
  address: string;
  billingType: string;
  email: string;
  wayToPay: string;
  type: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Transporte DJJB', address: '12 abril 0596', billingType: 'RI', email: 'djjb@gmail.com', wayToPay: 'efectivo', type: 'PyME'}
];
