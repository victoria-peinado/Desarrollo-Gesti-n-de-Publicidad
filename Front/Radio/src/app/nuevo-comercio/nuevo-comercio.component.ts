import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Trade } from 'src/app/models/trade';
import { MyDataService } from 'src/app/services/my-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { ThemePalette } from '@angular/material/core';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-nuevo-comercio',
  templateUrl: './nuevo-comercio.component.html',
  styleUrls: ['./nuevo-comercio.component.scss'],
})
export class NuevoComercioComponent implements OnInit, AfterViewInit {
  @ViewChild('nombreFantasiaInput', { static: false }) nombreFantasiaInputRef!: ElementRef;

  displayedColumns: string[] = [
    'fantasyName',
    'address',
    'billingType',
    'mail',
    'usualPaymentForm',
    'type',
  ];
  dataSource: MatTableDataSource<Trade> = new MatTableDataSource<Trade>([]); // Inicializar con un arreglo vacío

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tradeForm: FormGroup;
  titulo = 'Crear Comercio';
  id: string | null;

  cuit: string;
  razonSocial: string;
  condicionFinal: string;
  nombreFantasia: string = '';
  coloring: ThemePalette = 'primary';
  nombreFantasiaInvalid: boolean = false;
  isButtonDisabled: boolean = true;
  message: string = '';

  mostrarNuevoComercio = false;
  continuarNuevoComercio = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _tradeService: MyDataService,
    private aRouter: ActivatedRoute,
    private sharedDataService: SharedDataService,
  ) {
    this.tradeForm = this.fb.group({
      fantasyName: ['', Validators.required],
      address: ['', Validators.required],
      billingType: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      usualPaymentForm: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.id = this.aRouter.snapshot.paramMap.get('id');

    this.cuit = this.sharedDataService.getCuit();
    this.razonSocial = this.sharedDataService.getRazonSocial();
    this.condicionFinal = this.sharedDataService.getCondicionFinal();
  }

  ngOnInit(): void {
    this.obtenerComercios();
  }

  getMailErrorMessage() {
    if (this.tradeForm.get('mail')?.hasError('required')) {
      return '*Este campo es obligatorio.';
    }

    return this.tradeForm.get('mail')?.hasError('email') ? 'Email inválido.' : '';
  }

  obtenerComercios() {
    if(this.cuit) {
    this._tradeService.getTradesByCuit(this.cuit).subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.log(error);
      }
    );
    } else {
      console.error(' cuit no proporcionado.');
    }
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
            billingHolderId: billingHolderId,
          };

          this.createTrade(TRADE);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('El CUIT no está definido.');
    }
  }

  createTrade(TRADE: Trade) {
    this._tradeService.createTrade(TRADE).subscribe(
      (data) => {
        this.obtenerComercios();
      },
      (error) => {
        console.log(error);
        this.tradeForm.reset();
      }
    );
  }

  showNewTrade() {
    this.mostrarNuevoComercio = true;
  }

  continueWithNewTrade() {
    this.continuarNuevoComercio = true;
  }

  alertUser() {
    return '*Este campo es obligatorio.'
  }

  alertUserAboutError(mess: string) {
    this.nombreFantasiaInvalid = true;
    this.coloring = 'warn';
    this.message = mess;

    const cuitInputElement = this.nombreFantasiaInputRef.nativeElement;
    cuitInputElement.click();
    cuitInputElement.focus();
  }

  verifyNameFantasy() {
    this.nombreFantasia = this.nombreFantasiaInputRef.nativeElement.value;
    if (this.nombreFantasia && this.cuit) {
      
      this._tradeService.getTradesByFantasyNameAndCUIT(this.nombreFantasia, this.cuit).subscribe(
          (trades: Trade[]) => {
            if (
              trades &&
              trades.some((trade) => trade.fantasyName === this.nombreFantasia)
            ) {
              this.alertUserAboutError(
                'Nombre de fantasía <strong>repetido</strong>'
              );
            } else {
              this.addTrade();
              this.continueWithNewTrade();
              alert('Comercio añadido exitosamente');
            }
          },
          (error: any) => {
            console.error('Error en la solicitud:', error);
            this.alertUserAboutError(
              'Error al verificar el nombre de fantasía.'
            );
          }
        );
    } else {
      console.error('Nombre de fantasía o cuit no proporcionados.');
    }
  }
}
