import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Trade } from 'src/app/models/trade';
import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss']
})
export class NuevoComercioComponent implements AfterViewInit {

  tradeForm: FormGroup;
  titulo = "Crear Comercio";
  id: string | null;

  cuit: string;
  razonSocial: string;
  condicionFinal: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private _tradeService: MyDataService,
              private aRouter: ActivatedRoute,
              private sharedDataService: SharedDataService) {

    this.tradeForm = this.fb.group({
      fantasyName: ['', Validators.required],
      address: ['', Validators.required],
      billingType: ['', Validators.required],
      mail: ['', Validators.required],
      usualPaymentForm: ['', Validators.required],
      type: ['', Validators.required]
    })

    this.id = this.aRouter.snapshot.paramMap.get('id');

    this.cuit = this.sharedDataService.getCuit();
    this.razonSocial = this.sharedDataService.getRazonSocial();
    this.condicionFinal = this.sharedDataService.getCondicionFinal();

  }

  addTrade() {
    
    const TRADE: Trade = { 
      fantasyName: this.tradeForm.get('fantasyName')?.value,
      address: this.tradeForm.get('address')?.value,
      billingType: this.tradeForm.get('billingType')?.value,
      mail: this.tradeForm.get('mail')?.value,
      usualPaymentForm: this.tradeForm.get('usualPaymentForm')?.value,
      type: this.tradeForm.get('type')?.value

    };

    if(this.id == null) {
      this._tradeService.createTrade(TRADE).subscribe(data => {
      this.router.navigate(['/']);
      }, error => {
        console.log(error);
        this.tradeForm.reset();
      });
    }

    

  }


  mostrarNuevoComercio = false;
  continuarNuevoComercio = false;

  
  displayedColumns: string[] = ['name', 'address', 'billingType', 'email', 'wayToPay', 'type'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  showNewTrade() {
    this.mostrarNuevoComercio = true;
  }

  continueWithNewTrade() {
    this.continuarNuevoComercio = true;
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

