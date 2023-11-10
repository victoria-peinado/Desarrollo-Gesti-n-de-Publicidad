import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Trade } from 'src/app/models/trade';
import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { ThemePalette } from '@angular/material/core/index.js';

@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss']
})
export class NuevoComercioComponent implements AfterViewInit {
  @ViewChild('nombreFantasiaInput', { static: false }) cuitInputRef!: ElementRef;

  tradeForm: FormGroup;
  titulo = "Crear Comercio";
  id: string | null;

  cuit: string;
  razonSocial: string;
  condicionFinal: string;
  nombreFantasia: string = '';
  coloring: ThemePalette = 'primary';
  cuitInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  message: string = '';

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
  if (this.cuit) {
    this._tradeService.getBillingHolderByCUIT(this.cuit).subscribe(
      (billingHolderId: any) => {
        const TRADE: Trade = { 
          fantasyName: this.tradeForm.get('fantasyName')?.value,
          address: this.tradeForm.get('address')?.value,
          billingType: this.tradeForm.get('billingType')?.value,
          mail: this.tradeForm.get('mail')?.value,
          usualPaymentForm: this.tradeForm.get('usualPaymentForm')?.value,
          type: this.tradeForm.get('type')?.value,
          billingHolderId: billingHolderId
        };
        
        this.createTrade(TRADE);
      },
      error => {
        console.error(error);
      }
    );
  } else {
    console.error('El CUIT no está definido.');
  }
}

createTrade(TRADE: Trade) {
  this._tradeService.createTrade(TRADE).subscribe(data => {
    this.router.navigate(['/']);
  }, error => {
    console.log(error);
    this.tradeForm.reset();
  });
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


  onInput() {
    this.isButtonDisabled = !this.nombreFantasia;

    if (this.isButtonDisabled) {
      this.alertUserAboutError('*Este campo es <strong>obligatorio</strong>.');
    } else {
      this.cuitInvalid = false;
      this.coloring = 'primary';
    }
  }

  alertUserAboutError(mess: string) {
    this.cuitInvalid = true;
    this.coloring = 'warn';
    this.message = mess;

    const cuitInputElement = this.cuitInputRef.nativeElement;
    cuitInputElement.click();
    cuitInputElement.focus();
  }

  verifyNameFantasy() {

    if (this.nombreFantasia && this.cuit) {

      this._tradeService.getTradesByFantasyNameAndCUIT(this.nombreFantasia, this.cuit).subscribe(
        (trades: Trade[]) => {
  
          if (trades && trades.some(trade => trade.fantasyName === this.nombreFantasia)) {
            this.alertUserAboutError("Nombre de fantasía <strong>repetido</strong>");
          } else {
            this.continueWithNewTrade();
          }
        },
        (error: any) => {
          console.error('Error en la solicitud:', error);
          this.alertUserAboutError("Error al verificar el nombre de fantasía.");
        }
      );
    } else {
      console.error("Nombre de fantasía o cuit no proporcionados.");
    }
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

